import { ArrowUpRight, Bot, Dices, Pause, Play, type LucideIcon } from 'lucide-react';

export const ICON = {
  play: Play,
  pause: Pause,
  external: ArrowUpRight,
  bot: Bot,
  dice: Dices,
} as const satisfies Record<string, LucideIcon>;

const SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
} as const;

export type IconSize = keyof typeof SIZES;

export interface IconProps {
  icon: LucideIcon;
  size?: IconSize;
  label?: string;
  className?: string;
  strokeWidth?: number;
}

export function Icon({
  icon: Component,
  size = 'md',
  label,
  className,
  strokeWidth = 2,
}: IconProps) {
  return (
    <Component
      width={SIZES[size]}
      height={SIZES[size]}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      focusable="false"
    />
  );
}
