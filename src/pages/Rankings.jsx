import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trophy, ChevronLeft, ChevronRight, Info, Copy, Check } from 'lucide-react';
import { fetchPlayers, rankPlayers, getPlayerGamemodes } from '@/lib/api';
import { GAMEMODES, TIER_ORDER, SERVER_IP } from '@/lib/config';
import PlayerRow from '@/components/PlayerRow';

const PAGE_SIZE = 20;

export default function Rankings() {
  const { data: players = [], isLoading } = useQuery({ queryKey: ['players'], queryFn: fetchPlayers });
  const [activeMode, setActiveMode] = useState('overall');
  const [page, setPage] = useState(0);
  const [copied, setCopied] = useState(false);

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
  const activeLabel = activeMode === 'overall' ? 'overall' : GAMEMODES.find((g) => g.id === activeMode)?.label || '';

  const copyIP = () => {
    navigator.clipboard.writeText(SERVER_IP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Trophy className="text-yellow-400" size={28} />
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white">Leaderboard</h1>
        </div>
        <p className="text-muted-foreground">{filtered.length} players ranked {activeLabel !== 'overall' ? `in ${activeLabel}` : 'overall'}</p>
      </motion.div>

      {/* Gamemode tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {tabs.map((t) => {
          const gm = GAMEMODES.find((g) => g.id === t.id);
          const active = activeMode === t.id;
          return (
            <button
              key={t.id}
              onClick={() => { setActiveMode(t.id); setPage(0); }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-heading font-semibold text-sm transition-all ${
                active ? 'glass-strong text-white' : 'glass text-muted-foreground hover:text-white'
              }`}
              style={active && gm ? { borderColor: `${gm.color}55`, background: `${gm.color}15` } : undefined}
            >
              {gm && <img src={gm.icon} alt="" width={14} height={14} />}
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Info bar */}
      <div className="glass rounded-2xl p-4 mb-5 flex items-center gap-3">
        <Info size={18} className="text-muted-foreground shrink-0" />
        <div className="flex-1 text-sm text-muted-foreground min-w-0">
          <span className="font-heading font-semibold text-white">Information</span> — Connect to the server and request a tier test from our staff.
        </div>
        <button
          onClick={copyIP}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-900/40 border border-purple-500/30 text-white font-display font-bold text-sm hover:border-purple-500/60 transition-all shrink-0"
        >
          {SERVER_IP}
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
        </button>
      </div>

      {/* Leaderboard */}
      {isLoading ? (
        <div className="text-center py-20 text-muted-foreground">Loading rankings...</div>
      ) : pageData.length > 0 ? (
        <div className="space-y-2">
          {pageData.map((p, i) => (
            <PlayerRow key={p.id} player={p} rank={page * PAGE_SIZE + i + 1} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass rounded-2xl text-muted-foreground">No players found.</div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="p-2 rounded-lg glass text-white disabled:opacity-30 hover:border-indigo-500/40"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-heading font-semibold text-white px-4">{page + 1} / {totalPages}</span>
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
            className="p-2 rounded-lg glass text-white disabled:opacity-30 hover:border-indigo-500/40"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}