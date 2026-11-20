'use client';

import { FigureFrame } from './figure-frame';
import { useFigurePlayer } from './use-figure-player';

const CAPTIONS = [
  'A refund request arrives with order state, reason, timing, and evidence.',
  'The model works at the edge: extract reason, compare evidence, draft a summary.',
  'Policy owns the decision: approve, deny, ask for evidence, or hand to a person.',
  'Evidence references and rules make the outcome auditable and explainable.',
  'The result is recorded; human review handles exceptions and unclear cases.',
];

export function EcopickRefundGateFigure() {
  const player = useFigurePlayer(CAPTIONS.length);

  return (
    <FigureFrame
      viz="ecopick-refund-gate"
      label="Refund gate flow"
      captions={CAPTIONS}
      step={player.step}
      playing={player.playing}
      speed={player.speed}
      onToggle={player.toggle}
      onSpeed={player.setSpeed}
      className="min-h-[360px]"
    >
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <div
          className={`rounded-md border p-3 ${
            player.step === 0 ? 'border-blue-500 bg-blue-50' : 'border-neutral-300 bg-white'
          }`}
        >
          <p className="font-ui text-[11px] tracking-[0.08em] text-neutral-500 uppercase">Input</p>
          <ul className="mt-2 space-y-1 text-[0.82rem] leading-[1.35] text-neutral-700">
            <li>Order and workflow state</li>
            <li>Customer reason</li>
            <li>Evidence and timing</li>
            <li>Requester role</li>
          </ul>
        </div>

        <div className="hidden text-center text-neutral-400 sm:block" aria-hidden="true">
          →
        </div>

        <div className="grid gap-3">
          <div
            className={`rounded-md border p-3 ${
              player.step === 1 ? 'border-blue-500 bg-blue-50' : 'border-neutral-300 bg-white'
            }`}
          >
            <p className="font-ui text-[11px] tracking-[0.08em] text-neutral-500 uppercase">
              Model at edge
            </p>
            <p className="mt-1 text-[0.82rem] leading-[1.35] text-neutral-700">
              Extract fields, flag mismatches, draft structured recommendation
            </p>
          </div>
          <div
            className={`rounded-md border p-3 ${
              player.step >= 2 ? 'border-blue-500 bg-blue-50' : 'border-neutral-300 bg-white'
            }`}
          >
            <p className="font-ui text-[11px] tracking-[0.08em] text-neutral-500 uppercase">
              Policy decides
            </p>
            <div className="font-code mt-2 grid grid-cols-2 gap-1.5 text-[11px] text-neutral-700">
              <span
                className={`rounded border px-2 py-1 ${player.step === 2 ? 'border-blue-400 bg-white' : 'border-neutral-200'}`}
              >
                Approve
              </span>
              <span
                className={`rounded border px-2 py-1 ${player.step === 2 ? 'border-blue-400 bg-white' : 'border-neutral-200'}`}
              >
                Deny
              </span>
              <span
                className={`rounded border px-2 py-1 ${player.step === 2 ? 'border-blue-400 bg-white' : 'border-neutral-200'}`}
              >
                Ask evidence
              </span>
              <span
                className={`rounded border px-2 py-1 ${player.step === 2 ? 'border-blue-400 bg-white' : 'border-neutral-200'}`}
              >
                Human review
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`mt-3 rounded-md border p-3 ${
          player.step >= 3 ? 'border-blue-500 bg-blue-50' : 'border-neutral-300 bg-white'
        }`}
      >
        <p className="font-ui text-[11px] tracking-[0.08em] text-neutral-500 uppercase">
          Auditable outcome
        </p>
        <p className="mt-1 text-[0.82rem] leading-[1.35] text-neutral-700">
          Decision cites policy rule and evidence references
          {player.step >= 4
            ? '; human path and recorded outcome support review and improvement.'
            : '.'}
        </p>
      </div>
    </FigureFrame>
  );
}
