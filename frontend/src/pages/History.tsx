import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Trash2 } from 'lucide-react';
import { mockHistory, MODEL_LABELS } from '@/lib/mock-data';

export default function History() {
  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container px-6 max-w-4xl">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <span className="section-label">History</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-1 mb-2">
            Recent Analyses
          </h1>
          <p className="text-muted-foreground mb-10">Your past model comparisons and results.</p>
        </motion.div>

        <div className="space-y-3">
          {mockHistory.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-panel p-5 flex items-center justify-between gap-4 group hover:glow-card transition-shadow duration-500"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono font-bold text-foreground text-lg">{item.ticker}</span>
                  <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-semibold">
                    🏆 {MODEL_LABELS[item.best_model]}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(item.created_at).toLocaleDateString()}</span>
                  <span>RMSE: {item.best_rmse.toFixed(2)}</span>
                  <span>{item.models.length} models</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-4 h-4" />
                </button>
                <Link
                  to="/results"
                  className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {mockHistory.length === 0 && (
          <div className="glass-panel p-16 text-center">
            <p className="text-muted-foreground">No analyses yet. Head to the workspace to run your first comparison.</p>
          </div>
        )}
      </div>
    </div>
  );
}
