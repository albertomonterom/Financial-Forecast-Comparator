import { motion } from 'framer-motion';
import { Trophy, Clock } from 'lucide-react';
import type { ModelPrediction, ModelType } from '@/types/api';
import { MODEL_LABELS, MODEL_COLORS } from '@/lib/mock-data';

interface ComparisonTableProps {
  predictions: ModelPrediction[];
  bestModel: ModelType;
}

export default function ComparisonTable({ predictions, bestModel }: ComparisonTableProps) {
  const sorted = [...predictions].sort((a, b) => a.metrics.rmse - b.metrics.rmse);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-panel overflow-hidden"
    >
      <div className="p-5 border-b border-border/50 flex items-center justify-between">
        <h3 className="font-display font-semibold text-foreground">Model Comparison</h3>
        <span className="section-label">Rankings</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/40">
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rank</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Model</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">MAE</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">RMSE</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">MAPE %</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">R²</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Dir. Acc.</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Time</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((pred, i) => (
              <tr
                key={pred.model}
                className={`border-b border-border/20 transition-colors hover:bg-muted/30 ${
                  pred.model === bestModel ? 'bg-primary/5' : ''
                }`}
              >
                <td className="px-5 py-3.5 font-mono">
                  {i === 0 ? (
                    <Trophy className="w-4 h-4 text-primary inline" />
                  ) : (
                    <span className="text-muted-foreground">#{i + 1}</span>
                  )}
                </td>
                <td className="px-5 py-3.5 font-semibold text-foreground">
                  <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: MODEL_COLORS[pred.model] }} />
                  {MODEL_LABELS[pred.model]}
                </td>
                <td className="px-5 py-3.5 text-right font-mono text-muted-foreground">{pred.metrics.mae.toFixed(3)}</td>
                <td className="px-5 py-3.5 text-right font-mono text-foreground font-semibold">{pred.metrics.rmse.toFixed(3)}</td>
                <td className="px-5 py-3.5 text-right font-mono text-muted-foreground">{pred.metrics.mape.toFixed(2)}%</td>
                <td className="px-5 py-3.5 text-right font-mono text-muted-foreground">{pred.metrics.r_squared.toFixed(4)}</td>
                <td className="px-5 py-3.5 text-right font-mono text-muted-foreground">{pred.metrics.direction_accuracy.toFixed(1)}%</td>
                <td className="px-5 py-3.5 text-right text-muted-foreground">
                  <Clock className="w-3 h-3 inline mr-1" />
                  <span className="font-mono text-xs">{(pred.training_time_ms / 1000).toFixed(1)}s</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
