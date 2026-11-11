import type { ParityOptions, ParityResult } from './parity-types';

export function renderParityReport(results: ParityResult[], options: ParityOptions): string {
  const lines: string[] = [
    '# Parity report',
    '',
    `Base: ${options.baseUrl}`,
    `Reference: ${options.referenceDir}`,
    `Threshold: ${(options.maxDiffRatio * 100).toFixed(2)}% pixels, ${options.maxHeightDelta}px height.`,
    '',
    '| Path | Scheme | Width | Pixel diff | Height | DOM | Result |',
    '| --- | --- | --- | --- | --- | --- | --- |',
  ];
  for (const result of results) {
    lines.push(
      `| \`${result.path}\` | ${result.scheme} | ${result.width} | ${(result.changedRatio * 100).toFixed(2)}% | ${result.referenceHeight} → ${result.actualHeight} | ${result.domDifferences.length === 0 ? 'ok' : escape(result.domDifferences.slice(0, 2).join('; '))} | ${result.passed ? 'PASS' : 'FAIL'} |`,
    );
  }
  const failed = results.filter((result) => !result.passed);
  lines.push('');
  lines.push(`Result: ${results.length - failed.length}/${results.length} passed.`);
  return `${lines.join('\n')}\n`;
}

function escape(value: string): string {
  return value.replace(/\|/g, '\\|');
}
