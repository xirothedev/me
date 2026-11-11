import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright-core';
import type { ColorScheme } from './types';

export interface PageSession {
  page: Page;
  status: number;
  finalUrl: string;
  redirected: boolean;
  errors: string[];
  failedRequests: { url: string; status: number | null }[];
}

export async function launchBrowser(): Promise<Browser> {
  const channel = process.env.BROWSER_CHANNEL ?? 'chrome';
  try {
    return await chromium.launch({ channel, headless: true });
  } catch (error) {
    throw new Error(
      `Cannot launch browser channel "${channel}". Install Chrome, or set BROWSER_CHANNEL to a channel that exists.`,
      { cause: error },
    );
  }
}

export async function newContext(browser: Browser, scheme: ColorScheme): Promise<BrowserContext> {
  return browser.newContext({
    colorScheme: scheme,
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',
    ignoreHTTPSErrors: true,
  });
}

export async function openPage(
  context: BrowserContext,
  url: string,
  settleMs: number,
  viewport?: { width: number; height: number },
  fast = false,
): Promise<PageSession> {
  const page = await context.newPage();
  if (viewport) await page.setViewportSize(viewport);
  const errors: string[] = [];
  const failedRequests: { url: string; status: number | null }[] = [];

  page.on('console', (message) => {
    if (message.type() !== 'error') return;
    errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('requestfailed', (request) => {
    failedRequests.push({ url: request.url(), status: null });
  });
  page.on('response', (response) => {
    if (response.status() >= 400) {
      failedRequests.push({ url: response.url(), status: response.status() });
    }
  });

  const response = await page.goto(url, {
    waitUntil: fast ? 'domcontentloaded' : 'load',
    timeout: 45_000,
  });
  if (!fast) {
    await waitForImages(page);
    await page.waitForTimeout(settleMs);
  } else {
    await page.waitForTimeout(50);
  }

  return {
    page,
    status: response?.status() ?? 0,
    finalUrl: page.url(),
    redirected: page.url() !== url,
    errors: dedupe(errors).slice(0, 50),
    failedRequests: dedupeRequests(failedRequests).slice(0, 50),
  };
}

export async function primeLazyContent(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const step = Math.max(400, Math.floor(window.innerHeight * 0.8));
    const height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    for (let y = 0; y < height; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 40));
    }
    window.scrollTo(0, 0);
    await new Promise((resolve) => setTimeout(resolve, 120));
  });
  await waitForImages(page);
}

export async function waitForImages(page: Page): Promise<void> {
  await page
    .evaluate(async () => {
      const pending = [...document.images].filter((image) => !image.complete);
      await Promise.race([
        Promise.all(
          pending.map(
            (image) =>
              new Promise<void>((resolve) => {
                image.addEventListener('load', () => resolve(), { once: true });
                image.addEventListener('error', () => resolve(), {
                  once: true,
                });
              }),
          ),
        ),
        new Promise<void>((resolve) => setTimeout(resolve, 5000)),
      ]);
    })
    .catch(() => undefined);
}

export async function screenshotPage(page: Page, path: string, fullPage: boolean): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await page.screenshot({ path, fullPage, animations: 'disabled' });
}

export async function readText(
  context: BrowserContext,
  url: string,
): Promise<{ status: number; body: string; contentType: string | null }> {
  const response = await context.request.get(url, {
    failOnStatusCode: false,
    timeout: 30_000,
  });
  return {
    status: response.status(),
    body: await response.text(),
    contentType: response.headers()['content-type'] ?? null,
  };
}

export async function probeUrl(
  context: BrowserContext,
  url: string,
): Promise<{
  status: number;
  location: string | null;
  contentType: string | null;
}> {
  const response = await context.request.get(url, {
    failOnStatusCode: false,
    maxRedirects: 0,
    timeout: 30_000,
  });
  return {
    status: response.status(),
    location: response.headers()['location'] ?? null,
    contentType: response.headers()['content-type'] ?? null,
  };
}

function dedupe(values: string[]): string[] {
  return [...new Set(values)];
}

function dedupeRequests(
  values: { url: string; status: number | null }[],
): { url: string; status: number | null }[] {
  const seen = new Set<string>();
  return values.filter((value) => {
    const key = `${value.status ?? 'fail'}:${value.url}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
