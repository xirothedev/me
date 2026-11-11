'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { detectPitch, frequencyToReading, type Reading } from './pitch';

const STRINGS = [
  { id: 'e2', label: 'E' },
  { id: 'a2', label: 'A' },
  { id: 'd3', label: 'D' },
  { id: 'g3', label: 'G' },
  { id: 'b3', label: 'B' },
  { id: 'e4', label: 'E' },
];

type Status = 'idle' | 'starting' | 'listening' | 'error';

export function Tuner() {
  const [status, setStatus] = useState<Status>('idle');
  const [reading, setReading] = useState<Reading | null>(null);
  const [message, setMessage] = useState('');
  const audio = useRef<{
    context: AudioContext;
    stream: MediaStream;
    frame: number;
  } | null>(null);

  const stop = useCallback(() => {
    const current = audio.current;
    audio.current = null;
    if (!current) return;
    cancelAnimationFrame(current.frame);
    current.stream.getTracks().forEach((track) => track.stop());
    void current.context.close();
  }, []);

  useEffect(() => stop, [stop]);

  const start = useCallback(async () => {
    setStatus('starting');
    setMessage('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const context = new AudioContext();
      const analyser = context.createAnalyser();
      analyser.fftSize = 4096;
      context.createMediaStreamSource(stream).connect(analyser);
      const buffer = new Float32Array(analyser.fftSize);
      const history: number[] = [];
      audio.current = { context, stream, frame: 0 };

      const tick = () => {
        analyser.getFloatTimeDomainData(buffer);
        const frequency = detectPitch(buffer, context.sampleRate);
        if (frequency) {
          history.push(frequency);
          if (history.length > 5) history.shift();
          const sorted = [...history].sort((left, right) => left - right);
          const stable = sorted[Math.floor(sorted.length / 2)];
          setReading(frequencyToReading(stable));
        }
        const current = audio.current;
        if (current) current.frame = requestAnimationFrame(tick);
      };

      setStatus('listening');
      tick();
    } catch {
      setStatus('error');
      setMessage('Microphone access is needed to use the tuner.');
    }
  }, []);

  const active = status === 'listening';
  const cents = reading ? Math.max(-50, Math.min(50, reading.cents)) : 0;
  const marker = 50 + cents;

  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={active ? stop : start}
        className={`font-code rounded-md border px-3 py-1.5 text-sm transition-colors ${
          active
            ? 'border-neutral-700 bg-neutral-800 text-white'
            : 'text-ink-soft hover:text-ink-strong border-neutral-300 bg-transparent hover:border-neutral-400'
        }`}
      >
        {active ? 'Stop Tuner' : 'Tuner'}
      </button>

      {status === 'starting' ? (
        <p className="font-ui text-meta text-ink-soft mt-2">Starting microphone…</p>
      ) : null}

      {status === 'error' ? (
        <p className="font-ui text-meta text-ink-soft mt-2">{message}</p>
      ) : null}

      {active ? (
        <div className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-5">
          <div className="text-center">
            <div className="text-ink-strong text-4xl font-bold tracking-tight transition-colors">
              {reading?.note ?? '—'}
              {reading ? (
                <span className="text-ink-soft ml-0.5 text-lg font-normal">{reading.octave}</span>
              ) : null}
            </div>
          </div>

          <div className="relative mt-4 h-10 select-none">
            <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-neutral-200" />
            <div className="absolute top-1/2 left-1/2 h-5 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-400" />
            {[0, 10, 20, 30, 40, 60, 70, 80, 90, 100].map((tick) => (
              <div
                key={tick}
                className="absolute top-1/2 h-2.5 w-px -translate-y-1/2 bg-neutral-300"
                style={{ left: `${tick}%` }}
              />
            ))}
            <div
              className="absolute top-1/2 h-8 w-0.5 -translate-y-1/2 rounded-full bg-neutral-900 transition-[left] duration-150"
              style={{ left: `${marker}%` }}
            />
            <span className="font-ui text-ink-soft absolute top-0 left-0 text-[11px]">flat</span>
            <span className="font-ui text-ink-soft absolute top-0 right-0 text-[11px]">sharp</span>
          </div>

          <div className="font-code text-ink-soft mt-1 text-center text-xs">
            {reading
              ? `${reading.cents >= 0 ? '+' : ''}${reading.cents.toFixed(1)} cents · ${reading.frequency.toFixed(1)} Hz`
              : 'Play a note'}
          </div>

          <div className="mt-4 flex justify-center gap-1.5">
            {STRINGS.map((string) => (
              <span
                key={string.id}
                className="font-code text-ink-soft flex size-6 items-center justify-center rounded-full border border-neutral-300 text-[11px]"
              >
                {string.label}
              </span>
            ))}
          </div>
          <p className="sr-only" aria-live="polite">
            {reading
              ? `${reading.note}${reading.octave}, ${reading.cents.toFixed(0)} cents`
              : 'Waiting for a note'}
          </p>
        </div>
      ) : null}
    </div>
  );
}
