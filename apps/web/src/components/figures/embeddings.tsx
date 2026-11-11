'use client';

import { FigureFrame } from './figure-frame';
import { useFigurePlayer } from './use-figure-player';

const CAPTIONS = [
  'Each word becomes a vector',
  'Similar words sit close together',
  'The direction between words carries meaning',
  'The model learns these positions from data',
];
const POINTS = [
  { label: 'prince', x: 20, y: 34, tone: 'blue' },
  { label: 'king', x: 26, y: 54, tone: 'blue' },
  { label: 'man', x: 38, y: 70, tone: 'blue' },
  { label: 'queen', x: 66, y: 24, tone: 'pink' },
  { label: 'princess', x: 70, y: 46, tone: 'pink' },
  { label: 'woman', x: 62, y: 62, tone: 'pink' },
];

export function EmbeddingsFigure() {
  const player = useFigurePlayer(CAPTIONS.length);

  return (
    <FigureFrame
      viz="embeddings"
      label="Word embeddings"
      captions={CAPTIONS}
      step={player.step}
      playing={player.playing}
      speed={player.speed}
      onToggle={player.toggle}
      onSpeed={player.setSpeed}
      className="min-h-[391px]"
    >
      <div className="relative h-[260px] w-full overflow-hidden rounded-md bg-[radial-gradient(circle,rgb(0_0_0_/_0.08)_1px,transparent_1px)] bg-[size:18px_18px] dark:bg-[radial-gradient(circle,rgb(255_255_255_/_0.12)_1px,transparent_1px)]">
        {POINTS.map((point) => {
          return (
            <div
              key={point.label}
              className="absolute flex items-center gap-1.5 transition-opacity"
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
            >
              {point.label === 'queen' || point.label === 'princess' || point.label === 'woman' ? (
                <>
                  <span
                    className={`size-2.5 rounded-full ${point.tone === 'pink' ? 'bg-rose-500' : 'bg-blue-500'}`}
                  />
                  <span
                    className={`font-ui text-xs ${point.tone === 'pink' ? 'text-rose-600 dark:text-rose-400' : 'text-blue-600 dark:text-blue-400'}`}
                  >
                    {point.label}
                  </span>
                </>
              ) : (
                <>
                  <span
                    className={`font-ui text-xs ${point.tone === 'pink' ? 'text-rose-600 dark:text-rose-400' : 'text-blue-600 dark:text-blue-400'}`}
                  >
                    {point.label}
                  </span>
                  <span
                    className={`size-2.5 rounded-full ${point.tone === 'pink' ? 'bg-rose-500' : 'bg-blue-500'}`}
                  />
                </>
              )}
            </div>
          );
        })}
        {player.step >= 2 ? (
          <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
            <line
              x1="26%"
              y1="54%"
              x2="66%"
              y2="24%"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="text-rose-400/70"
            />
          </svg>
        ) : null}
      </div>
    </FigureFrame>
  );
}
