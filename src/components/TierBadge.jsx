import { motion } from 'framer-motion';
import { getTierConfig } from '@/lib/config';

const tierIcons = {
  HT1: '👑',
  LT1: '💎',
  HT2: '🛡️',
  LT2: '⚔️',
  HT3: '🗡️',
  LT3: '🪙',
  Unranked: '❓',
};

export default function TierBadge({ tier, size = 'md', animated = true, showLabel = true }) {
  const config = getTierConfig(tier);
  const icon = tierIcons[tier] || '❓';

  const sizes = {
    xs: { box: 'w-6 h-6', text: 'text-[10px]', icon: 'text-xs', label: 'text-[9px]' },
    sm: { box: 'w-9 h-9', text: 'text-xs', icon: 'text-sm', label: 'text-[10px]' },
    md: { box: 'w-12 h-12', text: 'text-sm', icon: 'text-lg', label: 'text-xs' },
    lg: { box: 'w-16 h-16', text: 'text-base', icon: 'text-2xl', label: 'text-sm' },
    xl: { box: 'w-20 h-20', text: 'text-lg', icon: 'text-3xl', label: 'text-base' },
  };
  const s = sizes[size] || sizes.md;

  const MotionDiv = animated ? motion.div : 'div';
  const motionProps = animated
    ? { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 }, whileHover: { scale: 1.08 } }
    : {};

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <MotionDiv
        {...motionProps}
        className={`${s.box} rounded-xl flex items-center justify-center relative overflow-hidden pulse-glow`}
        style={{
          background: `linear-gradient(135deg, ${config.color}22 0%, ${config.color}08 100%)`,
          border: `1px solid ${config.color}55`,
          '--glow-color': config.glow,
        }}
      >
        <div
          className="absolute inset-0 rounded-xl opacity-30"
          style={{ background: `radial-gradient(circle at 50% 30%, ${config.color}40, transparent 70%)` }}
        />
        <span className={`${s.icon} relative z-10`}>{icon}</span>
        <span
          className={`absolute bottom-0.5 ${s.label} font-display font-bold tracking-wider`}
          style={{ color: config.color }}
        >
          {config.short}
        </span>
      </MotionDiv>
      {showLabel && (
        <span className={`${s.label} font-heading font-semibold text-muted-foreground tracking-wide`}>
          {config.label}
        </span>
      )}
    </div>
  );
}