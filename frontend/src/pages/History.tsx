import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Trash2, BarChart, Loader2, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { MODEL_LABELS } from '@/lib/mock-data';
import type { AnalysisHistoryItem } from '@/types/api';

export default function History() {
  const [items, setItems]   = useState<AnalysisHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    api.getAnalyses()
      .then(setItems)
      .catch((e) => setError(e.message ?? 'Failed to load history.'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await api.deleteAnalysis(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch {
      // silently ignore — item stays in list
    } finally {
      setDeleting(null);
    }
  };

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

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="glass-panel p-6 flex items-center gap-3 border border-destructive/30">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && items.length === 0 && (
          <div className="glass-panel p-16 text-center">
            <BarChart className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
            <p className="font-display font-semibold text-foreground mb-1">No analyses yet</p>
            <p className="text-sm text-muted-foreground">
              Head to the{' '}
              <Link to="/workspace" className="text-primary hover:underline">workspace</Link>
              {' '}to run your first comparison.
            </p>
          </div>
        )}

        {/* List */}
        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass-panel p-5 flex items-center justify-between gap-4 group hover:glow-card transition-shadow duration-500"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono font-bold text-foreground text-lg">{item.ticker}</span>
                  <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-semibold">
                    🏆 {MODEL_LABELS[item.best_model] ?? item.best_model}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                  <span>RMSE {item.best_rmse.toFixed(2)}</span>
                  <span>{item.models.length} model{item.models.length !== 1 ? 's' : ''}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deleting === item.id}
                  className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                >
                  {deleting === item.id
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <Trash2 className="w-4 h-4" />}
                </button>
                <Link
                  to={`/results/${item.id}`}
                  className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
