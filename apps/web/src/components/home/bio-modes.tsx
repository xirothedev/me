'use client';

import { useState, type ReactNode } from 'react';

interface BioModesProps {
  defaultBio: ReactNode;
  longBio: ReactNode;
}

export function BioModes({ defaultBio, longBio }: BioModesProps) {
  const [mode, setMode] = useState<'default' | 'long'>('default');
  return (
    <section aria-label="Biography" className="mb-[3.25rem]">
      <div className="border-line font-ui text-ink-soft mb-[1.35rem] flex items-baseline justify-between border-b pb-[0.55rem] text-sm leading-[1.4] tracking-[0.01em]">
        <span>Bio</span>
        <div className="flex gap-4" aria-label="Bio length">
          <button
            type="button"
            aria-controls="bio-content"
            aria-pressed={mode === 'default'}
            onClick={() => setMode('default')}
            className="hover:text-ink aria-pressed:text-ink relative cursor-pointer py-[0.2rem] transition-colors aria-pressed:after:absolute aria-pressed:after:inset-x-0 aria-pressed:after:-bottom-[0.62rem] aria-pressed:after:h-px aria-pressed:after:bg-current"
          >
            Default
          </button>
          <button
            type="button"
            aria-controls="bio-content"
            aria-pressed={mode === 'long'}
            onClick={() => setMode('long')}
            className="hover:text-ink aria-pressed:text-ink relative cursor-pointer py-[0.2rem] transition-colors aria-pressed:after:absolute aria-pressed:after:inset-x-0 aria-pressed:after:-bottom-[0.62rem] aria-pressed:after:h-px aria-pressed:after:bg-current"
          >
            Long
          </button>
        </div>
      </div>
      <div id="bio-content">{mode === 'default' ? defaultBio : longBio}</div>
    </section>
  );
}
