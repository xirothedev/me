import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'cheerio';
import { convertArticle, convertFragment, type ConverterOptions } from './importer/html';
import { loadMediaManifest } from './importer/media';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(SCRIPT_DIR, '../../..');
const REFERENCE = join(ROOT, 'docs/reference/leerob');
const HTML = join(REFERENCE, 'html');
const CONTENT = resolve(SCRIPT_DIR, '../content');

interface PageMeta {
  slug: string;
  kind: 'note' | 'blog' | 'page';
  order?: number;
  date?: string;
  updated?: string;
  label?: string;
  title: string;
  description: string;
}

async function main(): Promise<void> {
  const media = await loadMediaManifest(join(SCRIPT_DIR, 'media-manifest.json'));
  const warnings: string[] = [];
  const options: ConverterOptions = {
    media,
    warn: (message) => warnings.push(message),
  };

  const home = load(await readFile(join(HTML, 'home.html'), 'utf8'));
  const notes = home('.notes-list a')
    .toArray()
    .map((link, index) => ({
      href: home(link).attr('href') ?? '',
      title: home(link).text().trim(),
      order: index + 1,
    }));
  const blogs = home('.blog-row')
    .toArray()
    .map((row) => ({
      href: home(row).attr('href') ?? '',
      date: home(row).find('time').attr('datetime') ?? '',
      row,
    }));
  const pages: PageMeta[] = [];
  for (const note of notes) {
    pages.push(
      await readPage(note.href.slice(1), 'note', options, note.order, undefined, note.title),
    );
  }
  for (const blog of blogs) {
    const label = home(blog.row).find('span').first().text().trim();
    pages.push(await readPage(blog.href.slice(1), 'blog', options, undefined, blog.date, label));
  }
  pages.push(await readPage('bronco', 'page', options));

  for (const page of pages) {
    const body = await readHtml(page.slug);
    const mdx = convertArticle(body, options);
    const meta = [
      'export const meta = {',
      `  title: ${quote(page.title)},`,
      `  description: ${quote(page.description)},`,
      `  kind: ${quote(page.kind)},`,
      ...(page.label ? [`  label: ${quote(page.label)},`] : []),
      ...(page.order ? [`  order: ${page.order},`] : []),
      ...(page.date ? [`  date: ${quote(page.date)},`] : []),
      ...(page.updated ? [`  updated: ${quote(page.updated)},`] : []),
      '};',
      '',
      mdx,
      '',
    ].join('\n');
    const directory = page.kind === 'note' ? 'notes' : page.kind === 'blog' ? 'blogs' : 'pages';
    await write(join(CONTENT, directory, `${page.slug}.mdx`), meta);
    process.stdout.write(`Wrote ${directory}/${page.slug}.mdx\n`);
  }

  const defaultBio = home('#bio-content').html() ?? '';
  const longBio = await readFile(join(HTML, 'home-long-bio.html'), 'utf8');
  await write(join(CONTENT, 'home/bio-default.mdx'), `${convertFragment(defaultBio, options)}\n`);
  await write(join(CONTENT, 'home/bio-long.mdx'), `${convertFragment(longBio, options)}\n`);
  process.stdout.write('Wrote home bios\n');

  await importTabs();
  await importBookmarks(options);

  if (warnings.length > 0) {
    const uniqueWarnings = [...new Set(warnings)];
    await write(join(REFERENCE, 'import-warnings.txt'), `${uniqueWarnings.join('\n')}\n`);
    process.stdout.write(`Warnings: ${uniqueWarnings.length} (see import-warnings.txt)\n`);
  }
}

async function readHtml(slug: string): Promise<string> {
  try {
    return await readFile(join(HTML, `${slug}.rendered.html`), 'utf8');
  } catch {
    return readFile(join(HTML, `${slug}.html`), 'utf8');
  }
}

async function readPage(
  slug: string,
  kind: PageMeta['kind'],
  options: ConverterOptions,
  order?: number,
  date?: string,
  label?: string,
): Promise<PageMeta> {
  const file = await readHtml(slug);
  const $ = load(file);
  const title = $('h1.content-title').first().text().replace(/\s+/g, ' ').trim();
  const description =
    $('meta[name="description"]').attr('content') ??
    $('meta[property="og:description"]').attr('content') ??
    '';
  const articleMeta = $('.article-meta-details').text().replace(/\s+/g, ' ').trim();
  const updated = /\(updated (\d{4})\)/.exec(articleMeta)?.[1];
  const time = $('.article-meta time').attr('datetime') ?? date ?? '';
  if (!title) options.warn(`No title for ${slug}`);
  return {
    slug,
    kind,
    order,
    date: kind === 'blog' ? time : undefined,
    updated,
    label,
    title,
    description,
  };
}

async function importTabs(): Promise<void> {
  const indexHtml = await readFile(join(HTML, 'tabs.html'), 'utf8');
  const $ = load(indexHtml);
  const songs = $('a[href^="/tabs/"]')
    .toArray()
    .map((link) => {
      const href = $(link).attr('href') ?? '';
      const title = $(link).text().replace(/\s+/g, ' ').trim();
      const artist = $(link)
        .next('span')
        .text()
        .replace(/^\s*—\s*/, '')
        .replace(/\s+/g, ' ')
        .trim();
      return { slug: href.replace('/tabs/', ''), title, artist };
    })
    .filter((song) => song.slug.length > 0);
  await write(join(CONTENT, 'tabs/index.json'), `${JSON.stringify({ songs }, null, 2)}\n`);

  for (const song of songs) {
    const file = await readFile(join(HTML, 'tabs', `${song.slug}.html`), 'utf8');
    const page = load(file);
    const chart = page('div.overflow-x-auto.whitespace-pre').first();
    const text = chart
      .children('div')
      .toArray()
      .map((line) => page(line).text())
      .join('\n');
    await write(
      join(CONTENT, 'tabs', `${song.slug}.json`),
      `${JSON.stringify({ ...song, text }, null, 2)}\n`,
    );
  }
  process.stdout.write(`Wrote ${songs.length} tab sheets\n`);
}

async function importBookmarks(options: ConverterOptions): Promise<void> {
  const html = await readFile(join(HTML, 'bookmarks.html'), 'utf8');
  const $ = load(html);
  const groups = $('h2')
    .toArray()
    .map((heading) => {
      const title = $(heading).text().trim();
      const links = $(heading)
        .nextUntil('h2')
        .filter('a[href]')
        .toArray()
        .map((link) => {
          const href = $(link).attr('href') ?? '';
          const text = $(link).text().replace(/\s+/g, ' ').trim();
          const favicon = $(link).find('img').first().attr('src') ?? '';
          const local = favicon ? options.media(favicon) : null;
          return { title: text, href, favicon: local?.localPath ?? null };
        })
        .filter((link) => link.href.length > 0);
      return { title, links };
    })
    .filter((group) => group.links.length > 0);
  await write(join(CONTENT, 'bookmarks.json'), `${JSON.stringify({ groups }, null, 2)}\n`);
  process.stdout.write(`Wrote bookmarks with ${groups.length} groups\n`);
}

async function write(path: string, value: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, value);
}

function quote(value: string): string {
  return JSON.stringify(value);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? (error.stack ?? error.message) : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
