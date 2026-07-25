import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { X, Trophy, ExternalLink } from 'lucide-react';
import { fetchPlayers, getPlayerGamemodes, getAvatarUrl } from '@/lib/api';
import { GAMEMODES, getTierConfig, getTitle, getRegion } from '@/lib/config';

export default function PlayerProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { data: players = [], isLoading } = useQuery({ queryKey: ['players'], queryFn: fetchPlayers });

  const player = useMemo(() => players.find((p) => p.username.toLowerCase() === username.toLowerCase()), [players, username]);
  const ranked = useMemo(() => [...players].sort((a, b) => (b.totalPoints || b.points || 0) - (a.totalPoints || a.points || 0)), [players]);
  const overallRank = player ? ranked.findIndex((p) => p.username === player.username) + 1 : 0;

  const close = () => navigate('/rankings');

  let content;
  if (isLoading) {
    content = (
      <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
        <div className="text-muted-foreground">Loading player...</div>
      </div>
    );
  } else if (!player) {
    content = (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-strong rounded-3xl p-12 text-center max-w-md w-full"
      >
        <h1 className="font-display font-bold text-2xl text-white mb-2">Player Not Found</h1>
        <p className="text-muted-foreground mb-6">No player named "{username}" exists in the rankings.</p>
        <button onClick={close} className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-heading font-semibold">Back to Rankings</button>
      </motion.div>
    );
  } else {
    const gamemodes = getPlayerGamemodes(player);
    const totalPoints = player.totalPoints || player.points || 0;
    const title = getTitle(totalPoints);
    const region = player.region && player.region !== 'all' ? getRegion(player.region) : null;
    const isTop3 = overallRank <= 3;

    content = (
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="rounded-3xl w-full max-w-xl my-4 sm:my-8 relative overflow-hidden"
        style={{ background: '#161c22', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* Close button */}
        <button
          onClick={close}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#6b7887' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#6b7887'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center pt-10 pb-5 px-6">
          {/* Avatar */}
          <div className="relative mb-4">
            <div className="absolute inset-0 rounded-full blur-xl opacity-30" style={{ background: title.color }} />
            <img
              src={getAvatarUrl(player.username, 200)}
              alt={player.username}
              className="relative w-24 h-24 rounded-full object-cover"
              style={{ border: '3px solid #FFD700', boxShadow: '0 0 20px rgba(255,215,0,0.25)' }}
            />
          </div>

          {/* Name */}
          <h1 className="font-display font-black text-3xl mb-3 gradient-text">{player.username}</h1>

          {/* Title badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3"
            style={{ background: title.color }}
          >
            <Trophy size={14} className="text-black/70" />
            <span className="font-heading font-bold text-sm text-black/80">{title.label}</span>
          </div>

          {/* Region */}
          {region && (
            <div className="text-sm mb-3" style={{ color: '#6b7887' }}>{region.flag} {region.label}</div>
          )}

          {/* NameMC link */}
          <a
            href={`https://namemc.com/profile/${encodeURIComponent(player.username)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-heading font-semibold transition-all hover:bg-white/10"
            style={{ background: '#1a1a1a', border: '1px solid #444a54', color: '#fff' }}
          >
            <span className="w-5 h-5 rounded bg-black flex items-center justify-center font-display font-black text-xs" style={{ color: '#fff' }}>n</span>
            NameMC
            <ExternalLink size={14} style={{ color: '#6b7887' }} />
          </a>
        </div>

        {/* Divider */}
        <div className="h-px mx-6" style={{ background: 'rgba(255,255,255,0.06)' }} />

        {/* POSITION section */}
        <div className="px-6 py-5">
          <h2 className="text-xs uppercase tracking-wider font-heading font-bold mb-3" style={{ color: '#6b7887' }}>Position</h2>
          <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: '#282e35' }}>
            {/* Rank badge */}
            <div
              className="flex items-center justify-center font-display font-black text-2xl"
              style={{
                background: isTop3 ? '#FFD700' : '#3a3f4a',
                color: isTop3 ? '#000' : '#fff',
                clipPath: 'polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)',
                padding: '0.625rem 1.75rem 0.625rem 0.875rem',
              }}
            >
              {overallRank}.
            </div>
            <Trophy size={20} style={{ color: '#FFD700' }} />
            <span className="font-display font-bold text-lg text-white">OVERALL</span>
            <span className="text-sm" style={{ color: '#b0b0b0' }}>({totalPoints} points)</span>
          </div>
        </div>

        {/* TIERS section */}
        <div className="px-6 pb-8">
          <h2 className="text-xs uppercase tracking-wider font-heading font-bold mb-3" style={{ color: '#6b7887' }}>Tiers</h2>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            {GAMEMODES.map((gm) => {
              const data = gamemodes[gm.id];
              const tier = data?.tier;
              const tc = tier ? getTierConfig(tier) : null;
              const isRanked = tier && tier !== 'Unranked';
              return (
                <div key={gm.id} className="flex flex-col items-center gap-1 p-2.5 rounded-xl" style={{ background: '#282e35' }}>
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{
                      background: isRanked ? `${tc.color}15` : 'transparent',
                      border: `1px solid ${isRanked ? `${tc.color}44` : 'rgba(255,255,255,0.05)'}`,
                      opacity: isRanked ? 1 : 0.25,
                    }}
                  >
                    <img
                      src={gm.icon}
                      alt={gm.label}
                      width={20}
                      height={20}
                      style={{ filter: isRanked ? 'none' : 'grayscale(1)' }}
                    />
                  </div>
                  <span
                    className="text-xs font-display font-bold"
                    style={{ color: isRanked ? tc.color : '#555' }}
                  >
                    {isRanked ? tc.short : '—'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    );
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-4 overflow-y-auto"
      style={{ background: 'rgba(0,0,0,0.78)' }}
      onClick={close}
    >
      {content}
    </div>,
    document.body
  );
}