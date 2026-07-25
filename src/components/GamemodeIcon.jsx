import { getGamemode } from '@/lib/config';

export default function GamemodeIcon({ gamemodeId, size = 28, className = '' }) {
  const gm = getGamemode(gamemodeId);
  return (
    <div
      className={`inline-flex items-center justify-center rounded-lg ${className}`}
      style={{
        width: size + 12,
        height: size + 12,
        background: `${gm.color}15`,
        border: `1px solid ${gm.color}33`,
      }}
    >
      <img src={gm.icon} alt={gm.label} width={size} height={size} className="object-contain" />
    </div>
  );
}

export function GamemodeTag({ gamemodeId, tier, points, size = 'md' }) {
  const gm = getGamemode(gamemodeId);
  const sizeClass = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm';

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-lg ${sizeClass}`}
      style={{ background: `${gm.color}12`, border: `1px solid ${gm.color}33` }}
    >
      <img src={gm.icon} alt={gm.label} width={18} height={18} className="object-contain" />
      <span className="font-heading font-semibold" style={{ color: gm.color }}>
        {gm.label}
      </span>
      {tier && (
        <span className="font-display font-bold text-xs px-1.5 py-0.5 rounded" style={{ background: `${gm.color}22` }}>
          {tier}
        </span>
      )}
    </div>
  );
}