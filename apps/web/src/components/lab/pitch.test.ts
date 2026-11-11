import { describe, expect, test } from 'bun:test';
import { detectPitch, frequencyToReading } from './pitch';

const SAMPLE_RATE = 48_000;

function sine(frequency: number, amplitude = 0.3, length = 4096): Float32Array {
  const buffer = new Float32Array(length);
  for (let index = 0; index < length; index += 1) {
    buffer[index] = amplitude * Math.sin((2 * Math.PI * frequency * index) / SAMPLE_RATE);
  }
  return buffer;
}

describe('detectPitch', () => {
  for (const frequency of [82.41, 110, 196, 440, 659.25]) {
    test(`finds ${frequency} Hz`, () => {
      const detected = detectPitch(sine(frequency), SAMPLE_RATE);
      expect(detected).not.toBeNull();
      if (detected === null) return;
      expect(Math.abs(detected - frequency) / frequency).toBeLessThan(0.01);
    });
  }

  test('ignores silence', () => {
    expect(detectPitch(new Float32Array(4096), SAMPLE_RATE)).toBeNull();
  });
});

describe('frequencyToReading', () => {
  test('reads A4', () => {
    const reading = frequencyToReading(440);
    expect(reading.note).toBe('A');
    expect(reading.octave).toBe(4);
    expect(reading.cents).toBeCloseTo(0, 5);
  });

  test('reads G4 at 400 Hz', () => {
    const reading = frequencyToReading(400);
    expect(reading.note).toBe('G');
    expect(reading.octave).toBe(4);
    expect(reading.cents).toBeCloseTo(35, 0);
  });
});
