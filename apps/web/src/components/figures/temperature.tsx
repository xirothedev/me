'use client';

import { useState } from 'react';
import { ICON, Icon } from '@repo/ui';
import { FigureFrame } from './figure-frame';
import { useFigurePlayer } from './use-figure-player';

type Preset = 'Focused' | 'Balanced' | 'Creative';

const PRESETS: Record<
  Preset,
  { temperature: number; caption: string; color: string; values: number[] }
> = {
  Focused: {
    temperature: 0.2,
    caption: 'Focused: the model almost always picks the likely token',
    color: 'text-blue-700 ',
    values: [82, 12, 4, 2, 0, 0],
  },
  Balanced: {
    temperature: 0.8,
    caption: 'Balanced: a mix of likely and diverse tokens',
    color: 'text-emerald-700 ',
    values: [52, 25, 13, 6, 3, 2],
  },
  Creative: {
    temperature: 1.4,
    caption: 'Creative: less likely tokens get a real chance',
    color: 'text-orange-700 ',
    values: [24, 20, 18, 15, 13, 10],
  },
};

const TOKENS = ['mat', 'floor', 'couch', 'table', 'bed', 'chair'];
const CAPTIONS = [
  'Temperature controls the shape of the distribution',
  'Lower values concentrate probability on likely tokens',
  'Higher values flatten the distribution',
  'The sample button draws one token from the distribution',
];

export const figureRegistration = { name: 'temperature' } as const;
export function TemperatureFigure() {
  const player = useFigurePlayer(4);
  const [temperature, setTemperature] = useState(0.8);
  const preset: Preset =
    temperature < 0.5 ? 'Focused' : temperature < 1.1 ? 'Balanced' : 'Creative';
  const current = PRESETS[preset];

  return (
    <FigureFrame
      viz="temperature"
      label="Temperature"
      captions={CAPTIONS}
      step={player.step}
      playing={player.playing}
      speed={player.speed}
      onToggle={player.toggle}
      onSpeed={player.setSpeed}
      captionOverride={current.caption}
      captionClassName={current.color}
      className="min-h-[391px]"
    >
      <div className="flex flex-col gap-3">
        <div className="font-code text-ink-strong flex items-center justify-center gap-2 text-sm">
          <span>The cat sat on the</span>
          <span className="inline-block h-6 w-10 rounded-sm bg-neutral-200" />
          <span>mat</span>
        </div>

        <div className="mx-auto w-full max-w-[420px] space-y-1.5">
          {TOKENS.map((token, index) => (
            <div key={token} className="flex items-center gap-2">
              <span className="font-code text-ink-soft w-12 text-right text-xs">{token}</span>
              <div className="h-5 flex-1 overflow-hidden rounded-full bg-neutral-200">
                <div
                  className="flex h-full items-center justify-end rounded-full bg-blue-400 pr-1 transition-[width] duration-500"
                  style={{ width: `${Math.max(current.values[index], 2)}%` }}
                >
                  {current.values[index] >= 30 ? (
                    <span className="font-code text-[10px] text-blue-950">
                      {current.values[index]}%
                    </span>
                  ) : null}
                </div>
              </div>
              <span className="font-code text-ink-soft w-8 text-[11px]">
                {current.values[index]}%
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setTemperature(PRESETS.Balanced.temperature)}
            className="font-ui text-ink-soft hover:text-ink flex items-center gap-1.5 rounded-full border border-neutral-300 px-2.5 py-1 text-xs transition-colors hover:border-neutral-400"
          >
            <Icon icon={ICON.dice} size="xs" />
            Sample
          </button>
        </div>

        <div>
          <div className="font-ui text-ink-soft flex items-center justify-between text-xs">
            <span>Temperature</span>
            <span className="font-code text-ink-strong">{temperature.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={temperature}
            onChange={(event) => setTemperature(Number(event.target.value))}
            aria-label="Temperature"
            className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-blue-500 via-neutral-300 to-orange-500 accent-blue-500 [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:shadow"
          />
          <div className="mt-3 flex justify-center gap-2">
            {(Object.keys(PRESETS) as Preset[]).map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setTemperature(PRESETS[name].temperature)}
                aria-pressed={preset === name}
                className={`font-ui rounded-full border px-2.5 py-1 text-xs transition-colors ${
                  preset === name
                    ? 'border-blue-500 bg-blue-500/10 text-blue-700 '
                    : 'border-neutral-300 text-neutral-500 hover:border-neutral-400 hover:text-neutral-800'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </FigureFrame>
  );
}
