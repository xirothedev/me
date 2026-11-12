import type { MetadataRoute } from 'next';
import { blogs, notes, pages } from '@/content/registry';
import { workPageSlugs } from '@/content/work-registry';
import { siteConfig } from '@/lib/site-config';

const LAST_MODIFIED = new Date('2026-11-11T00:00:00Z');

export default function sitemap(): MetadataRoute.Sitemap {
  const entries = [
    { path: '/', priority: 1 },
    ...notes.map((note) => ({ path: `/${note.slug}`, priority: 0.8 })),
    ...blogs.map((blog) => ({ path: `/${blog.slug}`, priority: 0.8 })),
    ...pages.map((page) => ({ path: `/${page.slug}`, priority: 0.6 })),
    ...workPageSlugs.map((slug) => ({ path: `/work/${slug}`, priority: 0.7 })),
    { path: '/bookmarks', priority: 0.6 },
  ];

  return entries.map((entry) => ({
    url: new URL(entry.path, siteConfig.url).href,
    lastModified: LAST_MODIFIED,
    changeFrequency: 'monthly',
    priority: entry.priority,
  }));
}
