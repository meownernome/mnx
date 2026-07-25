import { Link } from 'react-router-dom';
import { getBodyUrl } from '@/lib/api';
import { getTitle } from '@/lib/config';

const RANK_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32', '#5B6CF6', '#BF5FFF'];

export default function TopPlayerCard({ player, rank }) {
  const totalPoints = player.totalPoints || player.points || 0;
  const title = getTitle(totalPoints);
  const color = RANK_COLORS[rank - 1] || '#5B6CF6';

  return (
    <Link to={`/player/${encodeURIComponent(player.username)}`} className="block group">
      <div className="card-base rounded-xl p-4 text-center group-hover:card-hover transition-all">
        <div className="text-xs font-display font-bold mb-2" style={{ color }}>#{rank}</div>
        <div className="flex justify-center">
          <img
            src={getBodyUrl(player.username, 200)}
            alt={player.username}
            className="h-28 w-auto object-contain"
            loading="lazy"
          />
        </div>
        <div className="mt-2 font-heading font-bold text-sm text-white truncate group-hover:text-indigo-400 transition-colors">
          {player.username}
        </div>
        <div className="text-[11px] font-medium" style={{ color: title.color }}>{title.label}</div>
        <div className="text-xs text-[#71718e] mt-0.5">{totalPoints} pts</div>
      </div>
    </Link>
  );
}
