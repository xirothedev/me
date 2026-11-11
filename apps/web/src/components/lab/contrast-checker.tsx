'use client';

import { useState } from 'react';

const DEFAULT_TEXT = '#15343d';
const DEFAULT_BACKGROUND = '#f7f2e6';

function channel(value: number) {
  const normalized = value / 255;
  return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string) {
  const value = hex.replace('#', '');
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);
  return 0.2126 * channel(red) + 0.7152 * channel(green) + 0.0722 * channel(blue);
}

function contrastRatio(first: string, second: string) {
  const light = Math.max(luminance(first), luminance(second));
  const dark = Math.min(luminance(first), luminance(second));
  return (light + 0.05) / (dark + 0.05);
}

function Result({ label, threshold, ratio }: { label: string; threshold: number; ratio: number }) {
  const pass = ratio >= threshold;
  return (
    <div className="border-line flex items-center justify-between gap-3 border-b py-2 last:border-b-0">
      <span className="font-ui text-meta text-ink-soft">{label}</span>
      <span
        className={`font-ui text-meta rounded-sm border px-2 py-0.5 ${
          pass ? 'border-line text-ink-strong' : 'border-code-inline text-code-inline'
        }`}
      >
        {pass ? 'Pass' : 'Fail'} · {threshold}:1
      </span>
    </div>
  );
}

export function ContrastChecker() {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [background, setBackground] = useState(DEFAULT_BACKGROUND);
  const ratio = contrastRatio(text, background);

  return (
    <div className="border-line bg-surface rounded-media border p-4 sm:p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contrast-text" className="font-ui text-meta text-ink-soft block">
            Text
          </label>
          <div className="mt-2 flex items-center gap-2">
            <input
              id="contrast-text"
              type="color"
              value={text}
              onChange={(event) => setText(event.target.value)}
              className="border-line bg-canvas size-9 cursor-pointer rounded-sm border p-1"
            />
            <span className="font-code text-ink-soft text-sm">{text}</span>
          </div>
        </div>
        <div>
          <label htmlFor="contrast-background" className="font-ui text-meta text-ink-soft block">
            Background
          </label>
          <div className="mt-2 flex items-center gap-2">
            <input
              id="contrast-background"
              type="color"
              value={background}
              onChange={(event) => setBackground(event.target.value)}
              className="border-line bg-canvas size-9 cursor-pointer rounded-sm border p-1"
            />
            <span className="font-code text-ink-soft text-sm">{background}</span>
          </div>
        </div>
      </div>

      <div
        className="border-line mt-4 rounded-sm border p-4"
        style={{ backgroundColor: background, color: text }}
      >
        <p className="font-reading text-[1.2rem] leading-[1.4]">
          The quick brown fox jumps over the lazy dog.
        </p>
        <p className="font-reading mt-2 text-[0.95rem] leading-[1.5]">
          Small text has to clear a higher bar than a heading.
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-code text-ink-strong text-2xl tabular-nums" aria-live="polite">
          {ratio.toFixed(2)}:1
        </p>
        <button
          type="button"
          onClick={() => {
            setText(background);
            setBackground(text);
          }}
          className="font-ui text-meta text-ink-soft hover:text-ink-strong border-line rounded-sm border px-2 py-1 transition-colors"
        >
          Swap colors
        </button>
      </div>

      <div className="mt-3">
        <Result label="AA, normal text" threshold={4.5} ratio={ratio} />
        <Result label="AAA, normal text" threshold={7} ratio={ratio} />
        <Result label="AA, large text" threshold={3} ratio={ratio} />
        <Result label="AAA, large text" threshold={4.5} ratio={ratio} />
      </div>
    </div>
  );
}
