import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BarChart3, Brain, Layers, ArrowRight, Sparkles, TrendingUp, BookOpen } from 'lucide-react';
import BrandIcon from '@/components/BrandIcon';

const features = [
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: 'Multi-Model Comparison',
    description: 'Compare Moving Average, ARIMA, XGBoost, and LSTM side-by-side with real financial data.',
  },
  {
    icon: <Brain className="w-5 h-5" />,
    title: 'AI-Powered Insights',
    description: 'Get plain-language explanations of model performance from an LLM tutor that makes complex metrics accessible.',
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: 'Interactive Charts',
    description: 'Visualize predictions, train/test splits, and error distributions with rich, interactive charts.',
  },
  {
    icon: <BookOpen className="w-5 h-5" />,
    title: 'Learning-First Design',
    description: 'Every metric comes with beginner-friendly explanations. Learn by doing, not just reading.',
  },
];

const stagger = {
  container: { transition: { staggerChildren: 0.1 } },
  item: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  },
};

export default function Landing() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08)_0%,transparent_60%)]" />
        <div className="container relative px-6 py-28 md:py-40 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="section-label inline-flex items-center gap-1.5 mb-6">
              <Sparkles className="w-3.5 h-3.5" /> Financial Intelligence Lab
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight text-foreground max-w-4xl mx-auto">
              Time-Series Forecasting
              <br />
              <span className="gradient-text">Model Comparison</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              An interactive learning platform that helps students compare forecasting models
              on real market data — with AI-generated explanations in plain language.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/workspace"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity glow-primary"
            >
              Launch Workspace <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-border text-foreground font-semibold text-base hover:bg-muted/50 transition-colors"
            >
              Methodology
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="container px-6 py-24">
        <div className="text-center mb-16">
          <span className="section-label">Why This Lab</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3">
            One platform. Four models.
            <br />
            Built for learning.
          </h2>
        </div>

        <motion.div
          variants={stagger.container}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {features.map((f, i) => (
            <motion.div key={i} variants={stagger.item} className="glass-panel p-6 group hover:glow-primary transition-shadow duration-500">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary/20 transition-colors">
                {f.icon}
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Stats */}
      <section className="container px-6 py-20">
        <div className="glass-panel p-10 md:p-14 text-center">
          <span className="section-label">The Opportunity</span>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mt-3 mb-8">
            Financial ML is the fastest-growing field in quantitative finance
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '4', label: 'Forecasting Models' },
              { value: '5+', label: 'Accuracy Metrics' },
              { value: 'AI', label: 'LLM Explanations' },
              { value: '∞', label: 'Tickers Supported' },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-3xl md:text-4xl font-bold font-mono gradient-text">{s.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-10">
        <div className="container px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BrandIcon className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Financial Model Lab</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Built for learning. Not financial advice. © {new Date().getFullYear()}
          </p>
          <div className="flex items-center gap-4">
            {['Products', 'Team', 'Privacy'].map((link) => (
              <span key={link} className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">{link}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
