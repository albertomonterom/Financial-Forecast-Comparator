// Typed interfaces for the Financial Model Lab API

export type ModelType = 'moving_average' | 'arima' | 'xgboost' | 'lstm';
export type SamplingInterval = '1d' | '1wk' | '1mo';

export interface AnalysisRequest {
  ticker: string;
  start_date: string;
  end_date: string;
  interval: SamplingInterval;
  models: ModelType[];
  hyperparameters?: Record<ModelType, Record<string, number | string>>;
  train_test_split?: number; // 0-1, default 0.8
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
}

export interface ModelPrediction {
  model: ModelType;
  predictions: TimeSeriesPoint[];
  metrics: ModelMetrics;
  training_time_ms: number;
}

export interface ModelMetrics {
  mae: number;
  rmse: number;
  mape: number;
  r_squared: number;
  direction_accuracy: number;
}

export interface LLMExplanation {
  summary: string;
  model_insights: Record<ModelType, string>;
  recommendation: string;
  key_takeaways: string[];
  beginner_explanation: string;
}

export interface AnalysisResponse {
  id: string;
  request: AnalysisRequest;
  historical_data: TimeSeriesPoint[];
  train_data: TimeSeriesPoint[];
  test_data: TimeSeriesPoint[];
  predictions: ModelPrediction[];
  best_model: ModelType;
  llm_explanation: LLMExplanation;
  created_at: string;
}

export interface AnalysisHistoryItem {
  id: string;
  ticker: string;
  models: ModelType[];
  best_model: ModelType;
  best_rmse: number;
  created_at: string;
}

export interface HealthResponse {
  status: string;
  version: string;
}

// Suggested REST endpoints for the Python backend:
//
// GET  /health                     → HealthResponse
// POST /api/v1/analyze             → AnalysisResponse
// GET  /api/v1/analyses            → AnalysisHistoryItem[]
// GET  /api/v1/analyses/:id        → AnalysisResponse
// DELETE /api/v1/analyses/:id      → { success: boolean }
// GET  /api/v1/models              → ModelType[] (available models)
// GET  /api/v1/tickers/search?q=   → { symbol, name }[]
