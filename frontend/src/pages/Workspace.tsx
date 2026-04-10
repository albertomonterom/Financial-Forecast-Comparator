import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Target, TrendingDown, BarChart, Percent } from 'lucide-react';
import AnalysisPanel from '@/components/AnalysisPanel';
import PredictionChart from '@/components/PredictionChart';
import LLMInsightCard from '@/components/LLMInsightCard';
import ComparisonTable from '@/components/ComparisonTable';
import MetricCard from '@/components/MetricCard';
import { mockAnalysis } from '@/lib/mock-data';
import type { ModelType } from '@/types/api';

export default function Workspace() {
  const [analysis] = useState(mockAnalysis);
  const [loading, setLoading] = useState(false);
  const [selectedModels, setSelectedModels] = useState<ModelType[]>([
    'moving_average', 'arima', 'xgboost', 'lstm',
  ]);
  const [hasRun, setHasRun] = useState(true); // start with mock data visible

  const bestPred = analysis.predictions.find((p) => p.model === analysis.best_model);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setHasRun(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container px-4 xl:px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
          <span className="section-label">Analysis Workspace</span>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mt-1">
            {analysis.request.ticker} — Model Comparison
          </h1>
        </motion.div>

        {/* Three-panel layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-5">
          {/* Left: Config */}
          <div className="lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:pr-1">
            <AnalysisPanel onSubmit={handleSubmit} loading={loading} />
          </div>

          {/* Center: Charts + Metrics */}
          <div className="space-y-5 min-w-0">
            {hasRun && (
              <>
                {/* Metric summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <MetricCard
                    label="Best RMSE"
                    value={bestPred?.metrics.rmse.toFixed(3) ?? '—'}
                    icon={<Target className="w-4 h-4" />}
                    delay={0}
                  />
                  <MetricCard
                    label="Best MAE"
                    value={bestPred?.metrics.mae.toFixed(3) ?? '—'}
                    icon={<TrendingDown className="w-4 h-4" />}
                    delay={0.1}
                  />
                  <MetricCard
                    label="MAPE"
                    value={`${bestPred?.metrics.mape.toFixed(2)}%`}
                    icon={<Percent className="w-4 h-4" />}
                    delay={0.2}
                  />
                  <MetricCard
                    label="Dir. Accuracy"
                    value={`${bestPred?.metrics.direction_accuracy.toFixed(1)}%`}
                    icon={<Activity className="w-4 h-4" />}
                    delay={0.3}
                  />
                </div>

                {/* Chart */}
                <PredictionChart analysis={analysis} selectedModels={selectedModels} />

                {/* Model tabs */}
                <div className="flex flex-wrap gap-2">
                  {analysis.predictions.map((pred) => {
                    const active = selectedModels.includes(pred.model);
                    return (
                      <button
                        key={pred.model}
                        onClick={() =>
                          setSelectedModels((prev) =>
                            active ? prev.filter((m) => m !== pred.model) : [...prev, pred.model]
                          )
                        }
                        className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all border ${
                          active
                            ? 'bg-primary/10 border-primary/30 text-foreground'
                            : 'bg-muted/30 border-border/30 text-muted-foreground hover:bg-muted/50'
                        }`}
                      >
                        {pred.model === analysis.best_model && '🏆 '}
                        {pred.model.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                      </button>
                    );
                  })}
                </div>

                {/* Comparison Table */}
                <ComparisonTable predictions={analysis.predictions} bestModel={analysis.best_model} />
              </>
            )}

            {!hasRun && (
              <div className="glass-panel p-20 text-center">
                <BarChart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-display font-semibold text-foreground mb-2">Ready to Analyze</h3>
                <p className="text-sm text-muted-foreground">Configure your parameters and run an analysis to see results here.</p>
              </div>
            )}
          </div>

          {/* Right: LLM Insights */}
          <div className="lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:pl-1">
            {hasRun ? (
              <LLMInsightCard explanation={analysis.llm_explanation} />
            ) : (
              <div className="glass-panel p-8 text-center">
                <p className="text-sm text-muted-foreground">AI insights will appear here after analysis.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
