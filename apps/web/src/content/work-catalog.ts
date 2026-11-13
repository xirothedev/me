import type { ComponentType } from 'react';
import TaxEasy, { meta as taxEasyMeta } from '@content/work/taxeasy.mdx';
import Ecopick, { meta as ecopickMeta } from '@content/work/ecopick.mdx';
import XaDaoXa, { meta as xadaoxaMeta } from '@content/work/xadaoxa.mdx';
import { contentMetaSchema, type ContentMeta } from './schema';

interface WorkPageSource {
  slug: string;
  meta: unknown;
  Content: ComponentType;
  name: string;
  kind: string;
  summary: string;
  status: string;
}

export interface WorkPageEntry {
  slug: string;
  meta: ContentMeta;
  Content: ComponentType;
  status: string;
  listEntry: WorkPageListEntry;
}

interface WorkListEntryBase {
  name: string;
  kind: string;
  summary: string;
  status: string;
}

export interface WorkPageListEntry extends WorkListEntryBase {
  type: 'page';
  slug: string;
  href: `/work/${string}`;
}

export interface InternalWorkListEntry extends WorkListEntryBase {
  type: 'internal';
  href: string;
}

export interface ExternalWorkListEntry extends WorkListEntryBase {
  type: 'external';
  href: string;
}

export type WorkListEntry = WorkPageListEntry | InternalWorkListEntry | ExternalWorkListEntry;

const PAGE_SOURCES: WorkPageSource[] = [
  {
    slug: 'taxeasy',
    meta: taxEasyMeta,
    Content: TaxEasy,
    name: 'TaxEasy',
    kind: 'Tax management SaaS',
    summary:
      'Receipt and invoice ingestion, OCR extraction, anomaly detection, and observability for tax agents.',
    status: 'Private · 309 PRs merged',
  },
  {
    slug: 'ecopick',
    meta: ecopickMeta,
    Content: Ecopick,
    name: 'Ecopick',
    kind: 'Marketplace and tournaments',
    summary:
      'A support assistant, product matcher, and refund gate on a state-machine marketplace engine.',
    status: 'Private · 352 PRs merged',
  },
  {
    slug: 'xadaoxa',
    meta: xadaoxaMeta,
    Content: XaDaoXa,
    name: 'XaDaoXa',
    kind: 'Government e-services',
    summary: 'A Zalo MiniApp for citizens and a staff CMS for commune officials.',
    status: 'Live for citizens · 203 PRs merged',
  },
];

function parseWorkPage(source: WorkPageSource): WorkPageEntry {
  const meta = contentMetaSchema.parse(source.meta);
  const listEntry: WorkPageListEntry = {
    type: 'page',
    name: source.name,
    slug: source.slug,
    kind: source.kind,
    summary: source.summary,
    status: source.status,
    href: `/work/${source.slug}`,
  };

  return {
    slug: source.slug,
    meta,
    Content: source.Content,
    status: source.status,
    listEntry,
  };
}

export const workPages: WorkPageEntry[] = PAGE_SOURCES.map(parseWorkPage);

const WORK_PAGES_BY_SLUG = new Map(workPages.map((entry) => [entry.slug, entry]));

export const workPageSlugs = workPages.map((entry) => entry.slug);

export function getWorkPage(slug: string): WorkPageEntry | undefined {
  return WORK_PAGES_BY_SLUG.get(slug);
}

export const workEntries: WorkListEntry[] = [
  ...workPages.map((entry) => entry.listEntry),
  {
    type: 'internal',
    name: 'Hospital AI Assistant',
    kind: 'Clinical document retrieval',
    summary: 'Local models and self-hosted RAGFlow inside a provincial hospital network.',
    status: 'In pilot · Case study',
    href: '/hospital',
  },
  {
    type: 'external',
    name: 'Agent Skills',
    kind: 'Open source',
    summary: 'NestJS rules for security, validation, architecture, and testing.',
    status: 'Open source',
    href: 'https://github.com/xirothedev/agent-skills',
  },
];
