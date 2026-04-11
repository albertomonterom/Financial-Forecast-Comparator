import { motion } from 'framer-motion';
import { BookOpen, BarChart3, Brain, Layers, PlayCircle, Search, Calendar, SlidersHorizontal, FlaskConical, ChevronRight } from 'lucide-react';

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

        {/* How to use */}
        <section className="mb-16">
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">How to Use</h2>
          <p className="text-sm text-muted-foreground mb-8">Follow these steps to run your first forecast comparison.</p>

          {/* Steps */}
          <div className="space-y-4 mb-12">
            {[
              {
                icon: <Search className="w-4 h-4" />,
                step: '1',
                title: 'Choose a ticker',
                body: 'Type any stock symbol (e.g. AAPL, TSLA, SPY) in the Ticker Symbol field. The autocomplete will suggest matches from Yahoo Finance. Select one or type the symbol directly.',
              },
              {
                icon: <Calendar className="w-4 h-4" />,
                step: '2',
                title: 'Set a date range',
                body: 'Pick a start and end date. A minimum of 2 years of daily data is recommended so models have enough observations to train on. Very short ranges (< 6 months) may produce unreliable results.',
              },
              {
                icon: <SlidersHorizontal className="w-4 h-4" />,
                step: '3',
                title: 'Configure the analysis',
                body: 'Choose a sampling interval (Daily / Weekly / Monthly), select which models to compare, and set the train/test split. 80% training is a common starting point.',
              },
              {
                icon: <FlaskConical className="w-4 h-4" />,
                step: '4',
                title: 'Tune hyperparameters (optional)',
                body: 'Open Advanced Configuration to adjust model-specific parameters. Defaults are sensible for most assets. Hover the ? icons for per-parameter explanations.',
              },
              {
                icon: <PlayCircle className="w-4 h-4" />,
                step: '5',
                title: 'Run and interpret',
                body: 'Click Run Analysis. Each selected model trains on the training slice, then forecasts on the test slice. Results show predictions vs. actual prices plus error metrics for comparison.',
              },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-panel p-5 flex gap-4 items-start"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-bold text-sm">
                  {s.step}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-primary">{s.icon}</span>
                    <h3 className="font-display font-semibold text-foreground text-sm">{s.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.body}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Parameters reference */}
          <h3 className="font-display text-lg font-bold text-foreground mb-4">Configuration Parameters</h3>
          <div className="space-y-3 mb-12">
            {[
              {
                param: 'Sampling Interval',
                values: 'Daily · Weekly · Monthly',
                detail: 'Controls how price data is resampled. Daily gives ~250 data points per year and captures intraday volatility. Weekly (~52/yr) and Monthly (~12/yr) smooth noise and train faster but lose granularity. Use Daily for short-range studies (< 2 years); Weekly/Monthly for multi-year datasets.',
              },
              {
                param: 'Train / Test Split',
                values: '50% – 95%',
                detail: 'The fraction of the date range used for training. The remaining fraction is the held-out test set — the model never sees it during training, and predictions on it are compared to real prices to compute error metrics. 80% is the standard default; increase to 90% if you have less than 1 year of data.',
              },
            ].map((row) => (
              <div key={row.param} className="glass-panel p-5">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                  <h4 className="font-display font-semibold text-foreground text-sm">{row.param}</h4>
                  <ChevronRight className="w-3 h-3 text-muted-foreground hidden md:block" />
                  <code className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">{row.values}</code>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{row.detail}</p>
              </div>
            ))}
          </div>

          {/* Hyperparameters per model */}
          <h3 className="font-display text-lg font-bold text-foreground mb-4">Model Hyperparameters</h3>
          <div className="space-y-5">
            {[
              {
                model: 'Moving Average',
                color: 'text-chart-1',
                params: [
                  { name: 'Window', range: '5 – 100', tip: 'Number of past periods averaged. A window of 20 corresponds to ~1 trading month. Smaller windows react faster to price changes; larger windows are smoother but slower to turn.' },
                ],
              },
              {
                model: 'ARIMA',
                color: 'text-chart-2',
                params: [
                  { name: 'p — AR order', range: '0 – 10', tip: 'How many past values the autoregressive term uses. Start at 1–3 for daily data. Higher values model longer memory but increase computation and risk overfitting.' },
                  { name: 'd — Differencing order', range: '0 – 2', tip: 'How many times the series is differenced to achieve stationarity. Most price series need d=1. Use d=2 only if first differencing still leaves a trend.' },
                  { name: 'q — MA order', range: '0 – 10', tip: 'How many lagged forecast errors the moving-average term uses. q=0 is often sufficient; increase if residuals show autocorrelation after fitting.' },
                ],
              },
              {
                model: 'XGBoost',
                color: 'text-chart-3',
                params: [
                  { name: 'Estimators', range: '10 – 500', tip: 'Number of boosting rounds (trees). More trees generally improve accuracy up to a point, after which gains plateau and training slows. 100–200 is a solid default.' },
                  { name: 'Max Depth', range: '1 – 10', tip: 'Maximum depth of each tree. Shallow trees (2–4) generalize better and are less prone to overfitting. Deep trees (> 6) capture very complex patterns but may memorize training noise.' },
                  { name: 'Learning Rate', range: '0.001 – 0.300', tip: 'Shrinkage factor applied to each tree contribution. Lower values (0.01–0.05) require more estimators but generalize better. Common pairing: lr=0.05 + estimators=200.' },
                ],
              },
              {
                model: 'LSTM',
                color: 'text-chart-4',
                params: [
                  { name: 'Epochs', range: '10 – 500', tip: 'Number of full passes through the training data. More epochs let the network converge further, but too many cause overfitting. 50–100 is a typical starting range for financial time series.' },
                  { name: 'Units', range: '16 – 256', tip: 'Number of neurons in the LSTM layer. More units = more capacity to learn patterns, but also slower training and higher risk of overfitting on small datasets. 50–128 covers most use cases.' },
                  { name: 'Dropout', range: '0.00 – 0.50', tip: 'Fraction of neurons randomly disabled per training step to regularize the network. 0.20 is a common default. Increase toward 0.40 if training loss is much lower than validation loss (overfitting sign).' },
                  { name: 'Sequence Length', range: '10 – 120', tip: 'How many past time steps the LSTM receives as context for each prediction. 60 = ~3 trading months of daily data. Longer sequences let the network see longer-term patterns but slow training considerably.' },
                ],
              },
            ].map((block, i) => (
              <motion.div
                key={block.model}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="glass-panel p-6"
              >
                <h4 className={`font-display font-bold text-sm uppercase tracking-wider mb-4 ${block.color}`}>{block.model}</h4>
                <div className="space-y-4">
                  {block.params.map((p) => (
                    <div key={p.name} className="flex flex-col md:flex-row gap-2">
                      <div className="md:w-44 shrink-0">
                        <span className="text-xs font-semibold text-foreground">{p.name}</span>
                        <code className="block text-xs font-mono text-muted-foreground mt-0.5">{p.range}</code>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{p.tip}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

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
