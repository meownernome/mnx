import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
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
        <div className="text-sm text-[#71718e]">Loading...</div>
      </div>
    );
  } else if (!player) {
    content = (
      <div className="card-base rounded-xl p-10 text-center max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <h1 className="font-display font-bold text-xl text-white mb-2">Player Not Found</h1>
        <p className="text-sm text-[#71718e] mb-5">No player named "{username}" exists.</p>
        <button onClick={close} className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition-colors">Back to Rankings</button>
      </div>
    );
  } else {
    const gamemodes = getPlayerGamemodes(player);
    const totalPoints = player.totalPoints || player.points || 0;
    const title = getTitle(totalPoints);
    const region = player.region && player.region !== 'all' ? getRegion(player.region) : null;
    const isTop3 = overallRank <= 3;

    content = (
      <div
        onClick={(e) => e.stopPropagation()}
        className="rounded-xl w-full max-w-lg my-4 sm:my-8"
        style={{ background: '#11131f', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <button
          onClick={close}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-lg flex items-center justify-center text-[#555] hover:text-white hover:bg-white/[0.06] transition-all"
        >
          <X size={16} />
        </button>

        <div className="flex flex-col items-center pt-8 pb-5 px-6">
          <div className="relative mb-4">
            <div className="absolute inset-0 rounded-full blur-xl opacity-20" style={{ background: title.color }} />
            <img
              src={getAvatarUrl(player.username, 200)}
              alt={player.username}
              className="relative w-20 h-20 rounded-full"
              style={{ border: '2px solid #FFD700' }}
            />
          </div>

          <h1 className="font-display font-bold text-2xl text-white mb-2">{player.username}</h1>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full mb-2" style={{ background: title.color + '20', border: '1px solid ' + title.color + '40' }}>
            <Trophy size={12} style={{ color: title.color }} />
            <span className="text-xs font-heading font-bold" style={{ color: title.color }}>{title.label}</span>
          </div>

          {region && (
            <div className="text-xs text-[#71718e] mb-3">{region.flag} {region.label}</div>
          )}

          <a
            href={`https://namemc.com/profile/${encodeURIComponent(player.username)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#71718e] hover:text-white hover:bg-white/[0.06] transition-all border border-white/[0.06]"
          >
            NameMC <ExternalLink size={12} />
          </a>
        </div>

        <div className="h-px mx-6" style={{ background: 'rgba(255,255,255,0.06)' }} />

        <div className="px-6 py-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#555] mb-2">Position</h2>
          <div className="flex items-center gap-3 rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div
              className="font-display font-bold text-lg px-3 py-1 rounded"
              style={{
                background: isTop3 ? '#FFD700' : '#1e2040',
                color: isTop3 ? '#000' : '#fff',
              }}
            >
              #{overallRank}
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Overall</div>
              <div className="text-xs text-[#71718e]">{totalPoints} points</div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#555] mb-2">Tiers</h2>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            {GAMEMODES.map((gm) => {
              const data = gamemodes[gm.id];
              const tier = data?.tier;
              const tc = tier ? getTierConfig(tier) : null;
              const isRanked = tier && tier !== 'Unranked';
              return (
                <div key={gm.id} className="flex flex-col items-center gap-1 p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      background: isRanked ? `${tc.color}15` : 'transparent',
                      border: `1px solid ${isRanked ? `${tc.color}30` : 'rgba(255,255,255,0.05)'}`,
                      opacity: isRanked ? 1 : 0.2,
                    }}
                  >
                    <img src={gm.icon} alt="" width={14} height={14} style={{ filter: isRanked ? 'none' : 'grayscale(1)' }} />
                  </div>
                  <span
                    className="text-[10px] font-display font-bold"
                    style={{ color: isRanked ? tc.color : '#333' }}
                  >
                    {isRanked ? tc.short : '—'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-4 overflow-y-auto"
      style={{ background: 'rgba(0,0,0,0.8)' }}
      onClick={close}
    >
      {content}
    </div>,
    document.body
  );
}
