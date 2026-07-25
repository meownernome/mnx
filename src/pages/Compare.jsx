import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Swords, Search, User, UserCheck, ArrowLeftRight } from 'lucide-react';
import { fetchPlayers, getPlayerGamemodes, getAvatarUrl, getBodyUrl, getBestTier } from '@/lib/api';
import { GAMEMODES, getTierConfig, TIER_ORDER } from '@/lib/config';
import TierBadge from '@/components/TierBadge';
import GamemodeIcon from '@/components/GamemodeIcon';
import SearchBar from '@/components/SearchBar';

export default function Compare() {
  const { data: players = [] } = useQuery({ queryKey: ['players'], queryFn: fetchPlayers });
  const [p1, setP1] = useState(null);
  const [p2, setP2] = useState(null);
  const [search1, setSearch1] = useState('');
  const [search2, setSearch2] = useState('');

  const suggestions1 = search1 ? players.filter((p) => p.username.toLowerCase().includes(search1.toLowerCase()) && p.username !== p2?.username).slice(0, 6) : [];
  const suggestions2 = search2 ? players.filter((p) => p.username.toLowerCase().includes(search2.toLowerCase()) && p.username !== p1?.username).slice(0, 6) : [];

  const comparison = useMemo(() => {
    if (!p1 || !p2) return null;
    const rows = GAMEMODES.map((gm) => {
      const gms1 = getPlayerGamemodes(p1);
      const gms2 = getPlayerGamemodes(p2);
      const d1 = gms1[gm.id];
      const d2 = gms2[gm.id];
      if (!d1 && !d2) return null;
      const pts1 = d1?.points || 0;
      const pts2 = d2?.points || 0;
      const tier1 = d1?.tier || 'Unranked';
      const tier2 = d2?.tier || 'Unranked';
      let winner = 0;
      if (TIER_ORDER.indexOf(tier1) < TIER_ORDER.indexOf(tier2)) winner = 1;
      else if (TIER_ORDER.indexOf(tier2) < TIER_ORDER.indexOf(tier1)) winner = 2;
      else if (pts1 > pts2) winner = 1;
      else if (pts2 > pts1) winner = 2;
      return { gm, tier1, tier2, pts1, pts2, winner };
    }).filter(Boolean);

    const total1 = p1.totalPoints || p1.points || 0;
    const total2 = p2.totalPoints || p2.points || 0;
    const maxTotal = Math.max(total1, total2, 1);

    return { rows, total1, total2, maxTotal, winner1: rows.filter((r) => r.winner === 1).length, winner2: rows.filter((r) => r.winner === 2).length };
  }, [p1, p2]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
        <h1 className="font-display font-black text-3xl sm:text-5xl text-white mb-2 flex items-center justify-center gap-3">
          <ArrowLeftRight className="text-indigo-400" /> Head-to-Head
        </h1>
        <p className="text-muted-foreground">Select two players to compare their tiers and points across all gamemodes.</p>
      </motion.div>

      {/* Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {/* Player 1 */}
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <User className="text-indigo-400" size={18} />
            <span className="font-heading font-semibold text-white">Player 1</span>
          </div>
          {p1 ? (
            <SelectedPlayer player={p1} onClear={() => setP1(null)} />
          ) : (
            <SearchBar value={search1} onChange={setSearch1} placeholder="Search player..." suggestions={suggestions1} onSuggestionClick={(p) => setP1(p)} />
          )}
        </div>

        {/* Player 2 */}
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <UserCheck className="text-purple-400" size={18} />
            <span className="font-heading font-semibold text-white">Player 2</span>
          </div>
          {p2 ? (
            <SelectedPlayer player={p2} onClear={() => setP2(null)} color="purple" />
          ) : (
            <SearchBar value={search2} onChange={setSearch2} placeholder="Search player..." suggestions={suggestions2} onSuggestionClick={(p) => setP2(p)} />
          )}
        </div>
      </div>

      {/* Comparison */}
      {comparison ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Total points bar */}
          <div className="glass-strong rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <img src={getAvatarUrl(p1.username, 40)} alt="" className="w-8 h-8 rounded-lg" />
                <span className="font-heading font-bold text-white">{p1.username}</span>
                <span className="font-display font-black text-indigo-400 text-xl">{comparison.total1}</span>
                <span className="text-xs text-muted-foreground">wins: {comparison.winner1}</span>
              </div>
              <div className="font-display font-bold text-muted-foreground text-sm">VS</div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">wins: {comparison.winner2}</span>
                <span className="font-display font-black text-purple-400 text-xl">{comparison.total2}</span>
                <span className="font-heading font-bold text-white">{p2.username}</span>
                <img src={getAvatarUrl(p2.username, 40)} alt="" className="w-8 h-8 rounded-lg" />
              </div>
            </div>
            {/* Bar */}
            <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
              <div className="bg-indigo-500" style={{ width: `${(comparison.total1 / comparison.maxTotal) * 100}%` }} />
              <div className="bg-purple-500" style={{ width: `${(comparison.total2 / comparison.maxTotal) * 100}%` }} />
            </div>
          </div>

          {/* Gamemode rows */}
          <div className="space-y-2">
            {comparison.rows.map(({ gm, tier1, tier2, pts1, pts2, winner }) => (
              <motion.div
                key={gm.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass rounded-2xl p-4 grid grid-cols-3 items-center gap-2"
              >
                {/* P1 */}
                <div className={`flex items-center gap-2 justify-end text-right ${winner === 1 ? 'opacity-100' : 'opacity-50'}`}>
                  <span className="font-display font-bold text-sm" style={{ color: getTierConfig(tier1).color }}>{tier1}</span>
                  <span className="font-display font-black text-white text-lg">{pts1}</span>
                  {winner === 1 && <span className="text-green-400 text-lg">✓</span>}
                </div>
                {/* Gamemode */}
                <div className="flex flex-col items-center">
                  <GamemodeIcon gamemodeId={gm.id} size={24} />
                  <span className="text-xs text-muted-foreground mt-1">{gm.label}</span>
                </div>
                {/* P2 */}
                <div className={`flex items-center gap-2 ${winner === 2 ? 'opacity-100' : 'opacity-50'}`}>
                  {winner === 2 && <span className="text-green-400 text-lg">✓</span>}
                  <span className="font-display font-black text-white text-lg">{pts2}</span>
                  <span className="font-display font-bold text-sm" style={{ color: getTierConfig(tier2).color }}>{tier2}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
        <div className="glass rounded-3xl p-16 text-center">
          <Swords className="mx-auto text-muted-foreground mb-4" size={48} />
          <h2 className="font-display font-bold text-xl text-white mb-2">Select Two Players</h2>
          <p className="text-muted-foreground">Choose two competitors to see their head-to-head breakdown.</p>
        </div>
      )}
    </div>
  );
}

function SelectedPlayer({ player, onClear, color = 'indigo' }) {
  const colorMap = { indigo: '#5B6CF6', purple: '#BF5FFF' };
  return (
    <div className="flex items-center gap-3">
      <img src={getAvatarUrl(player.username, 60)} alt="" className="w-12 h-12 rounded-xl" style={{ border: `1px solid ${colorMap[color]}44` }} />
      <div className="flex-1 min-w-0">
        <div className="font-heading font-bold text-white truncate">{player.username}</div>
        <div className="text-xs text-muted-foreground">{getBestTier(player)} • {player.totalPoints || player.points || 0} pts</div>
      </div>
      <button onClick={onClear} className="text-muted-foreground hover:text-white text-sm">✕</button>
    </div>
  );
}