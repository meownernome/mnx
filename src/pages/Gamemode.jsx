import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Search } from 'lucide-react';
import { fetchPlayers, getPlayerGamemodes } from '@/lib/api';
import { GAMEMODES, TIER_ORDER, getTierConfig, getGamemode } from '@/lib/config';
import GamemodeIcon from '@/components/GamemodeIcon';
import TierBadge from '@/components/TierBadge';
import SearchBar from '@/components/SearchBar';

export default function Gamemode() {
  const { mode } = useParams();
  const { data: players = [], isLoading } = useQuery({ queryKey: ['players'], queryFn: fetchPlayers });
  const [search, setSearch] = useState('');

  const gm = getGamemode(mode);
  const config = getGamemode(mode);

  // Build leaderboard for this gamemode
  const leaderboard = useMemo(() => {
    const entries = [];
    players.forEach((p) => {
      const gms = getPlayerGamemodes(p);
      const data = gms[mode];
      if (data && data.tier && data.tier !== 'Unranked') {
        entries.push({ ...p, gmTier: data.tier, gmPoints: data.points || 0 });
      }
    });
    if (search) {
      return entries.filter((p) => p.username.toLowerCase().includes(search.toLowerCase()));
    }
    return entries.sort((a, b) => {
      const ta = TIER_ORDER.indexOf(a.gmTier);
      const tb = TIER_ORDER.indexOf(b.gmTier);
      if (ta !== tb) return ta - tb;
      return b.gmPoints - a.gmPoints;
    });
  }, [players, mode, search]);

  // Group by tier
  const tierGroups = useMemo(() => {
    const groups = {};
    TIER_ORDER.forEach((t) => (groups[t] = []));
    leaderboard.forEach((p) => {
      if (groups[p.gmTier]) groups[p.gmTier].push(p);
    });
    return groups;
  }, [leaderboard]);

  const suggestions = search ? players.filter((p) => p.username.toLowerCase().includes(search.toLowerCase())).slice(0, 6) : [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link to="/gamemodes" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white mb-6 text-sm font-heading font-semibold">
        <ArrowLeft size={18} /> All Gamemodes
      </Link>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="glass-strong rounded-3xl p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 30% 0%, ${gm.color}15, transparent 60%)` }} />
          <div className="relative z-10 flex items-center gap-5">
            <GamemodeIcon gamemodeId={gm.id} size={56} />
            <div>
              <h1 className="font-display font-black text-3xl sm:text-4xl text-white">{gm.label}</h1>
              <p className="text-muted-foreground mt-1">{leaderboard.length} ranked players</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <div className="mb-6">
        <SearchBar value={search} onChange={setSearch} placeholder={`Search ${gm.label} players...`} suggestions={suggestions} onSuggestionClick={(p) => (window.location.href = `/player/${encodeURIComponent(p.username)}`)} />
      </div>

      {/* Leaderboard grouped by tier */}
      {isLoading ? (
        <div className="text-center py-20 text-muted-foreground">Loading...</div>
      ) : search ? (
        <div className="space-y-2">
          {leaderboard.map((p, i) => (
            <PlayerRowLite key={p.id} player={p} rank={i + 1} gm={gm} />
          ))}
          {leaderboard.length === 0 && <div className="text-center py-20 glass rounded-2xl text-muted-foreground">No players found.</div>}
        </div>
      ) : (
        <div className="space-y-8">
          {TIER_ORDER.filter((t) => t !== 'Unranked' && (tierGroups[t] || []).length > 0).map((tier) => {
            const tc = getTierConfig(tier);
            return (
              <motion.div key={tier} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-1 h-8 rounded-full" style={{ background: tc.color, boxShadow: `0 0 12px ${tc.glow}` }} />
                  <h2 className="font-display font-bold text-xl text-white" style={{ color: tc.color }}>{tc.label}</h2>
                  <span className="text-sm text-muted-foreground">({tierGroups[tier].length})</span>
                </div>
                <div className="space-y-2">
                  {tierGroups[tier].map((p, i) => (
                    <PlayerRowLite key={p.id} player={p} rank={i + 1} gm={gm} tierBadge={tier} />
                  ))}
                </div>
              </motion.div>
            );
          })}
          {leaderboard.length === 0 && (
            <div className="text-center py-20 glass rounded-2xl text-muted-foreground">No players ranked in {gm.label} yet.</div>
          )}
        </div>
      )}
    </div>
  );
}

function PlayerRowLite({ player, rank, gm, tierBadge }) {
  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} whileHover={{ x: 2 }}>
      <Link to={`/player/${encodeURIComponent(player.username)}`}>
        <div className="flex items-center gap-4 px-4 py-3 rounded-2xl glass hover:glass-strong transition-all group">
          <div className="font-display font-black text-lg text-muted-foreground w-8">#{rank}</div>
          <img src={`https://mc-heads.net/avatar/${player.username}/100`} alt="" className="w-12 h-12 rounded-xl border border-indigo-500/20 group-hover:border-indigo-500/50" />
          <div className="flex-1 min-w-0">
            <div className="font-heading font-bold text-white truncate">{player.username}</div>
            <div className="text-xs text-muted-foreground">{player.status === 'Online' ? '🟢 Online' : '⚫ Offline'}</div>
          </div>
          {tierBadge && <TierBadge tier={tierBadge} size="sm" showLabel={false} />}
          <div className="text-right">
            <div className="font-display font-black text-lg text-white">{player.gmPoints}</div>
            <div className="text-[10px] uppercase text-muted-foreground">Points</div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}