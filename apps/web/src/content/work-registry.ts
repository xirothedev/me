import type { ComponentType } from 'react';
import TaxEasy, { meta as taxEasyMeta } from '@content/work/taxeasy.mdx';
import Ecopick, { meta as ecopickMeta } from '@content/work/ecopick.mdx';
import XaDaoXa, { meta as xadaoxaMeta } from '@content/work/xadaoxa.mdx';
import { contentMetaSchema, type ContentMeta } from './schema';

export interface WorkPageEntry {
  slug: string;
  meta: ContentMeta;
  Content: ComponentType;
}

const SOURCES = [
  { slug: 'taxeasy', meta: taxEasyMeta, Content: TaxEasy },
  { slug: 'ecopick', meta: ecopickMeta, Content: Ecopick },
  { slug: 'xadaoxa', meta: xadaoxaMeta, Content: XaDaoXa },
] as const;

const ENTRIES: WorkPageEntry[] = SOURCES.map((source) => ({
  slug: source.slug,
  meta: contentMetaSchema.parse(source.meta),
  Content: source.Content,
}));

const BY_SLUG = new Map(ENTRIES.map((entry) => [entry.slug, entry]));

export const workPages = ENTRIES;

export const workPageSlugs = ENTRIES.map((entry) => entry.slug);

export function getWorkPage(slug: string): WorkPageEntry | undefined {
  return BY_SLUG.get(slug);
}
