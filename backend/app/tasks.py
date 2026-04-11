from datetime import datetime, timezone

from pymongo import MongoClient

from .celery_app import celery_app
from .config import settings
from .models.pipeline import (
    download_data,
    split_data,
    generate_explanation,
    series_to_points,
)
from .models.moving_average import run_moving_average
from .models.arima_model import run_arima
from .models.xgboost_model import run_xgboost
from .models.lstm_model import run_lstm

MODEL_RUNNERS = {
    "moving_average": run_moving_average,
    "arima": run_arima,
    "xgboost": run_xgboost,
    "lstm": run_lstm,
}

INT_PARAMS = {
    "window", "p", "d", "q",
    "n_estimators", "max_depth",
    "epochs", "units", "seq_length",
}


@celery_app.task(bind=True, name="app.tasks.run_analysis")
def run_analysis(self, req_dict: dict, user_id: str) -> dict:
    def progress(step: str):
        self.update_state(state="PROGRESS", meta={"step": step})

    # 1 — Download data
    progress("Downloading market data...")
    df = download_data(
        req_dict["ticker"],
        req_dict["start_date"],
        req_dict["end_date"],
        req_dict["interval"],
    )
    train, test = split_data(df, req_dict.get("train_test_split", 0.8))

    # 2 — Train each selected model
    results = []
    hyperparams = req_dict.get("hyperparameters", {})

    for model_name in req_dict["models"]:
        runner = MODEL_RUNNERS.get(model_name)
        if not runner:
            continue
        label = model_name.replace("_", " ").title()
        progress(f"Training {label}...")

        hp = hyperparams.get(model_name, {})
        kwargs = {k: int(v) if k in INT_PARAMS else float(v) for k, v in hp.items()}
        results.append(runner(train, test, **kwargs))

    if not results:
        raise ValueError("No models produced results.")

    # 3 — Compute best model and build explanation
    progress("Computing metrics...")
    best = min(results, key=lambda r: r["metrics"]["rmse"])
    explanation = generate_explanation(results, best["model"])

    now = datetime.now(timezone.utc).isoformat()
    output = {
        "request": req_dict,
        "historical_data": series_to_points(df["Close"]),
        "train_data": series_to_points(train["Close"]),
        "test_data": series_to_points(test["Close"]),
        "predictions": results,
        "best_model": best["model"],
        "llm_explanation": explanation,
        "created_at": now,
    }

    # 4 — Persist to MongoDB (synchronous PyMongo — fine inside Celery worker)
    progress("Saving results...")
    client = MongoClient(settings.MONGODB_URL)
    db = client[settings.DB_NAME]
    inserted = db.analyses.insert_one({"user_id": user_id, **output})
    client.close()

    output["id"] = str(inserted.inserted_id)
    return output
