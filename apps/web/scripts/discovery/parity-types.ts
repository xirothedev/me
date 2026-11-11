import type { ColorScheme } from './types';

export interface ParityOptions {
  referenceDir: string;
  baseUrl: string;
  outDir: string;
  maxDiffRatio: number;
  maxHeightDelta: number;
  paths: string[] | null;
}

export interface ParityResult {
  path: string;
  scheme: ColorScheme;
  width: number;
  reference: string;
  actual: string;
  diff: string;
  changedPixels: number;
  changedRatio: number;
  referenceHeight: number;
  actualHeight: number;
  domDifferences: string[];
  passed: boolean;
}

export interface ParsedShot {
  scheme: ColorScheme;
  width: number;
}
