import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getBodyUrl } from '@/lib/api';
import { getTitle } from '@/lib/config';

const RANK_STYLE = [
  { label: '#1', color: '#FFD700', ring: 'border-yellow-400/60', glow: 'rgba(255,215,0,0.45)', medal: '🥇' },
  { label: '#2', color: '#C0C0C0', ring: 'border-slate-300/60', glow: 'rgba(192,192,192,0.35)', medal: '🥈' },
  { label: '#3', color: '#CD7F32', ring: 'border-amber-600/60', glow: 'rgba(205,127,50,0.35)', medal: '🥉' },
  { label: '#4', color: '#5B6CF6', ring: 'border-indigo-400/40', glow: 'rgba(91,108,246,0.3)', medal: '🏅' },
  { label: '#5', color: '#BF5FFF', ring: 'border-purple-400/40', glow: 'rgba(191,95,255,0.3)', medal: '🏅' },
];

export default function TopPlayerCard({ player, rank, index }) {
  const totalPoints = player.totalPoints || player.points || 0;
  const title = getTitle(totalPoints);
  const style = RANK_STYLE[rank - 1] || RANK_STYLE[4];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -6 }}
      className={rank <= 3 ? 'lg:scale-105' : ''}
    >
      <Link to={`/player/${encodeURIComponent(player.username)}`}>
        <div
          className="relative glass-strong rounded-2xl p-4 pt-5 text-center overflow-hidden transition-all group"
          style={{ borderColor: style.color + '40' }}
        >
          {/* Rank medal */}
          <div
            className="absolute top-3 left-3 z-20 w-8 h-8 rounded-full flex items-center justify-center font-display font-black text-sm"
            style={{ background: style.color + '22', border: `1px solid ${style.color}66`, color: style.color }}
          >
            {rank}
          </div>

          {/* Glow */}
          <div
            className="absolute inset-x-0 top-0 h-24 blur-2xl opacity-40 group-hover:opacity-70 transition-opacity"
            style={{ background: style.glow }}
          />

          {/* Full body skin */}
          <div className="relative z-10 flex justify-center">
            <img
              src={getBodyUrl(player.username, 200)}
              alt={player.username}
              className="h-40 w-auto object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>

          {/* Name */}
          <div className="relative z-10 mt-1">
            <div className="font-display font-bold text-white text-base truncate group-hover:text-indigo-300 transition-colors">
              {player.username}
            </div>

            {/* Title badge */}
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full mt-1.5 mb-2"
              style={{ background: title.color + '1a', border: `1px solid ${title.color}40` }}
            >
              <span className="text-[10px] font-heading font-bold uppercase tracking-wider" style={{ color: title.color }}>
                {title.label}
              </span>
            </div>

            {/* Points */}
            <div className="flex items-center justify-center gap-1 text-sm">
              <span className="font-display font-black" style={{ color: style.color }}>{totalPoints}</span>
              <span className="text-muted-foreground text-xs">points</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}