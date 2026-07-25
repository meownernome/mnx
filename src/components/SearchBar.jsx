import { useState } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search...', suggestions = [], onSuggestionClick, className = '' }) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder={placeholder}
          className="w-full pl-9 pr-8 py-2.5 rounded-lg bg-[#11131f] border border-white/[0.08] text-sm text-white placeholder-[#555] outline-none focus:border-indigo-500/50 transition-colors"
        />
        {value && (
          <button onClick={() => onChange('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#555] hover:text-white">
            <X size={16} />
          </button>
        )}
      </div>
      {focused && suggestions.length > 0 && (
        <div className="absolute top-full mt-1 w-full rounded-lg border border-white/[0.06] bg-[#11131f] overflow-hidden z-50 max-h-60 overflow-y-auto">
          {suggestions.slice(0, 6).map((p) => (
            <button
              key={p.id || p.username}
              onClick={() => onSuggestionClick?.(p)}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/[0.06] transition-colors text-left"
            >
              <img src={p.avatar || `https://mc-heads.net/avatar/${p.username}/40`} alt="" className="w-7 h-7 rounded" />
              <span className="text-sm text-white">{p.username}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
