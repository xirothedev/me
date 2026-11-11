const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export interface Reading {
  note: string;
  octave: number;
  cents: number;
  frequency: number;
}

export function frequencyToReading(frequency: number): Reading {
  const midi = 69 + 12 * Math.log2(frequency / 440);
  const rounded = Math.round(midi);
  const cents = (midi - rounded) * 100;
  const note = NOTES[((rounded % 12) + 12) % 12];
  const octave = Math.floor(rounded / 12) - 1;
  return { note, octave, cents, frequency };
}

export function detectPitch(buffer: Float32Array, sampleRate: number): number | null {
  let mean = 0;
  for (const sample of buffer) mean += sample;
  mean /= buffer.length;

  let energy = 0;
  for (const sample of buffer) {
    const value = sample - mean;
    energy += value * value;
  }
  if (Math.sqrt(energy / buffer.length) < 0.01) return null;

  const minLag = Math.floor(sampleRate / 800);
  const maxLag = Math.floor(sampleRate / 70);
  const scores = new Float64Array(maxLag + 2);
  let maxScore = 0;

  for (let lag = minLag; lag <= maxLag; lag += 1) {
    let correlation = 0;
    let left = 0;
    let right = 0;
    for (let index = 0; index < buffer.length - lag; index += 1) {
      const a = buffer[index] - mean;
      const b = buffer[index + lag] - mean;
      correlation += a * b;
      left += a * a;
      right += b * b;
    }
    const score = correlation / Math.sqrt(left * right || 1);
    scores[lag] = score;
    if (score > maxScore) maxScore = score;
  }

  if (maxScore < 0.9) return null;

  let bestLag = -1;
  for (let lag = minLag + 1; lag < maxLag; lag += 1) {
    const score = scores[lag];
    if (score >= maxScore * 0.9 && score >= scores[lag - 1] && score >= scores[lag + 1]) {
      bestLag = lag;
      break;
    }
  }

  if (bestLag < 0) return null;

  const before = scores[bestLag - 1];
  const after = scores[bestLag + 1];
  const bestScore = scores[bestLag];
  const denominator = 2 * (2 * bestScore - before - after);
  const offset = denominator === 0 ? 0 : (after - before) / denominator;
  return sampleRate / (bestLag + Math.max(-0.5, Math.min(0.5, offset)));
}
