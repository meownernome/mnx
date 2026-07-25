import { getTierConfig } from '@/lib/config';

export default function TierBadge({ tier, size = 'md', showLabel = true }) {
  const config = getTierConfig(tier);

  const sizes = {
    xs: 'text-[10px] px-1.5 py-0.5',
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <span
        className={`${sizes[size] || sizes.md} font-display font-bold rounded`}
        style={{ background: `${config.color}18`, color: config.color, border: `1px solid ${config.color}30` }}
      >
        {config.short}
      </span>
      {showLabel && (
        <span className="text-[10px] text-[#71718e]">{config.label}</span>
      )}
    </div>
  );
}
