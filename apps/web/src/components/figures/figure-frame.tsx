'use client';

import { ICON, Icon } from '@repo/ui';
import type { ReactNode } from 'react';
import type { FigureSpeed } from './use-figure-player';

const SPEEDS: FigureSpeed[] = [0.5, 1, 2];

interface FigureFrameProps {
  viz: string;
  label: string;
  captions: string[];
  step: number;
  playing: boolean;
  speed: FigureSpeed;
  onToggle: () => void;
  onSpeed: (speed: FigureSpeed) => void;
  children: ReactNode;
  captionClassName?: string;
  captionOverride?: string;
  className?: string;
}

export function FigureFrame({
  viz,
  label,
  captions,
  step,
  playing,
  speed,
  onToggle,
  onSpeed,
  children,
  captionClassName = 'text-ink-soft',
  captionOverride,
  className = 'min-h-[300px]',
}: FigureFrameProps) {
  const active = step % captions.length;
  return (
    <figure
      data-viz={viz}
      className={`my-6 flex flex-col rounded-lg border border-neutral-200 bg-neutral-50 p-5 ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="font-ui text-[11px] font-medium tracking-[0.08em] text-neutral-500 uppercase">
          {label}
        </span>
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {captions.map((caption, index) => (
            <span
              key={caption}
              className={
                index === active
                  ? 'h-1 w-3 rounded-full bg-blue-500 transition-all'
                  : 'size-1 rounded-full bg-neutral-300 transition-all'
              }
            />
          ))}
        </div>
      </div>

      <div className="relative flex flex-1 flex-col justify-center py-4">{children}</div>

      <div className="flex items-end justify-between gap-4">
        <p className={`font-ui text-sm ${captionClassName}`}>
          {captionOverride ?? captions[active]}
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label={playing ? 'Pause figure' : 'Play figure'}
            onClick={onToggle}
            className="rounded-full p-1 text-neutral-500 transition-colors hover:text-neutral-900"
          >
            <Icon icon={playing ? ICON.pause : ICON.play} size="sm" />
          </button>
          <div className="flex rounded-full bg-neutral-200/60 p-0.5">
            {SPEEDS.map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={speed === value}
                onClick={() => onSpeed(value)}
                className={`font-code rounded-full px-1.5 py-0.5 text-[11px] tabular-nums transition-colors ${
                  speed === value
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {value}×
              </button>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}
