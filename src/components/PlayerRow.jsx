import { Link } from 'react-router-dom';
import { getAvatarUrl, getPlayerGamemodes } from '@/lib/api';
import { GAMEMODES, getTierConfig, getTitle } from '@/lib/config';

export default function PlayerRow({ player, rank }) {
  const totalPoints = player.totalPoints || player.points || 0;
  const title = getTitle(totalPoints);
  const gamemodes = getPlayerGamemodes(player);

  return (
    <Link to={`/player/${encodeURIComponent(player.username)}`} className="block group">
      <div className="card-base rounded-lg px-4 py-3 group-hover:card-hover transition-all">
        <div className="flex items-center gap-3">
          <div className="w-6 text-right font-display font-bold text-sm text-[#555] shrink-0">
            {rank}
          </div>
          <img
            src={getAvatarUrl(player.username, 64)}
            alt={player.username}
            className="w-9 h-9 rounded-md shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="font-heading font-bold text-sm text-white truncate group-hover:text-indigo-400 transition-colors">
              {player.username}
            </div>
            <div className="text-xs text-[#71718e] truncate">
              <span style={{ color: title.color }}>{title.label}</span>
              <span className="ml-1">· {totalPoints} pts</span>
            </div>
          </div>
          {player.region && player.region !== 'all' && (
            <div className="hidden sm:block text-xs text-[#555] px-2 py-0.5 rounded border border-white/[0.06]">
              {player.region}
            </div>
          )}
          <div className="hidden md:flex items-center gap-1">
            {GAMEMODES.map((gm) => {
              const data = gamemodes[gm.id];
              const tc = data?.tier ? getTierConfig(data.tier) : null;
              const ranked = tc && data.tier !== 'Unranked';
              return (
                <div
                  key={gm.id}
                  className="w-7 h-7 rounded flex items-center justify-center"
                  style={{
                    background: ranked ? `${tc.color}15` : 'transparent',
                    opacity: ranked ? 1 : 0.15,
                  }}
                  title={ranked ? `${gm.label}: ${tc.short}` : gm.label}
                >
                  <img src={gm.icon} alt="" width={12} height={12} style={{ filter: ranked ? 'none' : 'grayscale(1)' }} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Link>
  );
}
