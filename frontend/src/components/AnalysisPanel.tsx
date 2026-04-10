import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Settings2, Play, Loader2 } from 'lucide-react';
import type { ModelType, SamplingInterval } from '@/types/api';
import { MODEL_LABELS } from '@/lib/mock-data';

interface AnalysisPanelProps {
  onSubmit?: (config: {
    ticker: string;
    startDate: string;
    endDate: string;
    interval: SamplingInterval;
    models: ModelType[];
    splitRatio: number;
  }) => void;
  loading?: boolean;
}

const allModels: ModelType[] = ['moving_average', 'arima', 'xgboost', 'lstm'];
const intervals: { value: SamplingInterval; label: string }[] = [
  { value: '1d', label: 'Daily' },
  { value: '1wk', label: 'Weekly' },
  { value: '1mo', label: 'Monthly' },
];

export default function AnalysisPanel({ onSubmit, loading }: AnalysisPanelProps) {
  const [ticker, setTicker] = useState('AAPL');
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-12-31');
  const [interval, setInterval] = useState<SamplingInterval>('1d');
  const [selectedModels, setSelectedModels] = useState<ModelType[]>([...allModels]);
  const [splitRatio, setSplitRatio] = useState(0.8);

  const toggleModel = (m: ModelType) => {
    setSelectedModels((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
  };

  const handleSubmit = () => {
    onSubmit?.({ ticker, startDate, endDate, interval, models: selectedModels, splitRatio });
  };

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
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Ticker Symbol</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-muted/50 border border-border/50 text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
            placeholder="e.g. AAPL"
          />
        </div>
      </div>

      {/* Date Range */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
          <Calendar className="w-3 h-3" /> Date Range
        </label>
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
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sampling Interval</label>
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
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Models</label>
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
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Train/Test Split — {Math.round(splitRatio * 100)}%
        </label>
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

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading || selectedModels.length === 0}
        className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Play className="w-4 h-4" />
        )}
        {loading ? 'Analyzing…' : 'Run Analysis'}
      </button>
    </motion.div>
  );
}
