import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { fetchPlayers, getPlayerGamemodes } from '@/lib/api';
import { GAMEMODES, TIER_ORDER, getTierConfig, getGamemode } from '@/lib/config';
import GamemodeIcon from '@/components/GamemodeIcon';
import TierBadge from '@/components/TierBadge';

export default function Gamemode() {
  const { mode } = useParams();
  const { data: players = [], isLoading } = useQuery({ queryKey: ['players'], queryFn: fetchPlayers });
  const [search, setSearch] = useState('');

  const gm = getGamemode(mode);

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

  const tierGroups = useMemo(() => {
    const groups = {};
    TIER_ORDER.forEach((t) => (groups[t] = []));
    leaderboard.forEach((p) => {
      if (groups[p.gmTier]) groups[p.gmTier].push(p);
    });
    return groups;
  }, [leaderboard]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10">
      <Link to="/gamemodes" className="inline-flex items-center gap-1.5 text-sm text-[#71718e] hover:text-white mb-5 transition-colors">
        <ArrowLeft size={16} /> All Gamemodes
      </Link>

      <div className="flex items-center gap-4 mb-6">
        <GamemodeIcon gamemodeId={gm.id} size={40} />
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white">{gm.label}</h1>
          <p className="text-sm text-[#71718e]">{leaderboard.length} ranked players</p>
        </div>
      </div>

      <div className="mb-5">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search players..."
          className="w-full sm:w-64 px-3 py-2 rounded-lg bg-[#11131f] border border-white/[0.08] text-sm text-white placeholder-[#555] outline-none focus:border-indigo-500/50 transition-colors"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-sm text-[#71718e]">Loading...</div>
      ) : search ? (
        <div className="space-y-1.5">
          {leaderboard.map((p, i) => (
            <PlayerRowLite key={p.id} player={p} rank={i + 1} />
          ))}
          {leaderboard.length === 0 && (
            <div className="text-center py-20 text-sm text-[#71718e]">No players found.</div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {TIER_ORDER.filter((t) => t !== 'Unranked' && (tierGroups[t] || []).length > 0).map((tier) => {
            const tc = getTierConfig(tier);
            return (
              <div key={tier}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-5 rounded-full" style={{ background: tc.color }} />
                  <h2 className="font-display font-bold text-base" style={{ color: tc.color }}>{tc.label}</h2>
                  <span className="text-xs text-[#555]">({tierGroups[tier].length})</span>
                </div>
                <div className="space-y-1">
                  {tierGroups[tier].map((p, i) => (
                    <PlayerRowLite key={p.id} player={p} rank={i + 1} tierBadge={tier} />
                  ))}
                </div>
              </div>
            );
          })}
          {leaderboard.length === 0 && (
            <div className="text-center py-20 text-sm text-[#71718e]">No players ranked in {gm.label} yet.</div>
          )}
        </div>
      )}
    </div>
  );
}

function PlayerRowLite({ player, rank, tierBadge }) {
  return (
    <Link to={`/player/${encodeURIComponent(player.username)}`} className="block group">
      <div className="card-base rounded-lg px-4 py-3 group-hover:card-hover transition-all">
        <div className="flex items-center gap-3">
          <div className="font-display font-bold text-sm text-[#555] w-6 text-right shrink-0">#{rank}</div>
          <img src={`https://mc-heads.net/avatar/${player.username}/100`} alt="" className="w-9 h-9 rounded-md shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="font-heading font-bold text-sm text-white truncate group-hover:text-indigo-400 transition-colors">{player.username}</div>
          </div>
          {tierBadge && <TierBadge tier={tierBadge} size="sm" showLabel={false} />}
          <div className="text-right">
            <div className="font-display font-bold text-sm text-white">{player.gmPoints}</div>
            <div className="text-[10px] text-[#555]">pts</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
