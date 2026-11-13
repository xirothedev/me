'use client';

import { ICON, Icon } from '@repo/ui';
import { FigureFrame } from './figure-frame';
import { useFigurePlayer } from './use-figure-player';

const STEPS = ['Generate', 'Rank', 'Reward', 'Fine-tune'];
const CAPTIONS = [
  'The model writes several candidate responses',
  'A person ranks the responses from best to worst',
  'The ranking becomes a reward signal',
  'The model fine-tunes toward the preferred answers',
];
const REPLIES = [
  { label: 'Reply A', detail: 'Brief answer' },
  { label: 'Reply B', detail: 'Clear and complete' },
  { label: 'Reply C', detail: 'Unhelpful refusal' },
];

export const figureRegistration = { name: 'rlhf' } as const;
export function RlhfFigure() {
  const player = useFigurePlayer(CAPTIONS.length);

  return (
    <FigureFrame
      viz="rlhf"
      label="RLHF"
      captions={CAPTIONS}
      step={player.step}
      playing={player.playing}
      speed={player.speed}
      onToggle={player.toggle}
      onSpeed={player.setSpeed}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="font-ui flex items-center gap-1.5 text-xs">
          {STEPS.map((label, index) => (
            <div key={label} className="flex items-center gap-1.5">
              {index > 0 ? <span className="text-neutral-300">→</span> : null}
              <span
                className={`rounded-full px-2.5 py-1 transition-colors ${
                  index === player.step
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-neutral-200/60 text-neutral-600'
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        <div
          className={`font-ui flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors ${
            player.step === 3 ? 'border-blue-500 text-blue-600' : 'border-blue-400/70 text-blue-600'
          }`}
        >
          <Icon icon={ICON.bot} size="md" />
          AI model
        </div>

        <span className="text-neutral-300">↓</span>

        <div className="grid w-full max-w-[420px] grid-cols-3 gap-2">
          {REPLIES.map((reply, index) => (
            <div
              key={reply.label}
              className={`font-ui rounded-lg border px-3 py-3 text-center transition-colors ${
                player.step >= 1 && index === 1
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-neutral-200 text-neutral-600'
              }`}
            >
              <div className="text-sm font-medium">{reply.label}</div>
              <div className="text-ink-soft mt-1 text-[11px]">{reply.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </FigureFrame>
  );
}
