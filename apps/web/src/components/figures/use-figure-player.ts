'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';

export type FigureSpeed = 0.5 | 1 | 2;

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(callback: () => void): () => void {
  const query = window.matchMedia(REDUCED_QUERY);
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
}

function getSnapshot(): boolean {
  return window.matchMedia(REDUCED_QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

export function useFigurePlayer(steps: number, intervalMs = 2400) {
  const reduced = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [override, setOverride] = useState<boolean | null>(null);
  const [speed, setSpeed] = useState<FigureSpeed>(1);
  const [step, setStep] = useState(0);
  const playing = override ?? !reduced;

  useEffect(() => {
    if (!playing || steps < 2) return;
    const timer = window.setInterval(
      () => setStep((current) => (current + 1) % steps),
      intervalMs / speed,
    );
    return () => window.clearInterval(timer);
  }, [playing, speed, steps, intervalMs]);

  return {
    step,
    playing,
    speed,
    setSpeed,
    toggle: () => setOverride(!playing),
  };
}
