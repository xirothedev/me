'use client';

import { FigureFrame } from './figure-frame';
import { useFigurePlayer } from './use-figure-player';

const CAPTIONS = [
  'Start with raw text',
  'Split the text into smaller pieces',
  'Map every token to a number',
  'The model reads a sequence of numbers',
];
const PIECES = [
  { text: 'San', id: '1234' },
  { text: 'Franc', id: '5678' },
  { text: 'isco', id: '9012' },
];

export const figureRegistration = { name: 'tokenization' } as const;
export function TokenizationFigure() {
  const player = useFigurePlayer(CAPTIONS.length);
  const split = player.step >= 1;

  return (
    <FigureFrame
      viz="tokenization"
      label="Tokenization"
      captions={CAPTIONS}
      step={player.step}
      playing={player.playing}
      speed={player.speed}
      onToggle={player.toggle}
      onSpeed={player.setSpeed}
      className="min-h-[272px]"
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="font-code text-ink-strong flex items-end gap-1 text-[26px] tracking-tight">
          {split ? (
            PIECES.map((piece, index) => (
              <span
                key={piece.text}
                className={`rounded-md px-2 py-0.5 transition-colors ${
                  index === player.step - 1 ? 'bg-blue-100 text-blue-700' : 'bg-neutral-200/70 '
                }`}
              >
                {piece.text}
              </span>
            ))
          ) : (
            <span className="transition-opacity">San Francisco</span>
          )}
        </div>
        {player.step >= 2 ? (
          <div className="font-code text-ink-soft flex gap-2 text-xs">
            {PIECES.map((piece) => (
              <span key={piece.id} className="w-[58px] text-center">
                {piece.id}
              </span>
            ))}
          </div>
        ) : null}
        {player.step >= 3 ? (
          <div className="font-ui text-ink-soft text-xs">→ model input</div>
        ) : null}
      </div>
    </FigureFrame>
  );
}
