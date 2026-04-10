import type {
  AnalysisResponse,
  AnalysisHistoryItem,
  TimeSeriesPoint,
  ModelPrediction,
  ModelType,
} from '@/types/api';

function generateTimeSeries(startDate: string, days: number, basePrice: number): TimeSeriesPoint[] {
  const points: TimeSeriesPoint[] = [];
  const start = new Date(startDate);
  let price = basePrice;
  for (let i = 0; i < days; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    price += (Math.random() - 0.48) * 3;
    price = Math.max(price * 0.95, price);
    points.push({ date: date.toISOString().split('T')[0], value: parseFloat(price.toFixed(2)) });
  }
  return points;
}

function generatePredictions(testData: TimeSeriesPoint[], model: ModelType, noise: number): ModelPrediction {
  const predictions = testData.map((p) => ({
    date: p.date,
    value: parseFloat((p.value + (Math.random() - 0.5) * noise).toFixed(2)),
  }));
  return {
    model,
    predictions,
    metrics: {
      mae: parseFloat((Math.random() * 3 + 1).toFixed(3)),
      rmse: parseFloat((Math.random() * 4 + 1.5).toFixed(3)),
      mape: parseFloat((Math.random() * 5 + 1).toFixed(2)),
      r_squared: parseFloat((0.85 + Math.random() * 0.12).toFixed(4)),
      direction_accuracy: parseFloat((60 + Math.random() * 30).toFixed(1)),
    },
    training_time_ms: Math.floor(Math.random() * 5000 + 200),
  };
}

const historical = generateTimeSeries('2024-01-01', 250, 180);
const splitIdx = Math.floor(historical.length * 0.8);
const trainData = historical.slice(0, splitIdx);
const testData = historical.slice(splitIdx);

export const mockAnalysis: AnalysisResponse = {
  id: 'mock-001',
  request: {
    ticker: 'AAPL',
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    interval: '1d',
    models: ['moving_average', 'arima', 'xgboost', 'lstm'],
    train_test_split: 0.8,
  },
  historical_data: historical,
  train_data: trainData,
  test_data: testData,
  predictions: [
    generatePredictions(testData, 'moving_average', 8),
    generatePredictions(testData, 'arima', 6),
    generatePredictions(testData, 'xgboost', 4),
    generatePredictions(testData, 'lstm', 3),
  ],
  best_model: 'lstm',
  llm_explanation: {
    summary:
      'LSTM outperformed all other models on AAPL daily data, capturing non-linear temporal dependencies that simpler models missed. XGBoost was a close second, benefiting from feature engineering on lagged returns.',
    model_insights: {
      moving_average:
        'The Moving Average model provides a smoothed baseline but lags behind actual price movements, especially during volatile periods.',
      arima:
        'ARIMA captured the overall trend well but struggled with sudden price jumps and non-stationary behavior in Q3.',
      xgboost:
        'XGBoost leveraged lagged features and technical indicators effectively, showing strong performance on trend-following days.',
      lstm:
        'LSTM learned complex temporal patterns across multiple time horizons, achieving the lowest RMSE and highest directional accuracy.',
    },
    recommendation:
      'For AAPL daily forecasting, LSTM is recommended for its superior accuracy. Consider ensemble approaches combining LSTM and XGBoost for production use.',
    key_takeaways: [
      'LSTM achieved 92.3% directional accuracy — the highest among all models',
      'XGBoost trained 10× faster than LSTM with only slightly lower accuracy',
      'Moving Average serves as a useful baseline but should not be used alone',
      'All models struggled during the earnings week in Q2, suggesting exogenous factors matter',
    ],
    beginner_explanation:
      "Think of these models like weather forecasters with different approaches. The Moving Average looks at recent history and assumes tomorrow will be similar — simple but limited. ARIMA is like a statistician who looks for patterns in how prices change over time. XGBoost is like a detective who examines many clues (past prices, volume, trends) to make predictions. LSTM is like someone with a photographic memory who remembers complex patterns from the past and uses them to predict the future. In this case, LSTM's 'memory' gave it an edge.",
  },
  created_at: '2025-01-15T10:30:00Z',
};

export const mockHistory: AnalysisHistoryItem[] = [
  { id: 'mock-001', ticker: 'AAPL', models: ['moving_average', 'arima', 'xgboost', 'lstm'], best_model: 'lstm', best_rmse: 2.14, created_at: '2025-01-15T10:30:00Z' },
  { id: 'mock-002', ticker: 'TSLA', models: ['arima', 'xgboost', 'lstm'], best_model: 'xgboost', best_rmse: 5.67, created_at: '2025-01-14T14:20:00Z' },
  { id: 'mock-003', ticker: 'MSFT', models: ['moving_average', 'arima'], best_model: 'arima', best_rmse: 1.89, created_at: '2025-01-13T09:15:00Z' },
  { id: 'mock-004', ticker: 'NVDA', models: ['xgboost', 'lstm'], best_model: 'lstm', best_rmse: 8.34, created_at: '2025-01-12T16:45:00Z' },
  { id: 'mock-005', ticker: 'GOOGL', models: ['moving_average', 'arima', 'xgboost', 'lstm'], best_model: 'lstm', best_rmse: 3.21, created_at: '2025-01-11T11:00:00Z' },
];

export const MODEL_LABELS: Record<ModelType, string> = {
  moving_average: 'Moving Average',
  arima: 'ARIMA',
  xgboost: 'XGBoost',
  lstm: 'LSTM',
};

export const MODEL_COLORS: Record<ModelType, string> = {
  moving_average: '#f97316',
  arima: '#06b6d4',
  xgboost: '#22c55e',
  lstm: '#a855f7',
};
