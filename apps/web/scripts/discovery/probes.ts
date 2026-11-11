import type { Page } from 'playwright-core';
import type { ProbeRecord } from './types';

type Probe = (page: Page) => Promise<ProbeRecord>;

export async function runProbes(page: Page, path: string): Promise<ProbeRecord[]> {
  const probes = PROBES[path] ?? [];
  const results: ProbeRecord[] = [];
  for (const probe of probes) {
    results.push(await safe(probe, page));
  }
  return results;
}

async function safe(probe: Probe, page: Page): Promise<ProbeRecord> {
  try {
    return await probe(page);
  } catch (error) {
    return {
      name: probe.name,
      ok: false,
      details: error instanceof Error ? error.message : String(error),
      changes: [],
    };
  }
}

async function probeBio(page: Page): Promise<ProbeRecord> {
  const long = page.getByRole('button', { name: 'Long' });
  const short = page.getByRole('button', { name: 'Default' });
  const content = page.locator('#bio-content');
  const before = (await content.innerText()).length;
  await long.click();
  await page.waitForTimeout(250);
  const after = (await content.innerText()).length;
  const changes = [
    `long pressed: ${await long.getAttribute('aria-pressed')}`,
    `default pressed: ${await short.getAttribute('aria-pressed')}`,
    `content length: ${before} -> ${after}`,
    `gallery items: ${await page.locator('.bio-gallery-item').count()}`,
    `images in bio: ${await content.locator('img').count()}`,
  ];
  await short.click();
  await page.waitForTimeout(150);
  return {
    name: 'bio-modes',
    ok: after !== before,
    details: 'Default and Long bio modes',
    changes,
  };
}

async function probeHomeViewer(page: Page): Promise<ProbeRecord> {
  await page.getByRole('button', { name: 'Long' }).click();
  await page.waitForTimeout(250);
  const item = page.locator('.bio-gallery-item').first();
  await item.scrollIntoViewIfNeeded();
  await item.click();
  await page.waitForTimeout(350);
  const dialog = page.locator('[role="dialog"]');
  const opened = (await dialog.count()) > 0;
  const changes = [
    `dialog present: ${opened}`,
    `aria-modal: ${await dialog.first().getAttribute('aria-modal')}`,
    `title: ${await dialog
      .first()
      .locator('#modal-title')
      .innerText()
      .catch(() => '')}`,
    `buttons: ${(await dialog.first().locator('button').allInnerTexts()).length}`,
    `buttons: ${await dialog
      .first()
      .locator('button')
      .evaluateAll((controls) =>
        controls.map((control) => control.getAttribute('aria-label')).join(', '),
      )}`,
  ];
  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);
  const closed = (await page.locator('[role="dialog"]').count()) === 0;
  changes.push(`closed: ${closed}`);
  return {
    name: 'home-viewer',
    ok: opened && closed,
    details: 'Long-bio image viewer',
    changes,
  };
}

async function probeVercelViewer(page: Page): Promise<ProbeRecord> {
  const image = page.locator('img[alt="Next.js Conf 2024"]').first();
  await image.scrollIntoViewIfNeeded();
  await image.click();
  await page.waitForTimeout(350);
  const dialog = page.locator('[role="dialog"]');
  const opened = (await dialog.count()) > 0;
  const changes = [
    `dialog present: ${opened}`,
    `image: ${(await dialog.first().locator('img').first().getAttribute('src')) ?? ''}`,
  ];
  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);
  const closed = (await page.locator('[role="dialog"]').count()) === 0;
  changes.push(`closed: ${closed}`);
  return {
    name: 'vercel-viewer',
    ok: opened && closed,
    details: 'Vintage gallery viewer',
    changes,
  };
}

async function probeFigures(page: Page): Promise<ProbeRecord> {
  const figures = page.locator('[data-viz]');
  const count = await figures.count();
  const names: string[] = [];
  const changes: string[] = [];
  for (let index = 0; index < count; index += 1) {
    const figure = figures.nth(index);
    const name = (await figure.getAttribute('data-viz')) ?? `figure-${index}`;
    names.push(name);
    await figure.scrollIntoViewIfNeeded();
    const play = figure.locator('button').first();
    const beforeLabel = await play.getAttribute('aria-label');
    await play.click();
    await page.waitForTimeout(250);
    const afterLabel = await play.getAttribute('aria-label');
    changes.push(`${name}: play label ${beforeLabel} -> ${afterLabel}`);
    await play.click();
    const speeds = await figure
      .locator('button')
      .evaluateAll((items) =>
        items.map((control) => control.textContent?.trim() ?? '').filter(Boolean),
      );
    changes.push(`${name}: controls ${speeds.join(' | ')}`);
    const text = (await figure.innerText()).replace(/\s+/g, ' ').slice(0, 180);
    changes.push(`${name}: text ${text}`);
  }
  return {
    name: 'ai-figures',
    ok: names.length === 7,
    details: `Found ${names.length} figures: ${names.join(', ')}`,
    changes,
  };
}

async function probeTemperature(page: Page): Promise<ProbeRecord> {
  const figure = page.locator('[data-viz="temperature"]');
  await figure.scrollIntoViewIfNeeded();
  const creative = figure.getByRole('button', { name: 'Creative' });
  const balanced = figure.getByRole('button', { name: 'Balanced' });
  const before = (await figure.innerText()).replace(/\s+/g, ' ').slice(0, 300);
  await creative.click();
  await page.waitForTimeout(350);
  const after = (await figure.innerText()).replace(/\s+/g, ' ').slice(0, 300);
  await balanced.click();
  return {
    name: 'temperature-presets',
    ok: before !== after,
    details: 'Creative preset changes the figure output',
    changes: [`before: ${before}`, `after: ${after}`],
  };
}

async function probeDetails(page: Page): Promise<ProbeRecord> {
  const first = page.locator('details').first();
  await first.scrollIntoViewIfNeeded();
  const before = await first.getAttribute('open');
  await first.locator('summary').click();
  await page.waitForTimeout(150);
  const opened = await first.getAttribute('open');
  await first.locator('summary').click();
  await page.waitForTimeout(150);
  const closed = await first.getAttribute('open');
  return {
    name: 'details-toggle',
    ok: before === null && opened !== null && closed === null,
    details: 'First collapsible section opens and closes',
    changes: [`open: ${before} -> ${opened} -> ${closed}`],
  };
}

const PROBES: Record<string, Probe[]> = {
  '/': [probeBio, probeHomeViewer],
  '/vercel': [probeVercelViewer],
  '/ai': [probeFigures, probeTemperature],
  '/agents': [probeDetails],
};
