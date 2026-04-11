import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Settings2, Play, Loader2, ChevronDown, HelpCircle } from 'lucide-react';
import type { ModelType, SamplingInterval } from '@/types/api';
import { MODEL_LABELS } from '@/lib/mock-data';
import TickerSearch from '@/components/TickerSearch';

interface AnalysisPanelProps {
  onSubmit?: (config: {
    ticker: string;
    startDate: string;
    endDate: string;
    interval: SamplingInterval;
    models: ModelType[];
    splitRatio: number;
    hyperparameters: Record<string, Record<string, number>>;
  }) => void;
  loading?: boolean;
}

const allModels: ModelType[] = ['moving_average', 'arima', 'xgboost', 'lstm'];

const intervals: { value: SamplingInterval; label: string }[] = [
  { value: '1d',  label: 'Daily'   },
  { value: '1wk', label: 'Weekly'  },
  { value: '1mo', label: 'Monthly' },
];

// Default hyperparameters for each model
const DEFAULT_HYPERPARAMS: Record<ModelType, Record<string, number>> = {
  moving_average: { window: 30 },                                           // notebook: window=30
  arima:          { p: 0, d: 1, q: 0 },                                    // notebook: auto_arima → (0,1,0)
  xgboost:        { n_estimators: 200, max_depth: 4, learning_rate: 50 },  // notebook: 200 / 4 / 0.05 (50/1000)
  lstm:           { epochs: 200, units: 64, dropout: 20, seq_length: 30 }, // notebook: 200 / 64 / 0.20 / 30
};

// Human-readable labels + min/max/step for each param
const PARAM_CONFIG: Record<string, {
  label: string;
  min: number;
  max: number;
  step: number;
  display?: (v: number) => string;
  tooltip: string;
}> = {
  window:        { label: 'Window',         min: 5,   max: 100,  step: 1,
                   tooltip: 'Number of past periods averaged to produce each forecast point. Larger windows are smoother but slower to react to trends.' },
  p:             { label: 'p (AR order)',    min: 0,   max: 10,   step: 1,
                   tooltip: 'Autoregressive order — how many past values the model uses to predict the next one. Start with 1–5 for daily stock data.' },
  d:             { label: 'd (Diff order)',  min: 0,   max: 2,    step: 1,
                   tooltip: 'Differencing order — how many times the series is differenced to make it stationary. Usually 1 for stock prices.' },
  q:             { label: 'q (MA order)',    min: 0,   max: 10,   step: 1,
                   tooltip: 'Moving-average order — how many past forecast errors are included in the model. Helps capture short-term shocks.' },
  n_estimators:  { label: 'Estimators',      min: 10,  max: 500,  step: 10,
                   tooltip: 'Number of decision trees in the ensemble. More trees generally improve accuracy but increase training time.' },
  max_depth:     { label: 'Max Depth',       min: 1,   max: 10,   step: 1,
                   tooltip: 'Maximum depth of each decision tree. Deeper trees can model complex patterns but may overfit the training data.' },
  learning_rate: { label: 'Learning Rate',   min: 1,   max: 300,  step: 1,
                   display: (v) => (v / 1000).toFixed(3),
                   tooltip: 'Step size at each boosting iteration. Lower values (0.01–0.05) train slower but generalize better; higher values train faster but may overfit.' },
  epochs:        { label: 'Epochs',          min: 10,  max: 500,  step: 10,
                   tooltip: 'Number of full passes through the training data. More epochs can improve accuracy but risk overfitting if the model sees the data too many times.' },
  units:         { label: 'Units',           min: 16,  max: 256,  step: 16,
                   tooltip: 'Number of neurons in the LSTM layer. More units capture more complex patterns but require more data and computation.' },
  dropout:       { label: 'Dropout',         min: 0,   max: 50,   step: 5,
                   display: (v) => (v / 100).toFixed(2),
                   tooltip: 'Fraction of neurons randomly disabled during training to prevent overfitting. 0.20 means 20% of neurons are dropped each step.' },
  seq_length:    { label: 'Sequence Length', min: 10,  max: 120,  step: 5,
                   tooltip: 'Number of past time steps fed into the LSTM as context for each prediction. Longer sequences capture longer-term patterns.' },
};

export default function AnalysisPanel({ onSubmit, loading }: AnalysisPanelProps) {
  const [ticker,         setTicker]         = useState('AAPL');
  const [startDate,      setStartDate]      = useState('2024-01-01');
  const [endDate,        setEndDate]        = useState('2024-12-31');
  const [interval,       setInterval]       = useState<SamplingInterval>('1d');
  const [selectedModels, setSelectedModels] = useState<ModelType[]>([...allModels]);
  const [splitRatio,     setSplitRatio]     = useState(0.8);
  const [showAdvanced,   setShowAdvanced]   = useState(false);
  const [hyperparams,    setHyperparams]    = useState(DEFAULT_HYPERPARAMS);

  const toggleModel = (m: ModelType) => {
    setSelectedModels((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
  };

  const updateParam = (model: ModelType, param: string, value: number) => {
    setHyperparams((prev) => ({
      ...prev,
      [model]: { ...prev[model], [param]: value },
    }));
  };

  const handleSubmit = () => {
    // Convert internal slider values to real values (e.g. learning_rate 10 → 0.10)
    const finalParams: Record<string, Record<string, number>> = {};
    for (const model of selectedModels) {
      finalParams[model] = {};
      for (const [param, value] of Object.entries(hyperparams[model])) {
        const cfg = PARAM_CONFIG[param];
        finalParams[model][param] = cfg?.display ? parseFloat(cfg.display(value)) : value;
      }
    }
    onSubmit?.({ ticker, startDate, endDate, interval, models: selectedModels, splitRatio, hyperparameters: finalParams });
  };

  const InfoTip = ({ text }: { text: string }) => (
    <span className="relative group/tip inline-flex items-center">
      <HelpCircle className="w-3 h-3 text-muted-foreground/50 group-hover/tip:text-muted-foreground cursor-help shrink-0" />
      <span className="pointer-events-none absolute right-full top-1/2 -translate-y-1/2 mr-2 w-48 rounded-md border border-border bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-md leading-relaxed opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150 z-[9999] whitespace-normal text-left normal-case tracking-normal font-normal">
        {text}
      </span>
    </span>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-panel p-5 space-y-5 h-fit"
    >
      <div className="flex items-center gap-2 mb-1">
        <Settings2 className="w-4 h-4 text-primary" />
        <h3 className="font-display font-semibold text-foreground text-sm">Configuration</h3>
      </div>

      {/* Ticker */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Ticker Symbol</label>
          <InfoTip text="The stock, ETF, or index symbol to analyze. Use the search box to find any asset traded on Yahoo Finance." />
        </div>
        <TickerSearch value={ticker} onChange={setTicker} />
      </div>

      {/* Date Range */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Date Range
          </label>
          <InfoTip text="Historical period to download from Yahoo Finance. A longer range gives models more data to learn from, but very old data may not reflect current market behavior." />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2.5 rounded-lg bg-muted/50 border border-border/50 text-foreground text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2.5 rounded-lg bg-muted/50 border border-border/50 text-foreground text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
          />
        </div>
      </div>

      {/* Interval */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sampling Interval</label>
          <InfoTip text="How frequently prices are sampled. Daily gives the most detail; weekly/monthly reduce noise and speed up training." />
        </div>
        <div className="flex gap-1.5">
          {intervals.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setInterval(opt.value)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                interval === opt.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/50 text-muted-foreground hover:text-foreground'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Models */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Models</label>
          <InfoTip text="Select which forecasting models to run and compare. Deselected models are skipped entirely. You need at least one." />
        </div>
        <div className="space-y-1.5">
          {allModels.map((m) => (
            <button
              key={m}
              onClick={() => toggleModel(m)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-all border ${
                selectedModels.includes(m)
                  ? 'bg-primary/10 border-primary/30 text-foreground'
                  : 'bg-muted/30 border-border/30 text-muted-foreground hover:bg-muted/50'
              }`}
            >
              {MODEL_LABELS[m]}
            </button>
          ))}
        </div>
      </div>

      {/* Split Ratio */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Train/Test Split — {Math.round(splitRatio * 100)}%
          </label>
          <InfoTip text="Portion of data used for training vs. evaluation. 80% means the model trains on the first 80% of dates and is tested on the remaining 20%." />
        </div>
        <input
          type="range"
          min={0.5}
          max={0.95}
          step={0.05}
          value={splitRatio}
          onChange={(e) => setSplitRatio(parseFloat(e.target.value))}
          className="w-full accent-primary"
        />
      </div>

      {/* Advanced Configuration */}
      <div className="border border-border/40 rounded-lg">
        <button
          onClick={() => setShowAdvanced((v) => !v)}
          className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
        >
          <span className="uppercase tracking-wider">Advanced Configuration</span>
          <motion.div animate={{ rotate: showAdvanced ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-3.5 h-3.5" />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              style={{ overflow: showAdvanced ? 'visible' : 'hidden' }}
            >
              <div className="px-3 pb-3 space-y-4 border-t border-border/40 pt-3">
                {selectedModels.map((model) => (
                  <div key={model} className="space-y-2">
                    {/* Model name badge */}
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                      {MODEL_LABELS[model]}
                    </span>

                    {/* Params for this model */}
                    {Object.entries(hyperparams[model]).map(([param, value]) => {
                      const cfg = PARAM_CONFIG[param];
                      if (!cfg) return null;
                      const displayVal = cfg.display ? cfg.display(value) : value;
                      return (
                        <div key={param} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">{cfg.label}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-mono font-bold text-foreground">{displayVal}</span>
                              <InfoTip text={cfg.tooltip} />
                            </div>
                          </div>
                          <input
                            type="range"
                            min={cfg.min}
                            max={cfg.max}
                            step={cfg.step}
                            value={value}
                            onChange={(e) => updateParam(model, param, parseFloat(e.target.value))}
                            className="w-full accent-primary"
                          />
                        </div>
                      );
                    })}
                  </div>
                ))}

                {selectedModels.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-2">
                    Select at least one model to configure.
                  </p>
                )}

                {/* Reset button */}
                <button
                  onClick={() => setHyperparams(DEFAULT_HYPERPARAMS)}
                  className="w-full py-1.5 rounded-lg border border-border/50 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
                >
                  Reset to defaults
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading || selectedModels.length === 0}
        className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
        {loading ? 'Analyzing…' : 'Run Analysis'}
      </button>
    </motion.div>
  );
}
