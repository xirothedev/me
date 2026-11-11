import type { MetadataRoute } from 'next';
import { blogs, notes, pages } from '@/content/registry';
import { getTabs } from '@/content/tabs';
import { siteConfig } from '@/lib/site-config';

const LAST_MODIFIED = new Date('2026-11-11T00:00:00Z');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const songs = await getTabs();
  const entries = [
    { path: '/', priority: 1 },
    ...notes.map((note) => ({ path: `/${note.slug}`, priority: 0.8 })),
    ...blogs.map((blog) => ({ path: `/${blog.slug}`, priority: 0.8 })),
    ...pages.map((page) => ({ path: `/${page.slug}`, priority: 0.6 })),
    { path: '/tabs', priority: 0.6 },
    ...songs.map((song) => ({ path: `/tabs/${song.slug}`, priority: 0.5 })),
    { path: '/bookmarks', priority: 0.6 },
  ];

  return entries.map((entry) => ({
    url: new URL(entry.path, siteConfig.url).href,
    lastModified: LAST_MODIFIED,
    changeFrequency: 'monthly',
    priority: entry.priority,
  }));
}
