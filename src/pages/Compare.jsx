import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Swords, User, UserCheck, ArrowLeftRight } from 'lucide-react';
import { fetchPlayers, getPlayerGamemodes, getAvatarUrl, getBestTier } from '@/lib/api';
import { GAMEMODES, getTierConfig, TIER_ORDER } from '@/lib/config';
import TierBadge from '@/components/TierBadge';
import GamemodeIcon from '@/components/GamemodeIcon';

export default function Compare() {
  const { data: players = [] } = useQuery({ queryKey: ['players'], queryFn: fetchPlayers });
  const [p1, setP1] = useState(null);
  const [p2, setP2] = useState(null);
  const [search1, setSearch1] = useState('');
  const [search2, setSearch2] = useState('');

  const filtered1 = search1 ? players.filter((p) => p.username.toLowerCase().includes(search1.toLowerCase()) && p.username !== p2?.username).slice(0, 6) : [];
  const filtered2 = search2 ? players.filter((p) => p.username.toLowerCase().includes(search2.toLowerCase()) && p.username !== p1?.username).slice(0, 6) : [];

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
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10">
      <div className="mb-8 text-center">
        <h1 className="font-display font-black text-2xl sm:text-3xl text-white mb-2">Head-to-Head</h1>
        <p className="text-sm text-[#71718e]">Select two players to compare their tiers and points.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="card-base rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <User size={16} className="text-indigo-400" />
            <span className="text-sm font-semibold text-white">Player 1</span>
          </div>
          {p1 ? (
            <SelectedPlayer player={p1} onClear={() => setP1(null)} />
          ) : (
            <div className="relative">
              <input
                type="text"
                value={search1}
                onChange={(e) => setSearch1(e.target.value)}
                placeholder="Search..."
                className="w-full px-3 py-2 rounded-lg bg-[#11131f] border border-white/[0.08] text-sm text-white placeholder-[#555] outline-none focus:border-indigo-500/50"
              />
              {filtered1.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-white/[0.06] bg-[#11131f] z-10 overflow-hidden">
                  {filtered1.map((p) => (
                    <button key={p.id} onClick={() => { setP1(p); setSearch1(''); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-white/[0.06] text-left">
                      <img src={getAvatarUrl(p.username, 40)} alt="" className="w-6 h-6 rounded" />
                      {p.username}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="card-base rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <UserCheck size={16} className="text-purple-400" />
            <span className="text-sm font-semibold text-white">Player 2</span>
          </div>
          {p2 ? (
            <SelectedPlayer player={p2} onClear={() => setP2(null)} color="purple" />
          ) : (
            <div className="relative">
              <input
                type="text"
                value={search2}
                onChange={(e) => setSearch2(e.target.value)}
                placeholder="Search..."
                className="w-full px-3 py-2 rounded-lg bg-[#11131f] border border-white/[0.08] text-sm text-white placeholder-[#555] outline-none focus:border-purple-500/50"
              />
              {filtered2.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-white/[0.06] bg-[#11131f] z-10 overflow-hidden">
                  {filtered2.map((p) => (
                    <button key={p.id} onClick={() => { setP2(p); setSearch2(''); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-white/[0.06] text-left">
                      <img src={getAvatarUrl(p.username, 40)} alt="" className="w-6 h-6 rounded" />
                      {p.username}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {comparison ? (
        <div>
          <div className="card-base rounded-xl p-5 mb-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <img src={getAvatarUrl(p1.username, 40)} alt="" className="w-7 h-7 rounded-lg" />
                <span className="text-sm font-semibold text-white">{p1.username}</span>
                <span className="text-xs text-[#555]">({comparison.total1} pts · {comparison.winner1} wins)</span>
              </div>
              <div className="text-xs font-semibold text-[#555]">VS</div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#555]">({comparison.winner2} wins · {comparison.total2} pts)</span>
                <span className="text-sm font-semibold text-white">{p2.username}</span>
                <img src={getAvatarUrl(p2.username, 40)} alt="" className="w-7 h-7 rounded-lg" />
              </div>
            </div>
            <div className="flex h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-500" style={{ width: `${(comparison.total1 / comparison.maxTotal) * 100}%` }} />
              <div className="bg-purple-500" style={{ width: `${(comparison.total2 / comparison.maxTotal) * 100}%` }} />
            </div>
          </div>

          <div className="space-y-1.5">
            {comparison.rows.map(({ gm, tier1, tier2, pts1, pts2, winner }) => (
              <div key={gm.id} className="card-base rounded-lg px-4 py-3 grid grid-cols-3 items-center gap-2">
                <div className={`flex items-center gap-2 justify-end ${winner === 1 ? '' : 'opacity-40'}`}>
                  <span className="text-xs font-display font-bold" style={{ color: getTierConfig(tier1).color }}>{tier1}</span>
                  <span className="font-display font-bold text-sm text-white">{pts1}</span>
                  {winner === 1 && <span className="text-green-500 text-sm">✓</span>}
                </div>
                <div className="flex flex-col items-center">
                  <GamemodeIcon gamemodeId={gm.id} size={18} />
                  <span className="text-[10px] text-[#71718e] mt-0.5">{gm.label}</span>
                </div>
                <div className={`flex items-center gap-2 ${winner === 2 ? '' : 'opacity-40'}`}>
                  {winner === 2 && <span className="text-green-500 text-sm">✓</span>}
                  <span className="font-display font-bold text-sm text-white">{pts2}</span>
                  <span className="text-xs font-display font-bold" style={{ color: getTierConfig(tier2).color }}>{tier2}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card-base rounded-xl p-12 text-center">
          <Swords className="mx-auto text-[#555] mb-3" size={36} />
          <h2 className="font-display font-bold text-lg text-white mb-1">Select Two Players</h2>
          <p className="text-sm text-[#71718e]">Choose two competitors to see a head-to-head breakdown.</p>
        </div>
      )}
    </div>
  );
}

function SelectedPlayer({ player, onClear }) {
  return (
    <div className="flex items-center gap-3">
      <img src={getAvatarUrl(player.username, 60)} alt="" className="w-10 h-10 rounded-lg" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-white truncate">{player.username}</div>
        <div className="text-xs text-[#71718e]">{getBestTier(player)} · {player.totalPoints || player.points || 0} pts</div>
      </div>
      <button onClick={onClear} className="text-xs text-[#555] hover:text-white transition-colors">✕</button>
    </div>
  );
}
