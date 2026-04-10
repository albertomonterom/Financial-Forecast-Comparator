import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import type { LLMExplanation } from '@/types/api';

interface LLMInsightCardProps {
  explanation: LLMExplanation;
}

export default function LLMInsightCard({ explanation }: LLMInsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-panel p-6 space-y-5"
    >
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-md bg-primary/10">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <h3 className="font-display font-semibold text-foreground">AI Insight</h3>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">{explanation.summary}</p>

      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-primary">Key Takeaways</h4>
        <ul className="space-y-2">
          {explanation.key_takeaways.map((t, i) => (
            <li key={i} className="flex gap-2 text-sm text-muted-foreground">
              <span className="text-primary mt-0.5">•</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-3 border-t border-border/50">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
          Beginner Explanation
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed italic">
          {explanation.beginner_explanation}
        </p>
      </div>

      <div className="pt-3 border-t border-border/50">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
          Recommendation
        </h4>
        <p className="text-sm text-foreground font-medium">{explanation.recommendation}</p>
      </div>
    </motion.div>
  );
}
