import { useState } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search players...', suggestions = [], onSuggestionClick, className = '' }) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder={placeholder}
          className="w-full pl-11 pr-10 py-3 rounded-xl bg-[#12142A]/80 border border-indigo-500/20 text-white placeholder-muted-foreground font-heading font-medium focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
          >
            <X size={18} />
          </button>
        )}
      </div>
      {focused && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full glass-strong rounded-xl border border-indigo-500/20 overflow-hidden z-50 max-h-72 overflow-y-auto">
          {suggestions.slice(0, 6).map((p) => (
            <button
              key={p.id || p.username}
              onClick={() => onSuggestionClick?.(p)}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-indigo-500/10 transition-colors text-left"
            >
              <img src={p.avatar || `https://mc-heads.net/avatar/${p.username}/40`} alt="" className="w-8 h-8 rounded-lg" />
              <span className="font-heading font-semibold text-white">{p.username}</span>
              {p.tier && p.tier !== 'Unranked' && (
                <span className="ml-auto text-xs font-display font-bold text-indigo-300">{p.tier}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}