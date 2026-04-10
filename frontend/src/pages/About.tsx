import { motion } from 'framer-motion';
import { BookOpen, BarChart3, Brain, Layers } from 'lucide-react';

const models = [
  {
    name: 'Moving Average',
    icon: <BarChart3 className="w-5 h-5" />,
    description:
      'A simple baseline model that predicts future values as the average of a sliding window of past observations. Great for understanding trend direction but lags behind sudden changes.',
    pros: ['Simple and interpretable', 'Fast computation', 'Good baseline'],
    cons: ['Lags behind trends', 'Cannot capture non-linear patterns', 'No uncertainty estimates'],
  },
  {
    name: 'ARIMA',
    icon: <BarChart3 className="w-5 h-5" />,
    description:
      'AutoRegressive Integrated Moving Average combines autoregression, differencing, and moving average components. Effective for stationary time series with linear patterns.',
    pros: ['Captures linear trends', 'Well-studied theory', 'Confidence intervals'],
    cons: ['Assumes linearity', 'Requires stationarity', 'Manual parameter tuning'],
  },
  {
    name: 'XGBoost',
    icon: <Layers className="w-5 h-5" />,
    description:
      'Extreme Gradient Boosting uses an ensemble of decision trees with engineered features (lags, rolling stats, technical indicators). Powerful for structured tabular data.',
    pros: ['Handles non-linearity', 'Feature importance built-in', 'Fast training'],
    cons: ['Requires feature engineering', 'No native sequence awareness', 'Can overfit'],
  },
  {
    name: 'LSTM',
    icon: <Brain className="w-5 h-5" />,
    description:
      'Long Short-Term Memory networks are deep learning models designed for sequential data. They learn complex temporal dependencies across multiple time horizons.',
    pros: ['Learns complex patterns', 'Handles long dependencies', 'No manual features needed'],
    cons: ['Slow to train', 'Requires more data', 'Black box'],
  },
];

const metrics = [
  { name: 'MAE (Mean Absolute Error)', formula: 'Σ|actual - predicted| / n', explanation: 'Average size of mistakes, in the same units as the price. Lower = better.' },
  { name: 'RMSE (Root Mean Square Error)', formula: '√(Σ(actual - predicted)² / n)', explanation: 'Like MAE but penalizes big mistakes more heavily. The primary ranking metric.' },
  { name: 'MAPE (Mean Absolute % Error)', formula: 'Σ|actual - predicted| / actual × 100', explanation: 'Percentage error — useful for comparing across different stock price ranges.' },
  { name: 'R² (R-Squared)', formula: '1 - SS_res / SS_tot', explanation: 'How much of the price movement the model explains. 1.0 = perfect, 0 = random.' },
  { name: 'Directional Accuracy', formula: 'Correct direction predictions / total', explanation: 'What % of the time the model correctly predicts whether the price goes up or down.' },
];

export default function About() {
  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container px-6 max-w-5xl">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <span className="section-label flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" /> Methodology
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-1 mb-3">
            How Financial Model Lab Works
          </h1>
          <p className="text-muted-foreground max-w-2xl mb-14 leading-relaxed">
            Understand the forecasting models, evaluation metrics, and methodology behind every comparison.
          </p>
        </motion.div>

        {/* Models */}
        <section className="mb-16">
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">Forecasting Models</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {models.map((model, i) => (
              <motion.div
                key={model.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-6"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    {model.icon}
                  </div>
                  <h3 className="font-display font-semibold text-foreground">{model.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{model.description}</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="font-semibold text-chart-up">Strengths</span>
                    <ul className="mt-1 space-y-1 text-muted-foreground">
                      {model.pros.map((p) => <li key={p}>+ {p}</li>)}
                    </ul>
                  </div>
                  <div>
                    <span className="font-semibold text-destructive">Limitations</span>
                    <ul className="mt-1 space-y-1 text-muted-foreground">
                      {model.cons.map((c) => <li key={c}>− {c}</li>)}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Metrics */}
        <section className="mb-16">
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">Evaluation Metrics</h2>
          <div className="space-y-3">
            {metrics.map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="glass-panel p-5"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <div className="flex-1">
                    <h3 className="font-display font-semibold text-foreground text-sm">{m.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{m.explanation}</p>
                  </div>
                  <code className="text-xs font-mono text-primary bg-primary/10 px-3 py-1.5 rounded-md whitespace-nowrap">
                    {m.formula}
                  </code>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* API Endpoints */}
        <section>
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">Backend API (Reference)</h2>
          <div className="glass-panel overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Method</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Endpoint</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Description</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {[
                  ['GET', '/health', 'Health check'],
                  ['POST', '/api/v1/analyze', 'Run model comparison'],
                  ['GET', '/api/v1/analyses', 'List past analyses'],
                  ['GET', '/api/v1/analyses/:id', 'Get analysis details'],
                  ['DELETE', '/api/v1/analyses/:id', 'Delete an analysis'],
                  ['GET', '/api/v1/tickers/search?q=', 'Search ticker symbols'],
                ].map(([method, path, desc]) => (
                  <tr key={path} className="border-b border-border/20">
                    <td className="px-5 py-3 font-mono font-semibold text-primary">{method}</td>
                    <td className="px-5 py-3 font-mono text-foreground">{path}</td>
                    <td className="px-5 py-3 text-muted-foreground">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
