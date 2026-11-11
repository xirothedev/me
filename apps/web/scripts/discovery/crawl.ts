import { join } from 'node:path';
import type { BrowserContext } from 'playwright-core';
import { openPage, primeLazyContent, screenshotPage } from './browser';
import { extractFeatures } from './extract-features';
import { extractLayout } from './extract-layout';
import { extractMeta } from './extract-meta';
import { runProbes } from './probes';
import type { ColorScheme, DiscoveryOptions, PageRecord } from './types';
import { normalizePath, progress, slugOf, unique, uniqueRequests } from './utils';

export async function crawl(
  options: DiscoveryOptions,
  origin: string,
  sitemapPaths: string[],
  statuses: Map<string, { status: number; location: string | null }>,
  context: BrowserContext,
): Promise<string[]> {
  const queue = unique([...sitemapPaths.filter((path) => statuses.get(path)?.status === 200), '/']);
  const known = new Set(queue);
  const live: string[] = [];

  while (queue.length > 0 && live.length < options.maxPages) {
    const path = queue.shift();
    if (!path || live.includes(path)) continue;
    const session = await openPage(
      context,
      new URL(path, origin).href,
      options.settleMs,
      {
        width: 1440,
        height: 900,
      },
      true,
    );
    try {
      const finalPath = normalizePath(session.finalUrl, origin);
      if (session.status !== 200 || finalPath !== path) continue;
      progress(`Crawl ${live.length + 1}: ${path}`);
      live.push(path);
      const features = await extractFeatures(session.page);
      for (const link of features.links) {
        const next = normalizePath(link.href, origin);
        if (!next || known.has(next)) continue;
        known.add(next);
        queue.push(next);
      }
    } finally {
      await session.page.close();
    }
  }

  return live;
}

export async function capturePage(
  options: DiscoveryOptions,
  origin: string,
  path: string,
  dark: BrowserContext,
  light: BrowserContext,
): Promise<PageRecord> {
  const allSchemes: ColorScheme[] = [...options.schemes];
  if (options.lightHome && path === '/') allSchemes.push('light');
  const schemes = unique(allSchemes);
  const record = createRecord(path, origin);
  let captured = false;

  for (const scheme of schemes) {
    const context = scheme === 'light' ? light : dark;
    for (const width of options.widths) {
      const session = await openPage(context, new URL(path, origin).href, options.settleMs, {
        width,
        height: 900,
      });
      try {
        await primeLazyContent(session.page);
        const layout = await extractLayout(session.page);
        record.layout.push({ scheme, width, ...layout });
        record.errors.push(...session.errors);
        record.failedRequests.push(...session.failedRequests);

        if (!captured) {
          record.meta = await extractMeta(session.page);
          const features = await extractFeatures(session.page);
          record.headings = features.headings;
          record.controls = features.controls;
          record.details = features.details;
          record.media = features.media;
          record.links = features.links;
          record.hidden = features.hidden;
          record.animations = features.animations;
          record.cursors = features.cursors;
          record.htmlBytes = features.htmlBytes;
          record.textLength = features.textLength;
          record.route.status = session.status;
          record.route.finalUrl = session.finalUrl;
          record.route.redirected = session.redirected;
          record.route.title = record.meta.title;
          captured = true;
        }

        if (!options.skipScreenshots) {
          const shot = join(
            'screenshots',
            `${slugOf(path)}-${scheme}-${width}${options.fullPage ? '' : '-viewport'}.png`,
          );
          await screenshotPage(session.page, join(options.outDir, shot), options.fullPage);
          record.screenshots.push(shot);
        }
      } finally {
        await session.page.close();
      }
    }
  }

  const probeSession = await openPage(dark, new URL(path, origin).href, options.settleMs, {
    width: options.widths[options.widths.length - 1],
    height: 900,
  });
  try {
    record.probes = await runProbes(probeSession.page, path);
  } finally {
    await probeSession.page.close();
  }

  record.errors = unique(record.errors).slice(0, 50);
  record.failedRequests = uniqueRequests(record.failedRequests).slice(0, 50);
  return record;
}

function createRecord(path: string, origin: string): PageRecord {
  return {
    route: {
      path,
      url: new URL(path, origin).href,
      status: 0,
      finalUrl: '',
      redirected: false,
      title: '',
      sitemap: true,
      discoveredFrom: ['sitemap'],
    },
    meta: {
      title: '',
      description: null,
      canonical: null,
      ogImage: null,
      ogTitle: null,
      twitterCard: null,
      jsonLd: [],
      h1: null,
      articleMeta: null,
    },
    headings: [],
    controls: [],
    details: [],
    media: [],
    links: [],
    hidden: [],
    animations: [],
    cursors: [],
    layout: [],
    probes: [],
    errors: [],
    failedRequests: [],
    htmlBytes: 0,
    textLength: 0,
    screenshots: [],
  };
}
