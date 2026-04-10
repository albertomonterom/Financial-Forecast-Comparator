import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  delay?: number;
}

export default function MetricCard({ label, value, subtitle, icon, trend, delay = 0 }: MetricCardProps) {
  const trendColor = trend === 'up' ? 'text-chart-up' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="glass-panel p-5 glow-card hover:glow-primary transition-shadow duration-500"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold font-mono text-foreground">{value}</span>
        {subtitle && <span className={`text-xs font-medium ${trendColor}`}>{subtitle}</span>}
      </div>
    </motion.div>
  );
}
