import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Activity, Target, TrendingDown, BarChart, Percent, Loader2, AlertCircle } from 'lucide-react';
import AnalysisPanel from '@/components/AnalysisPanel';
import PredictionChart from '@/components/PredictionChart';
import LLMInsightCard from '@/components/LLMInsightCard';
import ComparisonTable from '@/components/ComparisonTable';
import MetricCard from '@/components/MetricCard';
import { api } from '@/lib/api';
import type { AnalysisResponse, ModelType, SamplingInterval } from '@/types/api';

const MODEL_LABELS: Record<string, string> = {
  moving_average: 'Moving Average',
  arima: 'ARIMA',
  xgboost: 'XGBoost',
  lstm: 'LSTM',
};

export default function Workspace() {
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedModels, setSelectedModels] = useState<ModelType[]>([
    'moving_average', 'arima', 'xgboost', 'lstm',
  ]);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  useEffect(() => () => stopPolling(), []);

  const handleSubmit = async (config: {
    ticker: string;
    startDate: string;
    endDate: string;
    interval: SamplingInterval;
    models: ModelType[];
    splitRatio: number;
    hyperparameters: Record<string, Record<string, number>>;
  }) => {
    stopPolling();
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setStep('Submitting...');

    try {
      const { task_id } = await api.submitAnalysis({
        ticker: config.ticker,
        start_date: config.startDate,
        end_date: config.endDate,
        interval: config.interval,
        models: config.models,
        train_test_split: config.splitRatio,
        hyperparameters: config.hyperparameters,
      });

      pollRef.current = setInterval(async () => {
        try {
          const status = await api.getTaskStatus(task_id);
          if (status.step) setStep(status.step);

          if (status.status === 'success' && status.result) {
            stopPolling();
            setAnalysis(status.result);
            setSelectedModels(status.result.predictions.map((p) => p.model as ModelType));
            setLoading(false);
            setStep('');
          } else if (status.status === 'failed') {
            stopPolling();
            setError(status.error ?? 'Analysis failed.');
            setLoading(false);
            setStep('');
          }
        } catch {
          stopPolling();
          setError('Lost connection while polling for results.');
          setLoading(false);
          setStep('');
        }
      }, 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to submit analysis.');
      setLoading(false);
      setStep('');
    }
  };

  const bestPred = analysis?.predictions.find((p) => p.model === analysis.best_model);

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container px-4 xl:px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
          <span className="section-label">Analysis Workspace</span>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mt-1">
            {analysis ? `${analysis.request.ticker} — Model Comparison` : 'Configure & Run Analysis'}
          </h1>
        </motion.div>

        {/* Three-panel layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-5">
          {/* Left: Config */}
          <div className="lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:pr-1">
            <AnalysisPanel onSubmit={handleSubmit} loading={loading} />
          </div>

          {/* Center */}
          <div className="space-y-5 min-w-0">
            {/* Loading state */}
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-12 text-center space-y-4"
              >
                <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
                <p className="font-display font-semibold text-foreground">{step || 'Running analysis…'}</p>
                <p className="text-xs text-muted-foreground">
                  Models are training in the background. This may take 30–90 seconds.
                </p>
              </motion.div>
            )}

            {/* Error state */}
            {error && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-panel p-6 flex items-start gap-3 border border-destructive/30"
              >
                <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm text-foreground">Analysis failed</p>
                  <p className="text-xs text-muted-foreground mt-1">{error}</p>
                </div>
              </motion.div>
            )}

            {/* Results */}
            {analysis && !loading && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <MetricCard label="Best RMSE"     value={bestPred?.metrics.rmse.toFixed(3) ?? '—'} icon={<Target className="w-4 h-4" />} delay={0} />
                  <MetricCard label="Best MAE"      value={bestPred?.metrics.mae.toFixed(3) ?? '—'}  icon={<TrendingDown className="w-4 h-4" />} delay={0.1} />
                  <MetricCard label="MAPE"          value={`${bestPred?.metrics.mape.toFixed(2)}%`}  icon={<Percent className="w-4 h-4" />} delay={0.2} />
                  <MetricCard label="Dir. Accuracy" value={`${bestPred?.metrics.direction_accuracy.toFixed(1)}%`} icon={<Activity className="w-4 h-4" />} delay={0.3} />
                </div>

                <PredictionChart analysis={analysis} selectedModels={selectedModels} />

                <div className="flex flex-wrap gap-2">
                  {analysis.predictions.map((pred) => {
                    const active = selectedModels.includes(pred.model as ModelType);
                    return (
                      <button
                        key={pred.model}
                        onClick={() =>
                          setSelectedModels((prev) =>
                            active
                              ? prev.filter((m) => m !== pred.model)
                              : [...prev, pred.model as ModelType]
                          )
                        }
                        className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all border ${
                          active
                            ? 'bg-primary/10 border-primary/30 text-foreground'
                            : 'bg-muted/30 border-border/30 text-muted-foreground hover:bg-muted/50'
                        }`}
                      >
                        {pred.model === analysis.best_model && '🏆 '}
                        {MODEL_LABELS[pred.model] ?? pred.model}
                      </button>
                    );
                  })}
                </div>

                <ComparisonTable predictions={analysis.predictions} bestModel={analysis.best_model} />
              </>
            )}

            {/* Empty state */}
            {!analysis && !loading && !error && (
              <div className="glass-panel p-20 text-center">
                <BarChart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-display font-semibold text-foreground mb-2">Ready to Analyze</h3>
                <p className="text-sm text-muted-foreground">
                  Configure your parameters on the left and click Run Analysis.
                </p>
              </div>
            )}
          </div>

          {/* Right: LLM Insights */}
          <div className="lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:pl-1">
            {analysis ? (
              <LLMInsightCard explanation={analysis.llm_explanation} />
            ) : (
              <div className="glass-panel p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  {loading ? step || 'Training models…' : 'AI insights will appear here after analysis.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
