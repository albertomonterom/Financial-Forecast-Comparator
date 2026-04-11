from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException

from ..celery_app import celery_app
from ..core.security import get_current_user
from ..database import db
from ..schemas.analysis import (
    AnalysisHistoryItem,
    AnalysisRequest,
    AnalysisResponse,
)
from ..tasks import run_analysis

router = APIRouter(prefix="/api/v1", tags=["analyze"])


# ---------------------------------------------------------------------------
# Submit analysis — returns task_id immediately, runs in Celery worker
# ---------------------------------------------------------------------------
@router.post("/analyze")
async def analyze(req: AnalysisRequest, user=Depends(get_current_user)):
    task = run_analysis.delay(req.model_dump(), str(user["_id"]))
    return {"task_id": task.id, "status": "pending"}


# ---------------------------------------------------------------------------
# Poll task status
# ---------------------------------------------------------------------------
@router.get("/tasks/{task_id}")
async def get_task_status(task_id: str, _=Depends(get_current_user)):
    task = celery_app.AsyncResult(task_id)

    if task.state == "PENDING":
        return {"status": "pending", "step": "Waiting in queue..."}

    if task.state == "STARTED":
        return {"status": "running", "step": "Starting..."}

    if task.state == "PROGRESS":
        return {"status": "running", "step": task.info.get("step", "")}

    if task.state == "SUCCESS":
        return {"status": "success", "result": task.result}

    if task.state == "FAILURE":
        return {"status": "failed", "error": str(task.result)}

    return {"status": task.state.lower(), "step": ""}


# ---------------------------------------------------------------------------
# History
# ---------------------------------------------------------------------------
@router.get("/analyses", response_model=list[AnalysisHistoryItem])
async def list_analyses(user=Depends(get_current_user)):
    cursor = (
        db.analyses.find(
            {"user_id": str(user["_id"])},
            {"request.ticker": 1, "request.models": 1, "best_model": 1,
             "predictions": 1, "created_at": 1},
        )
        .sort("created_at", -1)
        .limit(50)
    )
    items = []
    async for doc in cursor:
        best_model = doc.get("best_model", "")
        best_pred = next(
            (p for p in doc.get("predictions", []) if p["model"] == best_model), None
        )
        items.append(
            AnalysisHistoryItem(
                id=str(doc["_id"]),
                ticker=doc["request"]["ticker"],
                models=doc["request"]["models"],
                best_model=best_model,
                best_rmse=best_pred["metrics"]["rmse"] if best_pred else 0.0,
                created_at=doc.get("created_at", ""),
            )
        )
    return items


@router.get("/analyses/{analysis_id}", response_model=AnalysisResponse)
async def get_analysis(analysis_id: str, user=Depends(get_current_user)):
    try:
        oid = ObjectId(analysis_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid analysis ID")

    doc = await db.analyses.find_one({"_id": oid, "user_id": str(user["_id"])})
    if not doc:
        raise HTTPException(status_code=404, detail="Analysis not found")

    return AnalysisResponse(
        id=str(doc["_id"]),
        request=AnalysisRequest(**doc["request"]),
        historical_data=doc["historical_data"],
        train_data=doc["train_data"],
        test_data=doc["test_data"],
        predictions=doc["predictions"],
        best_model=doc["best_model"],
        llm_explanation=doc["llm_explanation"],
        created_at=doc.get("created_at", ""),
    )


@router.delete("/analyses/{analysis_id}")
async def delete_analysis(analysis_id: str, user=Depends(get_current_user)):
    try:
        oid = ObjectId(analysis_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid analysis ID")

    result = await db.analyses.delete_one({"_id": oid, "user_id": str(user["_id"])})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return {"success": True}
