'use client';

import { FigureFrame } from './figure-frame';
import { useFigurePlayer } from './use-figure-player';

const STEPS = ['Forward', 'Loss', 'Backward', 'Update'];
const CAPTIONS = [
  'Input flows through the network to make a prediction',
  'The loss measures how wrong the prediction is',
  'Gradients flow backward through the network',
  'Weights update to reduce the loss',
];
const LOSSES = ['0.82', '0.61', '0.48', '0.37'];
const DOTS = [
  { x: 20, y: 20 },
  { x: 60, y: 40 },
  { x: 100, y: 62 },
  { x: 140, y: 78 },
];

export function TrainingLoopFigure() {
  const player = useFigurePlayer(CAPTIONS.length);
  const dot = DOTS[player.step];

  return (
    <FigureFrame
      viz="training-loop"
      label="Training loop"
      captions={CAPTIONS}
      step={player.step}
      playing={player.playing}
      speed={player.speed}
      onToggle={player.toggle}
      onSpeed={player.setSpeed}
      className="min-h-[334px]"
    >
      <div className="flex flex-col gap-4">
        <div className="font-ui flex items-center justify-center gap-1.5 text-xs">
          {STEPS.map((label, index) => (
            <div key={label} className="flex items-center gap-1.5">
              {index > 0 ? <span className="text-neutral-300 dark:text-neutral-600">→</span> : null}
              <span
                className={`rounded-full px-2.5 py-1 transition-colors ${
                  index === player.step
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200'
                    : 'bg-neutral-200/60 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300'
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-6">
          <svg viewBox="0 0 240 150" className="h-[150px] flex-1" aria-hidden="true">
            {[30, 75, 120].map((y) =>
              [45, 105].map((hiddenY) => (
                <line
                  key={`${y}-${hiddenY}`}
                  x1="24"
                  y1={y}
                  x2="110"
                  y2={hiddenY}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-blue-400"
                />
              )),
            )}
            {[45, 105].map((y) => (
              <line
                key={y}
                x1="110"
                y1={y}
                x2="210"
                y2="75"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-blue-400"
              />
            ))}
            {[30, 75, 120].map((y) => (
              <circle key={y} cx="24" cy={y} r="10" className="fill-blue-500" />
            ))}
            {[45, 105].map((y) => (
              <circle key={y} cx="110" cy={y} r="10" className="fill-blue-400" />
            ))}
            <circle cx="210" cy="75" r="12" className="fill-blue-500" />
            <path d="M220 75 L236 75 M236 68 L246 75 L236 82 Z" className="fill-blue-500" />
          </svg>

          <div className="w-[150px] shrink-0">
            <div className="font-ui text-[11px] tracking-[0.08em] text-neutral-500 uppercase dark:text-neutral-400">
              Loss
            </div>
            <div className="font-code mt-1 text-3xl font-semibold text-rose-500 tabular-nums">
              {LOSSES[player.step]}
            </div>
            <div className="relative mt-4 h-[70px] w-full">
              <svg viewBox="0 0 150 70" className="h-full w-full" aria-hidden="true">
                <path
                  d="M4 8 C 40 18, 90 52, 146 60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="3 4"
                  className="text-neutral-300 dark:text-neutral-600"
                />
                <circle cx={dot.x} cy={dot.y} r="5" className="fill-rose-500 transition-all" />
              </svg>
            </div>
            <div className="font-ui text-ink-soft text-right text-[11px]">
              epoch {player.step + 1}/5
            </div>
          </div>
        </div>
      </div>
    </FigureFrame>
  );
}
