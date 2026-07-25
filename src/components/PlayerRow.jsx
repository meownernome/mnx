import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAvatarUrl, getPlayerGamemodes } from '@/lib/api';
import { GAMEMODES, getTierConfig, getTitle } from '@/lib/config';

export default function PlayerRow({ player, rank }) {
  const totalPoints = player.totalPoints || player.points || 0;
  const title = getTitle(totalPoints);
  const gamemodes = getPlayerGamemodes(player);
  const isTop3 = rank <= 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ x: 2 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/player/${encodeURIComponent(player.username)}`}>
        <div className="flex items-center gap-3 px-3 sm:px-4 py-3 rounded-xl glass hover:glass-strong transition-all group relative overflow-hidden">
          {isTop3 && (
            <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: '#FFD700' }} />
          )}

          {/* Rank */}
          <div
            className="shrink-0 w-7 text-right font-display font-black text-lg"
            style={{ color: isTop3 ? '#FFD700' : '#71718e' }}
          >
            {rank}.
          </div>

          {/* Avatar */}
          <img
            src={getAvatarUrl(player.username, 64)}
            alt={player.username}
            className="w-10 h-10 rounded-lg shrink-0 border border-white/10"
          />

          {/* Name + title */}
          <div className="flex-1 min-w-0">
            <div className="font-heading font-bold text-white text-base truncate group-hover:text-indigo-300 transition-colors">
              {player.username}
            </div>
            <div className="text-xs truncate">
              <span className="font-heading font-semibold" style={{ color: title.color }}>{title.label}</span>
              <span className="text-muted-foreground ml-1">({totalPoints} points)</span>
            </div>
          </div>

          {/* Region */}
          {player.region && player.region !== 'all' && (
            <div className="hidden sm:flex shrink-0 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-display font-bold text-muted-foreground">
              {player.region}
            </div>
          )}

          {/* Tier icons grid */}
          <div className="hidden md:flex shrink-0 gap-1">
            {GAMEMODES.map((gm) => {
              const data = gamemodes[gm.id];
              const tier = data?.tier;
              const tc = tier ? getTierConfig(tier) : null;
              const ranked = tier && tier !== 'Unranked';
              return (
                <div key={gm.id} className="flex flex-col items-center gap-0.5 w-9">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      background: ranked ? `${tc.color}12` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${ranked ? `${tc.color}44` : 'rgba(255,255,255,0.05)'}`,
                      opacity: ranked ? 1 : 0.25,
                    }}
                  >
                    <img
                      src={gm.icon}
                      alt=""
                      width={16}
                      height={16}
                      style={{ filter: ranked ? 'none' : 'grayscale(1)' }}
                    />
                  </div>
                  <span
                    className="text-[9px] font-display font-bold"
                    style={{ color: ranked ? tc.color : '#555' }}
                  >
                    {ranked ? tc.short : '—'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}