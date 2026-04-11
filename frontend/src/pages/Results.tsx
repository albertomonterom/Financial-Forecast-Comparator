import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, ArrowLeft, Loader2, AlertCircle, Activity, Target, TrendingDown, Percent } from 'lucide-react';
import PredictionChart from '@/components/PredictionChart';
import ComparisonTable from '@/components/ComparisonTable';
import LLMInsightCard from '@/components/LLMInsightCard';
import MetricCard from '@/components/MetricCard';
import { api } from '@/lib/api';
import { MODEL_LABELS, MODEL_COLORS } from '@/lib/mock-data';
import type { AnalysisResponse, ModelType } from '@/types/api';

export default function Results() {
  const { id } = useParams<{ id: string }>();
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [selectedModels, setSelectedModels] = useState<ModelType[]>([]);

  useEffect(() => {
    if (!id) { setError('No analysis ID provided.'); setLoading(false); return; }
    api.getAnalysis(id)
      .then((data) => {
        setAnalysis(data);
        setSelectedModels(data.predictions.map((p) => p.model as ModelType));
      })
      .catch((e) => setError(e.message ?? 'Failed to load analysis.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
    </div>
  );

  if (error || !analysis) return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container px-6 max-w-2xl">
        <div className="glass-panel p-8 flex items-start gap-3 border border-destructive/30">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-foreground mb-1">Could not load analysis</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Link to="/history" className="text-primary text-sm hover:underline mt-3 inline-block">
              ← Back to history
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  const bestPred = analysis.predictions.find((p) => p.model === analysis.best_model)!;

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container px-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Link
            to="/history"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" /> Back to history
          </Link>
          <span className="section-label block">Results</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-1 mb-2">
            {analysis.request.ticker} — Analysis Complete
          </h1>
          <p className="text-muted-foreground mb-8">
            {analysis.request.start_date} → {analysis.request.end_date} · {analysis.request.interval} interval · {new Date(analysis.created_at).toLocaleDateString()}
          </p>
        </motion.div>

        {/* Winner banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 mb-8 flex flex-col sm:flex-row items-center gap-4 glow-primary"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="font-display font-bold text-xl text-foreground">
              {MODEL_LABELS[analysis.best_model] ?? analysis.best_model} wins
            </h2>
            <p className="text-sm text-muted-foreground">
              RMSE {bestPred.metrics.rmse.toFixed(3)} · R² {bestPred.metrics.r_squared.toFixed(4)} · Direction Accuracy {bestPred.metrics.direction_accuracy.toFixed(1)}%
            </p>
          </div>
        </motion.div>

        {/* Top metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <MetricCard label="Best RMSE"     value={bestPred.metrics.rmse.toFixed(3)}                    icon={<Target className="w-4 h-4" />}       delay={0}   />
          <MetricCard label="Best MAE"      value={bestPred.metrics.mae.toFixed(3)}                     icon={<TrendingDown className="w-4 h-4" />}  delay={0.1} />
          <MetricCard label="MAPE"          value={`${bestPred.metrics.mape.toFixed(2)}%`}              icon={<Percent className="w-4 h-4" />}       delay={0.2} />
          <MetricCard label="Dir. Accuracy" value={`${bestPred.metrics.direction_accuracy.toFixed(1)}%`} icon={<Activity className="w-4 h-4" />}    delay={0.3} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          <div className="space-y-6">
            {/* Chart with model toggles */}
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

            {/* Per-model insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.predictions.map((pred) => (
                <div key={pred.model} className="glass-panel p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: MODEL_COLORS[pred.model] }} />
                    <h3 className="font-display font-semibold text-sm text-foreground">
                      {MODEL_LABELS[pred.model] ?? pred.model}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {analysis.llm_explanation.model_insights[pred.model]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <LLMInsightCard explanation={analysis.llm_explanation} />
          </div>
        </div>
      </div>
    </div>
  );
}
