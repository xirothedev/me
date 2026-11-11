'use client';

import { FigureFrame } from './figure-frame';
import { useFigurePlayer } from './use-figure-player';

const TOKENS = ['San', 'Francisco', 'is', 'a'];
const CAPTIONS = [
  'Context tokens enter the input layer',
  'Weighted connections activate the hidden layers',
  'Scores combine into a next-token prediction',
  'The highest score wins the next token',
];
const OUTPUTS = [
  { token: 'city', width: [0, 55, 72, 86] },
  { token: 'place', width: [0, 32, 48, 62] },
  { token: 'major', width: [0, 18, 30, 42] },
];

export function LlmFigure() {
  const player = useFigurePlayer(CAPTIONS.length);

  return (
    <FigureFrame
      viz="llm"
      label="Next-token prediction"
      captions={CAPTIONS}
      step={player.step}
      playing={player.playing}
      speed={player.speed}
      onToggle={player.toggle}
      onSpeed={player.setSpeed}
    >
      <div className="flex items-center gap-3">
        <div className="flex w-[92px] shrink-0 flex-col gap-2">
          {TOKENS.map((token, index) => (
            <div
              key={token}
              className={`font-ui rounded-md border px-2.5 py-1 text-center text-xs transition-colors ${
                player.step === index
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300'
                  : 'border-blue-500/70 text-blue-600 dark:border-blue-400/60 dark:text-blue-300'
              }`}
            >
              {token}
            </div>
          ))}
        </div>

        <svg viewBox="0 0 220 190" className="h-[180px] min-w-0 flex-1" aria-hidden="true">
          {[35, 75, 115, 155].map((y) =>
            [30, 65, 100, 135, 170].map((hiddenY) => (
              <line
                key={`${y}-${hiddenY}`}
                x1="12"
                y1={y}
                x2="80"
                y2={hiddenY}
                stroke="currentColor"
                strokeWidth="0.7"
                className="text-neutral-300 dark:text-neutral-700"
              />
            )),
          )}
          {[30, 65, 100, 135, 170].map((y) =>
            [30, 65, 100, 135, 170].map((nextY) => (
              <line
                key={`h-${y}-${nextY}`}
                x1="80"
                y1={y}
                x2="150"
                y2={nextY}
                stroke="currentColor"
                strokeWidth="0.7"
                className="text-neutral-300 dark:text-neutral-700"
              />
            )),
          )}
          {[30, 65, 100, 135, 170].map((y) => (
            <line
              key={`o-${y}`}
              x1="150"
              y1={y}
              x2="205"
              y2={95}
              stroke="currentColor"
              strokeWidth="0.7"
              className="text-neutral-300 dark:text-neutral-700"
            />
          ))}
          {[35, 75, 115, 155].map((y) => (
            <circle
              key={`in-${y}`}
              cx="12"
              cy={y}
              r="6"
              className="fill-neutral-300 dark:fill-neutral-600"
            />
          ))}
          {[30, 65, 100, 135, 170].map((y) => (
            <circle
              key={`h1-${y}`}
              cx="80"
              cy={y}
              r="6"
              className={
                player.step >= 1
                  ? 'fill-blue-400 transition-colors'
                  : 'fill-neutral-300 transition-colors dark:fill-neutral-600'
              }
            />
          ))}
          {[30, 65, 100, 135, 170].map((y) => (
            <circle
              key={`h2-${y}`}
              cx="150"
              cy={y}
              r="6"
              className={
                player.step >= 2
                  ? 'fill-blue-400 transition-colors'
                  : 'fill-neutral-300 transition-colors dark:fill-neutral-600'
              }
            />
          ))}
          <circle
            cx="205"
            cy="95"
            r="8"
            className={
              player.step >= 2
                ? 'fill-blue-400 transition-colors'
                : 'fill-neutral-300 transition-colors dark:fill-neutral-600'
            }
          />
        </svg>

        <div className="w-[165px] shrink-0">
          <div className="font-ui mb-3 text-[11px] tracking-[0.08em] text-neutral-500 uppercase dark:text-neutral-400">
            Next token
          </div>
          <div className="space-y-2.5">
            {OUTPUTS.map((output) => (
              <div key={output.token}>
                <div className="font-code text-ink-soft mb-1 text-xs">{output.token}</div>
                <div className="h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                  <div
                    className="h-full rounded-full bg-blue-400 transition-[width] duration-500"
                    style={{ width: `${output.width[player.step]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FigureFrame>
  );
}
