'use client';

import { useState } from 'react';

function estimateTokens(text: string) {
  const matches = text.match(/[\p{L}\p{N}]+|[^\s\p{L}\p{N}]/gu);
  return matches ? matches.length : 0;
}

function formatCost(cost: number) {
  if (cost === 0) return '$0.00';
  if (cost < 0.0001) return '<$0.0001';
  return `$${cost.toFixed(4)}`;
}

export function TokenEstimator() {
  const [text, setText] = useState('');
  const [price, setPrice] = useState(3);
  const tokens = estimateTokens(text);
  const cost = (tokens / 1_000_000) * price;

  return (
    <div className="border-line bg-surface rounded-media border p-4 sm:p-5">
      <label htmlFor="token-text" className="font-ui text-meta text-ink-soft block">
        Text
      </label>
      <textarea
        id="token-text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={7}
        placeholder="Paste a prompt, a document, or a diff."
        className="border-line bg-canvas text-ink placeholder:text-ink-soft/70 focus:border-focus mt-2 w-full resize-y rounded-sm border p-3 font-mono text-[0.85rem] leading-[1.6] outline-none"
      />

      <div className="mt-4 flex flex-wrap items-end gap-4">
        <div>
          <label htmlFor="token-price" className="font-ui text-meta text-ink-soft block">
            Price per 1M input tokens (USD)
          </label>
          <input
            id="token-price"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(event) => setPrice(Math.max(0, Number(event.target.value)))}
            className="border-line bg-canvas text-ink focus:border-focus mt-2 w-28 rounded-sm border px-2 py-1.5 font-mono text-sm outline-none"
          />
        </div>
      </div>

      <dl className="border-line mt-5 grid grid-cols-3 gap-3 border-t pt-4" aria-live="polite">
        <div>
          <dt className="font-ui text-meta text-ink-soft">Characters</dt>
          <dd className="font-code text-ink-strong mt-1 text-lg tabular-nums">{text.length}</dd>
        </div>
        <div>
          <dt className="font-ui text-meta text-ink-soft">Tokens (estimate)</dt>
          <dd className="font-code text-ink-strong mt-1 text-lg tabular-nums">{tokens}</dd>
        </div>
        <div>
          <dt className="font-ui text-meta text-ink-soft">Input cost</dt>
          <dd className="font-code text-ink-strong mt-1 text-lg tabular-nums">
            {formatCost(cost)}
          </dd>
        </div>
      </dl>

      <p className="font-ui text-note text-ink-soft mt-3 leading-[1.4]">
        This is a word-and-punctuation estimate. Real tokenizers split text differently, especially
        code and Vietnamese. Use it for a rough budget, not a bill.
      </p>
    </div>
  );
}
