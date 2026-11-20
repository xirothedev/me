'use client';

import { useState } from 'react';
import { FigureFrame } from './figure-frame';
import { useFigurePlayer } from './use-figure-player';

const TOKENS = ['The', 'cat', 'sat', 'on', 'the', 'mat', 'because', 'it', 'was', 'tired'];
const AUTO_QUERIES = ['it', 'cat', 'sat', 'mat'];
const TARGETS: Record<string, { target: string; weight: string }> = {
  it: { target: 'cat', weight: '0.46' },
  cat: { target: 'sat', weight: '0.31' },
  sat: { target: 'cat', weight: '0.28' },
  mat: { target: 'on', weight: '0.24' },
  default: { target: 'cat', weight: '0.20' },
};
const CAPTIONS = [
  'Tap or hover any word to make it the query',
  'The model scores every other token',
  'The highest score becomes the attended token',
  'The model links "it" back to "cat"',
];

export function SelfAttentionFigure() {
  const player = useFigurePlayer(CAPTIONS.length);
  const [manual, setManual] = useState<string | null>(null);
  const query = manual ?? AUTO_QUERIES[player.step];
  const relation = TARGETS[query] ?? TARGETS.default;

  return (
    <FigureFrame
      viz="self-attention"
      label="Self-attention"
      captions={CAPTIONS}
      step={player.step}
      playing={player.playing}
      speed={player.speed}
      onToggle={player.toggle}
      onSpeed={player.setSpeed}
    >
      <div className="flex flex-col items-center gap-5">
        <div className="flex max-w-[440px] flex-wrap justify-center gap-1.5">
          {TOKENS.map((token) => {
            const isQuery = token === query;
            const isTarget = token === relation.target;
            return (
              <button
                key={token}
                type="button"
                onClick={() => setManual(token)}
                className={`font-ui rounded-md border px-2 py-1 text-sm transition-colors ${
                  isQuery
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : isTarget
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent bg-neutral-200/70 text-neutral-600 hover:border-neutral-300'
                }`}
              >
                {token}
              </button>
            );
          })}
        </div>
        <div className="font-ui flex items-center gap-2 text-sm">
          <span className="rounded-md bg-neutral-900 px-2 py-1 text-white">{query}</span>
          <span className="text-ink-soft">attends to</span>
          <span className="rounded-md border border-blue-500 px-2 py-1 text-blue-600">
            {relation.target}
          </span>
          <span className="font-code text-blue-600">{relation.weight}</span>
        </div>
      </div>
    </FigureFrame>
  );
}
