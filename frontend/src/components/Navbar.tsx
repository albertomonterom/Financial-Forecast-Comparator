import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import BrandIcon from '@/components/BrandIcon';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Workspace', path: '/workspace' },
  { label: 'Results', path: '/results' },
  { label: 'History', path: '/history' },
  { label: 'About', path: '/about' },
];

export default function Navbar() {
  const location = useLocation();
  const { theme, toggle } = useTheme();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 glass-panel-strong border-b border-border/40"
    >
      <div className="container flex items-center justify-between h-16 px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <BrandIcon className="w-6 h-6 text-primary" />
          <span className="font-display font-bold text-lg text-foreground">
            Financial Model Lab
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  active
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
                {active && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-[1px] left-2 right-2 h-0.5 bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <Link
            to="/workspace"
            className="hidden sm:inline-flex items-center px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Launch Lab
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
