import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { api } from '@/lib/api';

interface TickerResult {
  symbol: string;
  name: string;
}

interface TickerSearchProps {
  value: string;
  onChange: (symbol: string) => void;
}

export default function TickerSearch({ value, onChange }: TickerSearchProps) {
  const [query, setQuery]         = useState(value);
  const [results, setResults]     = useState<TickerResult[]>([]);
  const [open, setOpen]           = useState(false);
  const [loading, setLoading]     = useState(false);
  const debounceRef               = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef              = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    setQuery(val);
    onChange(val); // keep parent in sync as user types

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (val.length < 1) {
      setResults([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await api.searchTickers(val);
        setResults(data);
        setOpen(data.length > 0);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const handleSelect = (ticker: TickerResult) => {
    setQuery(ticker.symbol);
    onChange(ticker.symbol);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => results.length > 0 && setOpen(true)}
        className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-muted/50 border border-border/50 text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
        placeholder="e.g. AAPL"
      />

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 top-full mt-1 w-full rounded-lg border border-border bg-popover shadow-lg overflow-hidden">
          {loading ? (
            <div className="px-3 py-2 text-xs text-muted-foreground">Searching...</div>
          ) : (
            results.map((ticker) => (
              <button
                key={ticker.symbol}
                onMouseDown={() => handleSelect(ticker)}
                className="w-full text-left px-3 py-2.5 flex items-center gap-3 hover:bg-muted transition-colors"
              >
                <span className="text-sm font-mono font-bold text-primary shrink-0 max-w-[80px] truncate">
                  {ticker.symbol}
                </span>
                <span className="text-xs text-muted-foreground truncate min-w-0">{ticker.name}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
