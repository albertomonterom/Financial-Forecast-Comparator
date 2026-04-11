from pydantic import BaseModel
from typing import Optional


class AnalysisRequest(BaseModel):
    ticker: str
    start_date: str
    end_date: str
    interval: str = "1d"
    models: list[str]
    hyperparameters: dict[str, dict[str, float]] = {}
    train_test_split: float = 0.8


class TimeSeriesPoint(BaseModel):
    date: str
    value: float


class ModelMetrics(BaseModel):
    mae: float
    rmse: float
    mape: float
    r_squared: float
    direction_accuracy: float


class ModelPrediction(BaseModel):
    model: str
    predictions: list[TimeSeriesPoint]
    metrics: ModelMetrics
    training_time_ms: float


class LLMExplanation(BaseModel):
    summary: str
    model_insights: dict[str, str]
    recommendation: str
    key_takeaways: list[str]
    beginner_explanation: str


class AnalysisResponse(BaseModel):
    id: str
    request: AnalysisRequest
    historical_data: list[TimeSeriesPoint]
    train_data: list[TimeSeriesPoint]
    test_data: list[TimeSeriesPoint]
    predictions: list[ModelPrediction]
    best_model: str
    llm_explanation: LLMExplanation
    created_at: str


class AnalysisHistoryItem(BaseModel):
    id: str
    ticker: str
    models: list[str]
    best_model: str
    best_rmse: float
    created_at: str
