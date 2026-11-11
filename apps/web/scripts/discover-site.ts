import { join } from 'node:path';
import { launchBrowser, newContext, openPage, probeUrl, readText } from './discovery/browser';
import { buildReport } from './discovery/build-report';
import { capturePage, crawl } from './discovery/crawl';
import { extractTokens } from './discovery/extract-tokens';
import { parseArgs } from './discovery/options';
import { writeReport } from './discovery/report';
import type { ColorScheme, FontRecord, RedirectRecord } from './discovery/types';
import { parseSitemap, progress, unique } from './discovery/utils';

const ALIASES = ['/about', '/blog', '/uses', '/writing', '/newsletter'];
const META_PATHS = [
  '/robots.txt',
  '/sitemap.xml',
  '/rss.xml',
  '/feed.xml',
  '/atom.xml',
  '/feed',
  '/rss',
];

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  if (options === null) return;

  const origin = new URL(options.baseUrl).origin;
  const browser = await launchBrowser();
  const dark = await newContext(browser, 'dark');
  const light = await newContext(browser, 'light');
  const contextFor = (scheme: ColorScheme) => (scheme === 'light' ? light : dark);

  try {
    progress(`Fetching ${origin}/sitemap.xml`);
    const sitemap = await readText(dark, new URL('/sitemap.xml', origin).href);
    const sitemapPaths = parseSitemap(sitemap.body, origin);
    progress(`Sitemap: ${sitemapPaths.length} paths`);

    const statuses = new Map<string, { status: number; location: string | null }>();
    for (const path of unique(['/', ...sitemapPaths])) {
      const result = await probeUrl(dark, new URL(path, origin).href);
      statuses.set(path, { status: result.status, location: result.location });
    }

    const redirects: RedirectRecord[] = [];
    for (const [path, result] of statuses) {
      if (result.status >= 300 && result.status < 400) {
        redirects.push({
          from: path,
          status: result.status,
          to: result.location ?? '',
        });
      }
    }
    for (const alias of ALIASES) {
      if (statuses.has(alias)) continue;
      const result = await probeUrl(dark, new URL(alias, origin).href);
      if (result.status >= 300 && result.status < 400) {
        redirects.push({
          from: alias,
          status: result.status,
          to: result.location ?? '',
        });
      }
    }

    const live = await crawl(options, origin, sitemapPaths, statuses, dark);
    progress(`Live pages: ${live.length}`);
    for (const path of live) {
      if (!statuses.has(path)) statuses.set(path, { status: 200, location: null });
    }

    const pages = [];
    for (const [index, path] of live.entries()) {
      progress(`[${index + 1}/${live.length}] Capturing ${path}`);
      pages.push(await capturePage(options, origin, path, dark, light));
    }

    const allTokenSchemes: ColorScheme[] = [...options.schemes];
    if (options.lightHome) allTokenSchemes.push('light');
    const tokenSchemes = unique(allTokenSchemes);
    const tokens = [];
    const fonts = new Map<string, FontRecord>();
    const keyframes = new Set<string>();
    for (const scheme of tokenSchemes) {
      const session = await openPage(contextFor(scheme), new URL('/', origin).href, 150, {
        width: 1440,
        height: 900,
      });
      try {
        const snapshot = await extractTokens(session.page);
        tokens.push({ scheme, values: snapshot.values });
        for (const font of snapshot.fonts) fonts.set(`${font.family}|${font.src}`, font);
        for (const name of snapshot.keyframes) keyframes.add(name);
      } finally {
        await session.page.close();
      }
    }

    const metaProbes = [];
    for (const path of META_PATHS) {
      const result = await probeUrl(dark, new URL(path, origin).href);
      metaProbes.push({
        path,
        status: result.status,
        contentType: result.contentType,
      });
    }

    const report = buildReport(
      options,
      origin,
      pages,
      sitemap.status,
      statuses,
      redirects,
      metaProbes,
      tokens,
      [...fonts.values()],
      [...keyframes],
    );
    await writeReport(report, options.outDir);
    progress(`Wrote ${join(options.outDir, 'DISCOVERY.md')}`);
    progress(`Wrote ${join(options.outDir, 'discovery.json')}`);
    progress(
      `Summary: ${pages.length} pages, ${redirects.length} redirects, ${report.anomalies.length} anomalies`,
    );
  } finally {
    await dark.close();
    await light.close();
    await browser.close();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? (error.stack ?? error.message) : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
