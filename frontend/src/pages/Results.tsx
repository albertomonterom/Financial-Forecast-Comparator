import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, ArrowRight } from 'lucide-react';
import PredictionChart from '@/components/PredictionChart';
import ComparisonTable from '@/components/ComparisonTable';
import LLMInsightCard from '@/components/LLMInsightCard';
import MetricCard from '@/components/MetricCard';
import { mockAnalysis, MODEL_LABELS, MODEL_COLORS } from '@/lib/mock-data';
import type { ModelType } from '@/types/api';

export default function Results() {
  const analysis = mockAnalysis;
  const [selectedModels] = useState<ModelType[]>(['moving_average', 'arima', 'xgboost', 'lstm']);
  const bestPred = analysis.predictions.find((p) => p.model === analysis.best_model)!;

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container px-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <span className="section-label">Results</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-1 mb-2">
            {analysis.request.ticker} — Analysis Complete
          </h1>
          <p className="text-muted-foreground mb-8">
            {analysis.request.start_date} → {analysis.request.end_date} · {analysis.request.interval} interval
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
              {MODEL_LABELS[analysis.best_model]} wins!
            </h2>
            <p className="text-sm text-muted-foreground">
              RMSE: {bestPred.metrics.rmse.toFixed(3)} · R²: {bestPred.metrics.r_squared.toFixed(4)} · Direction Accuracy: {bestPred.metrics.direction_accuracy.toFixed(1)}%
            </p>
          </div>
        </motion.div>

        {/* Metrics row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {analysis.predictions.map((pred, i) => (
            <MetricCard
              key={pred.model}
              label={MODEL_LABELS[pred.model]}
              value={pred.metrics.rmse.toFixed(3)}
              subtitle={`R² ${pred.metrics.r_squared.toFixed(3)}`}
              delay={i * 0.1}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          <div className="space-y-6">
            <PredictionChart analysis={analysis} selectedModels={selectedModels} />
            <ComparisonTable predictions={analysis.predictions} bestModel={analysis.best_model} />

            {/* Per-model insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.predictions.map((pred) => (
                <div key={pred.model} className="glass-panel p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: MODEL_COLORS[pred.model] }} />
                    <h3 className="font-display font-semibold text-sm text-foreground">{MODEL_LABELS[pred.model]}</h3>
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
