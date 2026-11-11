import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { cache } from 'react';
import { tabSchema, tabsIndexSchema, type Tab } from './schema';

const TABS_DIR = join(process.cwd(), 'content/tabs');
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface TabSummary {
  slug: string;
  title: string;
  artist: string;
}

export const getTabs = cache(async (): Promise<TabSummary[]> => {
  const raw = await readFile(join(TABS_DIR, 'index.json'), 'utf8');
  return tabsIndexSchema.parse(JSON.parse(raw)).songs;
});

export const getTab = cache(async (slug: string): Promise<Tab | null> => {
  if (!SLUG.test(slug)) return null;
  try {
    const raw = await readFile(join(TABS_DIR, `${slug}.json`), 'utf8');
    return tabSchema.parse(JSON.parse(raw));
  } catch {
    return null;
  }
});
