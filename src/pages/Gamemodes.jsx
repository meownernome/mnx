import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display font-black text-3xl sm:text-4xl text-white mb-2">Gamemodes</h1>
        <p className="text-muted-foreground">Choose a combat mode to view its tier leaderboard.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {GAMEMODES.map((gm, i) => (
          <motion.div
            key={gm.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
          >
            <Link
              to={`/gamemodes/${gm.id}`}
              className="block glass rounded-2xl p-6 hover:glass-strong hover:scale-[1.03] transition-all group relative overflow-hidden"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `radial-gradient(circle at 50% 0%, ${gm.color}15, transparent 70%)` }}
              />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <GamemodeIcon gamemodeId={gm.id} size={40} />
                  <div>
                    <h2 className="font-display font-bold text-xl text-white">{gm.label}</h2>
                    <p className="text-sm text-muted-foreground">{modeCounts[gm.id] || 0} ranked players</p>
                  </div>
                </div>
                {modeTopPlayer[gm.id] && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: `${gm.color}10`, border: `1px solid ${gm.color}25` }}>
                    <img src={`https://mc-heads.net/avatar/${modeTopPlayer[gm.id].username}/40`} alt="" className="w-7 h-7 rounded-md" />
                    <span className="font-heading font-semibold text-white text-sm flex-1 truncate">{modeTopPlayer[gm.id].username}</span>
                    <span className="font-display font-bold text-xs" style={{ color: gm.color }}>{modeTopPlayer[gm.id].tier}</span>
                  </div>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}