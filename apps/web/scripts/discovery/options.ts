import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { DiscoveryOptions } from './types';
import { isColorScheme } from './utils';

const DEFAULT_WIDTHS = [390, 768, 1440];
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));

export function parseArgs(argv: string[]): DiscoveryOptions | null {
  const options: DiscoveryOptions = {
    baseUrl: 'https://leerob.com',
    outDir: resolve(SCRIPT_DIR, '../../../../docs/reference/leerob'),
    widths: DEFAULT_WIDTHS,
    schemes: ['dark'],
    lightHome: true,
    maxPages: 80,
    settleMs: 250,
    fullPage: true,
    skipScreenshots: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') {
      printHelp();
      return null;
    }
    if (arg === '--base-url') options.baseUrl = required(argv, ++index, arg);
    else if (arg === '--out') options.outDir = resolve(required(argv, ++index, arg));
    else if (arg === '--widths') {
      options.widths = required(argv, ++index, arg)
        .split(',')
        .map((value) => Number(value.trim()))
        .filter((value) => Number.isFinite(value) && value > 0);
    } else if (arg === '--schemes') {
      const schemes = required(argv, ++index, arg)
        .split(',')
        .map((value) => value.trim());
      if (!schemes.every(isColorScheme)) {
        throw new Error('--schemes accepts only dark and light');
      }
      options.schemes = schemes;
    } else if (arg === '--max-pages') {
      options.maxPages = positiveNumber(required(argv, ++index, arg), arg);
    } else if (arg === '--settle-ms') {
      options.settleMs = nonNegativeNumber(required(argv, ++index, arg), arg);
    } else if (arg === '--no-light-home') options.lightHome = false;
    else if (arg === '--viewport-only') options.fullPage = false;
    else if (arg === '--skip-screenshots') options.skipScreenshots = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }

  if (options.widths.length === 0) throw new Error('--widths needs at least one width');
  return options;
}

export function printHelp(): void {
  process.stdout.write(`Discover a site and write a feature report.

Usage: bun run scripts/discover-site.ts [options]

Options:
  --base-url <url>       Site to crawl (default: https://leerob.com)
  --out <dir>            Output directory (default: docs/reference/leerob)
  --widths <list>        Comma-separated viewport widths (default: 390,768,1440)
  --schemes <list>       dark or light, comma-separated (default: dark)
  --no-light-home        Do not capture Home in light mode
  --max-pages <n>        Crawl limit (default: 80)
  --settle-ms <n>        Wait after load (default: 250)
  --viewport-only        Screenshot the viewport instead of the full page
  --skip-screenshots     Do not write screenshots
  -h, --help             Show this help
`);
}

function required(argv: string[], index: number, flag: string): string {
  const value = argv[index];
  if (!value) throw new Error(`${flag} needs a value`);
  return value;
}

function positiveNumber(value: string, flag: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${flag} needs a positive number`);
  }
  return parsed;
}

function nonNegativeNumber(value: string, flag: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`${flag} needs a non-negative number`);
  }
  return parsed;
}
