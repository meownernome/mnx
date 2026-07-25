import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchPlayers, rankPlayers, getPlayerGamemodes } from '@/lib/api';
import { GAMEMODES, TIER_ORDER } from '@/lib/config';
import PlayerRow from '@/components/PlayerRow';

const PAGE_SIZE = 25;

export default function Rankings() {
  const { data: players = [], isLoading } = useQuery({ queryKey: ['players'], queryFn: fetchPlayers });
  const [activeMode, setActiveMode] = useState('overall');
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    if (activeMode === 'overall') return rankPlayers(players);
    return players
      .filter((p) => {
        const gms = getPlayerGamemodes(p);
        return gms[activeMode] && gms[activeMode].tier && gms[activeMode].tier !== 'Unranked';
      })
      .sort((a, b) => {
        const ta = TIER_ORDER.indexOf(getPlayerGamemodes(a)[activeMode]?.tier);
        const tb = TIER_ORDER.indexOf(getPlayerGamemodes(b)[activeMode]?.tier);
        if (ta !== tb) return ta - tb;
        return (getPlayerGamemodes(b)[activeMode]?.points || 0) - (getPlayerGamemodes(a)[activeMode]?.points || 0);
      });
  }, [players, activeMode]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const tabs = [{ id: 'overall', label: 'Overall' }, ...GAMEMODES.map((g) => ({ id: g.id, label: g.label }))];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10">
      <div className="mb-6">
        <h1 className="font-display font-black text-2xl sm:text-3xl text-white">Leaderboard</h1>
        <p className="text-sm text-[#71718e] mt-1">{filtered.length} players ranked</p>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {tabs.map((t) => {
          const gm = GAMEMODES.find((g) => g.id === t.id);
          const active = activeMode === t.id;
          return (
            <button
              key={t.id}
              onClick={() => { setActiveMode(t.id); setPage(0); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                active
                  ? 'bg-white/[0.08] text-white'
                  : 'text-[#71718e] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {gm && <img src={gm.icon} alt="" width={12} height={12} />}
              {t.label}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-sm text-[#71718e]">Loading...</div>
      ) : pageData.length > 0 ? (
        <div className="space-y-1.5">
          {pageData.map((p, i) => (
            <PlayerRow key={p.id} player={p} rank={page * PAGE_SIZE + i + 1} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-sm text-[#71718e]">No players found in this gamemode.</div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="p-1.5 rounded-md text-[#71718e] hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#71718e] transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm text-[#71718e] font-medium">{page + 1} / {totalPages}</span>
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
            className="p-1.5 rounded-md text-[#71718e] hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#71718e] transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
