import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import type { AnalysisResponse, ModelType } from '@/types/api';
import { MODEL_LABELS, MODEL_COLORS } from '@/lib/mock-data';

interface PredictionChartProps {
  analysis: AnalysisResponse;
  selectedModels: ModelType[];
}

export default function PredictionChart({ analysis, selectedModels }: PredictionChartProps) {
  const { test_data, predictions, train_data } = analysis;

  // Build chart data: last 20 training points + test points
  const trailTrain = train_data.slice(-20);
  const splitDate = test_data[0]?.date;

  const chartData = [
    ...trailTrain.map((p) => ({ date: p.date, actual: p.value, _zone: 'train' })),
    ...test_data.map((p) => {
      const row: Record<string, number | string> = { date: p.date, actual: p.value, _zone: 'test' };
      for (const pred of predictions) {
        if (selectedModels.includes(pred.model)) {
          const match = pred.predictions.find((pp) => pp.date === p.date);
          if (match) row[pred.model] = match.value;
        }
      }
      return row;
    }),
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="glass-panel p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-foreground">Price Predictions</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Train/test split at {splitDate} · {analysis.request.ticker}
          </p>
        </div>
        <span className="section-label">Live Chart</span>
      </div>

      <div className="h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" opacity={0.5} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(v) => v.slice(5)}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              domain={['auto', 'auto']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: 12,
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12 }}
            />
            {splitDate && (
              <ReferenceLine
                x={splitDate}
                stroke="hsl(var(--primary))"
                strokeDasharray="4 4"
                label={{ value: 'Split', fill: 'hsl(var(--primary))', fontSize: 10 }}
              />
            )}
            <Line
              type="monotone"
              dataKey="actual"
              stroke="hsl(var(--foreground))"
              strokeWidth={2}
              dot={false}
              name="Actual"
            />
            {selectedModels.map((model) => (
              <Line
                key={model}
                type="monotone"
                dataKey={model}
                stroke={MODEL_COLORS[model]}
                strokeWidth={1.5}
                strokeDasharray="4 2"
                dot={false}
                name={MODEL_LABELS[model]}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
