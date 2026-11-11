import type { Page } from 'playwright-core';
import type { MetaRecord } from './types';

export async function extractMeta(page: Page): Promise<MetaRecord> {
  return page.evaluate(() => {
    const meta = (name: string): string | null =>
      document.querySelector(`meta[name="${name}"]`)?.getAttribute('content') ??
      document.querySelector(`meta[property="${name}"]`)?.getAttribute('content') ??
      null;

    const jsonLd = [...document.querySelectorAll('script[type="application/ld+json"]')]
      .map((script) => {
        try {
          return JSON.parse(script.textContent ?? 'null') as unknown;
        } catch {
          return null;
        }
      })
      .filter((value) => value !== null);

    const h1 = document.querySelector('.content-title, .site-title, h1') as HTMLElement | null;
    const articleMeta = document.querySelector('.article-meta-details') as HTMLElement | null;

    return {
      title: document.title,
      description: meta('description'),
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null,
      ogImage: meta('og:image'),
      ogTitle: meta('og:title'),
      twitterCard: meta('twitter:card'),
      jsonLd,
      h1: h1?.innerText.trim() ?? null,
      articleMeta: articleMeta?.innerText.replace(/\s+/g, ' ').trim() ?? null,
    };
  });
}
