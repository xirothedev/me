import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import type { BrowserContext } from 'playwright-core';
import {
  launchBrowser,
  newContext,
  openPage,
  primeLazyContent,
  screenshotPage,
} from './discovery/browser';
import { compareLayout, crop, parseShot } from './discovery/compare';
import { extractLayout } from './discovery/extract-layout';
import { renderParityReport } from './discovery/parity-report';
import type { ParityOptions, ParityResult } from './discovery/parity-types';
import type { ColorScheme, DiscoveryReport, PageRecord } from './discovery/types';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  if (options === null) return;

  const report = JSON.parse(
    await readFile(join(options.referenceDir, 'discovery.json'), 'utf8'),
  ) as DiscoveryReport;
  const browser = await launchBrowser();
  const dark = await newContext(browser, 'dark');
  const light = await newContext(browser, 'light');
  const contextFor = (scheme: ColorScheme) => (scheme === 'light' ? light : dark);
  const results: ParityResult[] = [];

  try {
    await mkdir(join(options.outDir, 'actual'), { recursive: true });
    await mkdir(join(options.outDir, 'diff'), { recursive: true });

    for (const page of report.pages.filter(
      (entry) => !options.paths || options.paths.includes(entry.route.path),
    )) {
      for (const shot of page.screenshots) {
        const parsed = parseShot(shot);
        if (!parsed) continue;
        const result = await compareShot(options, page, shot, parsed, contextFor);
        results.push(result);
        process.stdout.write(
          `${result.passed ? 'PASS' : 'FAIL'} ${result.path} ${result.scheme} ${result.width} — ${(result.changedRatio * 100).toFixed(2)}%\n`,
        );
      }
    }

    await writeFile(join(options.outDir, 'parity.json'), `${JSON.stringify(results, null, 2)}\n`);
    await writeFile(join(options.outDir, 'PARITY.md'), renderParityReport(results, options));
    const failed = results.filter((result) => !result.passed);
    process.stdout.write(`Parity: ${results.length - failed.length}/${results.length} passed\n`);
    if (failed.length > 0) process.exitCode = 1;
  } finally {
    await dark.close();
    await light.close();
    await browser.close();
  }
}

async function compareShot(
  options: ParityOptions,
  page: PageRecord,
  shot: string,
  parsed: { scheme: ColorScheme; width: number },
  contextFor: (scheme: ColorScheme) => BrowserContext,
): Promise<ParityResult> {
  const referencePath = join(options.referenceDir, shot);
  const name = basename(shot, '.png');
  const actualPath = join(options.outDir, 'actual', `${name}.png`);
  const diffPath = join(options.outDir, 'diff', `${name}.png`);

  const session = await openPage(
    contextFor(parsed.scheme),
    new URL(page.route.path, options.baseUrl).href,
    250,
    { width: parsed.width, height: 900 },
  );

  try {
    await primeLazyContent(session.page);
    const layout = await extractLayout(session.page);
    await screenshotPage(session.page, actualPath, true);
    const reference = PNG.sync.read(await readFile(referencePath));
    const actual = PNG.sync.read(await readFile(actualPath));
    const width = Math.min(reference.width, actual.width);
    const height = Math.min(reference.height, actual.height);
    const diff = new PNG({ width, height });
    const changedPixels = pixelmatch(
      crop(reference, width, height).data,
      crop(actual, width, height).data,
      diff.data,
      width,
      height,
      { threshold: 0.1 },
    );
    await writeFile(diffPath, PNG.sync.write(diff));
    const referenceLayout = page.layout.find(
      (item) => item.scheme === parsed.scheme && item.width === parsed.width,
    );
    const domDifferences = referenceLayout
      ? compareLayout(referenceLayout, layout, options.maxHeightDelta)
      : ['Reference layout is missing.'];
    const changedRatio = changedPixels / (width * height);

    return {
      path: page.route.path,
      scheme: parsed.scheme,
      width: parsed.width,
      reference: referencePath,
      actual: actualPath,
      diff: diffPath,
      changedPixels,
      changedRatio,
      referenceHeight: reference.height,
      actualHeight: actual.height,
      domDifferences,
      passed:
        changedRatio <= options.maxDiffRatio &&
        Math.abs(reference.height - actual.height) <= options.maxHeightDelta &&
        domDifferences.length === 0,
    };
  } finally {
    await session.page.close();
  }
}

function parseArgs(argv: string[]): ParityOptions | null {
  const options: ParityOptions = {
    referenceDir: resolve(SCRIPT_DIR, '../../../docs/reference/leerob'),
    baseUrl: 'http://localhost:3000',
    outDir: resolve(SCRIPT_DIR, '../../../docs/reference/leerob/parity'),
    maxDiffRatio: 0.005,
    maxHeightDelta: 8,
    paths: null,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') {
      printHelp();
      return null;
    }
    if (arg === '--reference') {
      options.referenceDir = resolve(required(argv, ++index, arg));
      options.outDir = join(options.referenceDir, 'parity');
    } else if (arg === '--base-url') options.baseUrl = required(argv, ++index, arg);
    else if (arg === '--out') options.outDir = resolve(required(argv, ++index, arg));
    else if (arg === '--max-diff') {
      options.maxDiffRatio = Number(required(argv, ++index, arg));
    } else if (arg === '--max-height') {
      options.maxHeightDelta = Number(required(argv, ++index, arg));
    } else if (arg === '--path') {
      options.paths = required(argv, ++index, arg).split(',');
    } else throw new Error(`Unknown argument: ${arg}`);
  }
  return options;
}

function required(argv: string[], index: number, flag: string): string {
  const value = argv[index];
  if (!value) throw new Error(`${flag} needs a value`);
  return value;
}

function printHelp(): void {
  process.stdout.write(`Compare the clone against the reference screenshots.

Usage: bun run scripts/parity.ts [options]

  --reference <dir>     Reference dossier (default: docs/reference/leerob)
  --base-url <url>      Clone origin (default: http://localhost:3000)
  --out <dir>           Output directory (default: <reference>/parity)
  --max-diff <ratio>    Allowed changed-pixel ratio (default: 0.005)
  --max-height <px>     Allowed full-page height delta (default: 8)
  --path <list>         Comma-separated routes to compare (default: all)
  --path <list>         Comma-separated routes to compare (default: all)
  -h, --help            Show this help
`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? (error.stack ?? error.message) : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
