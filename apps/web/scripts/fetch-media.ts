import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { DiscoveryReport } from './discovery/types';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const DEFAULT_REFERENCE = resolve(SCRIPT_DIR, '../../../docs/reference/leerob');
const DEFAULT_OUT = resolve(SCRIPT_DIR, '../public');

interface MediaEntry {
  src: string;
  originPath: string;
  localPath: string;
  page: string;
  width: number;
  height: number;
  bytes: number;
  source: 'next-image' | 'remote' | 'avatar';
  format: string;
}

interface MediaManifest {
  generatedAt: string;
  entries: MediaEntry[];
  failures: { src: string; page: string; reason: string }[];
}

interface Options {
  referenceDir: string;
  publicDir: string;
  maxWidth: number;
  force: boolean;
  check: boolean;
}

interface Task {
  src: string;
  page: string;
  renderedWidth: number;
  renderedHeight: number;
  isAvatar: boolean;
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  if (options === null) return;

  const manifestPath = join(SCRIPT_DIR, 'media-manifest.json');
  if (options.check) {
    await checkManifest(manifestPath, options.publicDir);
    return;
  }

  const report = JSON.parse(
    await readFile(join(options.referenceDir, 'discovery.json'), 'utf8'),
  ) as DiscoveryReport;
  const tasks = collectTasks(report);
  process.stdout.write(`Media: ${tasks.length} unique sources\n`);
  const manifest: MediaManifest = {
    generatedAt: new Date().toISOString(),
    entries: [],
    failures: [],
  };

  for (const [index, task] of tasks.entries()) {
    process.stdout.write(`[${index + 1}/${tasks.length}] ${task.page} ${task.src.slice(-70)}\n`);
    try {
      manifest.entries.push(await download(task, options));
    } catch (error) {
      manifest.failures.push({
        src: task.src,
        page: task.page,
        reason: error instanceof Error ? error.message : String(error),
      });
    }
  }

  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  process.stdout.write(`Wrote ${manifestPath}\n`);
  if (manifest.failures.length > 0) process.exitCode = 1;
}

function collectTasks(report: DiscoveryReport): Task[] {
  const seen = new Map<string, Task>();
  for (const page of report.pages) {
    for (const media of page.media) {
      if (media.kind !== 'image') continue;
      if (!media.src || media.src.startsWith('data:')) continue;
      if (seen.has(media.src)) continue;
      seen.set(media.src, {
        src: media.src,
        page: page.route.path,
        renderedWidth: media.width,
        renderedHeight: media.height,
        isAvatar: media.src.includes('/avatar.'),
      });
    }
  }
  return [...seen.values()];
}

async function download(task: Task, options: Options): Promise<MediaEntry> {
  const sourceUrl = originalUrl(task.src);
  const originPath = originPathOf(sourceUrl);
  const isRemote = !sourceUrl.includes('leerob.com');
  const targetWidth = task.isAvatar
    ? 96
    : isRemote
      ? 64
      : Math.min(options.maxWidth, Math.max(480, Math.round(task.renderedWidth * 3)));
  const response = await fetch(sourceUrl, {
    headers: {
      accept: 'image/avif,image/webp,image/png,image/jpeg,image/svg+xml,image/*;q=0.8',
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${sourceUrl}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length === 0) throw new Error(`Empty response for ${sourceUrl}`);

  const extension = extname(new URL(sourceUrl).pathname).toLowerCase();
  const format = extension.replace('.', '') || 'bin';
  const name = fileName(task, sourceUrl);
  const raw = format === 'svg' || format === 'ico' || format === 'gif';
  const relative = task.isAvatar
    ? 'avatar.webp'
    : join('media', `${name}.${raw ? format : 'webp'}`);
  const destination = join(options.publicDir, relative);
  const source: MediaEntry['source'] = task.isAvatar
    ? 'avatar'
    : sourceUrl.includes('/_next/static/')
      ? 'next-image'
      : 'remote';

  if (!options.force && existsSync(destination)) {
    return {
      src: task.src,
      originPath,
      localPath: `/${relative}`,
      page: task.page,
      width: targetWidth,
      height: 0,
      bytes: Bun.file(destination).size ?? 0,
      source,
      format,
    };
  }

  await mkdir(dirname(destination), { recursive: true });

  if (raw) {
    await writeFile(destination, bytes);
    return {
      src: task.src,
      originPath,
      localPath: `/${relative}`,
      page: task.page,
      width: 0,
      height: 0,
      bytes: bytes.length,
      source,
      format,
    };
  }

  const image = new Bun.Image(bytes, { maxPixels: 200_000_000 });
  const metadata = await image.metadata();
  const output = image
    .resize(targetWidth, targetWidth, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 82 });
  await output.write(destination);
  const written = (await Bun.file(destination).stat()).size;

  return {
    src: task.src,
    originPath,
    localPath: `/${relative}`,
    page: task.page,
    width: metadata.width,
    height: metadata.height,
    bytes: written,
    source,
    format,
  };
}

function originalUrl(src: string): string {
  if (src.includes('/_next/image?')) {
    const url = new URL(src);
    const inner = url.searchParams.get('url');
    if (inner) return new URL(inner, 'https://leerob.com').href;
  }
  if (src.startsWith('http')) return src;
  return new URL(src, 'https://leerob.com').href;
}

function originPathOf(sourceUrl: string): string {
  const url = new URL(sourceUrl);
  return `${url.pathname}${url.search}`;
}

function fileName(task: Task, sourceUrl: string): string {
  const url = new URL(sourceUrl);
  const base = url.pathname.split('/').pop() ?? 'image';
  const stem = base
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
    .toLowerCase();
  const host = task.isAvatar ? '' : `${url.hostname.replace(/[^a-zA-Z0-9]+/g, '-')}-`;
  const hash = createHash('sha1').update(task.src).digest('hex').slice(0, 8);
  return `${host}${stem || 'image'}-${hash}`;
}

async function checkManifest(manifestPath: string, publicDir: string): Promise<void> {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8')) as MediaManifest;
  const missing = manifest.entries.filter((entry) => {
    const file = join(publicDir, entry.localPath.replace(/^\//, ''));
    return !existsSync(file) || (Bun.file(file).size ?? 0) === 0;
  });
  if (missing.length > 0) {
    for (const entry of missing) process.stderr.write(`Missing: ${entry.localPath}\n`);
    process.exitCode = 1;
    return;
  }
  process.stdout.write(`Media manifest: ${manifest.entries.length} files present\n`);
}

function parseArgs(argv: string[]): Options | null {
  const options: Options = {
    referenceDir: DEFAULT_REFERENCE,
    publicDir: DEFAULT_OUT,
    maxWidth: 1600,
    force: false,
    check: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') {
      process.stdout.write(`Download and optimize reference media.

Usage: bun run scripts/fetch-media.ts [options]

  --reference <dir>   Reference dossier (default: docs/reference/leerob)
  --public <dir>      App public directory (default: apps/web/public)
  --max-width <px>    Maximum image width (default: 1600)
  --force             Download again even when the file exists
  --check             Verify the manifest without downloading
  -h, --help          Show this help
`);
      return null;
    }
    if (arg === '--reference') options.referenceDir = resolve(required(argv, ++index, arg));
    else if (arg === '--public') options.publicDir = resolve(required(argv, ++index, arg));
    else if (arg === '--max-width') options.maxWidth = Number(required(argv, ++index, arg));
    else if (arg === '--force') options.force = true;
    else if (arg === '--check') options.check = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return options;
}

function required(argv: string[], index: number, flag: string): string {
  const value = argv[index];
  if (!value) throw new Error(`${flag} needs a value`);
  return value;
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? (error.stack ?? error.message) : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
