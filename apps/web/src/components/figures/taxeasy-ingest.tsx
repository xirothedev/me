'use client';

import { FigureFrame } from './figure-frame';
import { useFigurePlayer } from './use-figure-player';

const CAPTIONS = [
  'A folded-corner receipt photo arrives by email for a filing due today.',
  'Worker forwards to webhook. NestJS creates a BullMQ job with a visible state.',
  'OCR reads the image. Zod schema checks the total against line items.',
  'Job moves to retry, then wait for human. The state tells support what broke.',
  'Validated write lands in PostgreSQL + S3 with a trace the agent can see.',
];

const STEPS = ['Intake', 'Route', 'Parse', 'Queue', 'Record'];

function Pill({
  index,
  active,
  done,
  label,
}: {
  index: number;
  active: boolean;
  done: boolean;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {index > 0 ? <span className="text-neutral-300">→</span> : null}
      <span
        className={`font-ui rounded-full px-2.5 py-1 text-xs transition-colors ${
          active
            ? 'bg-blue-100 text-blue-700'
            : done
              ? 'bg-blue-50 text-blue-600'
              : 'bg-neutral-200/60 text-neutral-600'
        }`}
      >
        {label}
      </span>
    </div>
  );
}

export function TaxEasyIngestFigure() {
  const player = useFigurePlayer(CAPTIONS.length);
  const step = player.step;

  return (
    <FigureFrame
      viz="taxeasy-ingest"
      label="Document ingest pipeline · one receipt"
      captions={CAPTIONS}
      step={step}
      playing={player.playing}
      speed={player.speed}
      onToggle={player.toggle}
      onSpeed={player.setSpeed}
      className="min-h-[380px]"
    >
      <div className="flex flex-col gap-4">
        <div className="font-ui flex flex-wrap items-center justify-center gap-1.5 text-xs">
          {STEPS.map((label, index) => (
            <Pill
              key={label}
              index={index}
              label={label}
              active={index === step}
              done={index < step}
            />
          ))}
        </div>

        <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr]">
          <div
            className={`rounded-md border p-4 transition-colors ${
              step <= 1 ? 'border-blue-500 bg-blue-50/50' : 'border-neutral-300 bg-white'
            }`}
          >
            <p className="font-ui text-[11px] tracking-[0.08em] text-neutral-500 uppercase">
              Case · receipt photo
            </p>
            <div className="mt-2 rounded border border-neutral-300 bg-white p-3">
              <p className="font-code text-[12px] text-neutral-800">
                receipt photo · folded corner
              </p>
              <p className="font-ui mt-1 text-[12px] text-neutral-600">
                via email · filing due today
              </p>
              <p className="font-ui mt-2 border-t border-dashed border-neutral-200 pt-2 text-[11px] text-neutral-500">
                also handled: XML invoice · SMS bank notice
              </p>
            </div>
            <p className="font-ui mt-2 text-[11px] text-neutral-500">
              entry: Cloudflare Email Routing
              {step >= 1 ? ' → Worker → webhook → NestJS' : ''}
            </p>
            {step >= 1 ? (
              <div className="font-code mt-2 inline-flex items-center gap-2 rounded-full border border-blue-400 bg-white px-2.5 py-1 text-[11px] text-blue-700">
                <span className="size-1.5 rounded-full bg-blue-500" />
                BullMQ job · queued · visible state
              </div>
            ) : null}
          </div>

          <div className="grid gap-3">
            <div
              className={`rounded-md border p-3 transition-colors ${
                step === 2 ? 'border-blue-500 bg-blue-50' : 'border-neutral-300 bg-white'
              }`}
            >
              <p className="font-ui text-[11px] tracking-[0.08em] text-neutral-500 uppercase">
                Parse · OCR + schema
              </p>
              <div className="font-code mt-2 space-y-1 text-[12px]">
                <div className="flex justify-between gap-2">
                  <span className="text-neutral-600">total</span>
                  <span
                    className={
                      step >= 2 ? 'rounded bg-rose-100 px-1.5 text-rose-700' : 'text-neutral-800'
                    }
                  >
                    mismatch flagged
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-neutral-600">line_items</span>
                  <span className="text-neutral-800">extracted</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-neutral-600">date</span>
                  <span className="text-neutral-800">extracted</span>
                </div>
              </div>
              <p className="font-ui mt-2 text-[11px] text-neutral-500">
                zod-validated structured output
              </p>
            </div>

            <div
              className={`rounded-md border p-3 transition-colors ${
                step === 3 ? 'border-blue-500 bg-blue-50' : 'border-neutral-300 bg-white'
              }`}
            >
              <p className="font-ui text-[11px] tracking-[0.08em] text-neutral-500 uppercase">
                Queue · what support sees
              </p>
              <p className="font-code mt-2 text-[12px] text-neutral-800">
                queued → retry →{' '}
                <span className={step >= 3 ? 'rounded bg-blue-100 px-1 text-blue-700' : ''}>
                  wait for human
                </span>
              </p>
              <p className="font-ui mt-1 text-[11px] text-neutral-500">
                runbook: find by doc → check parser / OCR / schema → replay or route
              </p>
            </div>
          </div>
        </div>

        <div
          className={`rounded-md border p-3 transition-colors ${
            step === 4 ? 'border-blue-500 bg-blue-50' : 'border-neutral-200 bg-neutral-50'
          }`}
        >
          <p className="font-ui text-[11px] tracking-[0.08em] text-neutral-500 uppercase">
            Record · observable result
          </p>
          <p className="font-code mt-1 text-[12px] text-neutral-800">
            PostgreSQL + S3 · job success with trace
          </p>
          <p className="font-ui mt-1 text-[11px] text-neutral-500">
            OpenTelemetry → Tempo / Grafana · logs in Loki · metrics in Prometheus
          </p>
        </div>
      </div>
    </FigureFrame>
  );
}
