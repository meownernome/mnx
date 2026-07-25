import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchPlayers, getPlayerGamemodes } from '@/lib/api';
import { GAMEMODES } from '@/lib/config';
import GamemodeIcon from '@/components/GamemodeIcon';

export default function Gamemodes() {
  const { data: players = [] } = useQuery({ queryKey: ['players'], queryFn: fetchPlayers });

  const modeCounts = {};
  const modeTopPlayer = {};
  players.forEach((p) => {
    const gms = getPlayerGamemodes(p);
    Object.entries(gms).forEach(([mode, data]) => {
      if (data.tier && data.tier !== 'Unranked') {
        modeCounts[mode] = (modeCounts[mode] || 0) + 1;
        if (!modeTopPlayer[mode] || (data.points || 0) > (modeTopPlayer[mode].points || 0)) {
          modeTopPlayer[mode] = { username: p.username, points: data.points || 0, tier: data.tier };
        }
      }
    });
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10">
      <div className="mb-6">
        <h1 className="font-display font-black text-2xl sm:text-3xl text-white mb-1">Gamemodes</h1>
        <p className="text-sm text-[#71718e]">Choose a combat mode to view its tier leaderboard.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {GAMEMODES.map((gm) => (
          <Link
            key={gm.id}
            to={`/gamemodes/${gm.id}`}
            className="card-base rounded-xl p-5 hover:card-hover transition-all group"
          >
            <div className="flex items-center gap-4 mb-3">
              <GamemodeIcon gamemodeId={gm.id} size={32} />
              <div>
                <h2 className="font-display font-bold text-base text-white group-hover:text-indigo-400 transition-colors">{gm.label}</h2>
                <p className="text-xs text-[#71718e]">{modeCounts[gm.id] || 0} ranked</p>
              </div>
            </div>
            {modeTopPlayer[gm.id] && (
              <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: `${gm.color}10` }}>
                <img src={`https://mc-heads.net/avatar/${modeTopPlayer[gm.id].username}/40`} alt="" className="w-6 h-6 rounded" />
                <span className="text-xs font-semibold text-white flex-1 truncate">{modeTopPlayer[gm.id].username}</span>
                <span className="text-[10px] font-display font-bold" style={{ color: gm.color }}>{modeTopPlayer[gm.id].tier}</span>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}