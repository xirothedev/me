import type { Page } from 'playwright-core';
import type { LayoutRecord } from './types';

export type LayoutSnapshot = Omit<LayoutRecord, 'scheme' | 'width'>;

export async function extractLayout(page: Page): Promise<LayoutSnapshot> {
  return page.evaluate(() => {
    const rectOf = (element: Element): { x: number; y: number; width: number; height: number } => {
      const rect = element.getBoundingClientRect();
      return {
        x: Math.round(rect.x),
        y: Math.round(rect.y + window.scrollY),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      };
    };

    const regionSelectors = [
      '.site-shell',
      '.content-frame',
      '.content-title',
      '.site-title',
      '.home-layout',
      '.home-copy',
      '.home-visual',
      '.bio-section',
      '.bio-toggle',
      '.notes-list',
      '.blogs-list',
      '.article-meta',
      '.article-margin-notes',
      '.margin-note-desktop',
      '.margin-note-mobile',
      'nav',
      'main',
      'article',
      'aside',
      'footer',
    ];

    const regions: Record<
      string,
      {
        display: string;
        position: string;
        rect: ReturnType<typeof rectOf>;
      } | null
    > = {};
    for (const selector of regionSelectors) {
      const element = document.querySelector(selector);
      if (!element) {
        regions[selector] = null;
        continue;
      }
      const style = getComputedStyle(element);
      regions[selector] = {
        display: style.display,
        position: style.position,
        rect: rectOf(element),
      };
    }

    const marginNotes = [...document.querySelectorAll('.margin-note-desktop, .margin-note-mobile')]
      .map(rectOf)
      .filter((rect) => rect.width > 0 && rect.height > 0);

    const figures = [...document.querySelectorAll<HTMLElement>('[data-viz]')].map((figure) => ({
      name: figure.dataset.viz ?? 'unknown',
      rect: rectOf(figure),
    }));

    const body = getComputedStyle(document.body);

    return {
      scrollHeight: document.documentElement.scrollHeight,
      body: {
        fontFamily: body.fontFamily,
        fontSize: body.fontSize,
        lineHeight: body.lineHeight,
        background: body.backgroundColor,
        color: body.color,
      },
      regions,
      marginNotes,
      figures,
    };
  });
}
