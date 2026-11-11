import type { ComponentType } from 'react';
import HowIWork, { meta as howIWorkMeta } from '@content/notes/how-i-work.mdx';
import LlmFailures, {
  meta as llmFailuresMeta,
} from '@content/notes/how-llms-fail-in-production.mdx';
import Repository, {
  meta as repositoryMeta,
} from '@content/notes/the-repository-is-the-product.mdx';
import Shipping, {
  meta as shippingMeta,
} from '@content/notes/shipping-is-not-the-announcement.mdx';
import BuildingInPublic, {
  meta as buildingInPublicMeta,
} from '@content/notes/building-in-public.mdx';
import DeveloperTools, { meta as developerToolsMeta } from '@content/notes/developer-tools.mdx';
import Docs, { meta as docsMeta } from '@content/notes/docs-that-answer.mdx';
import Moderation, { meta as moderationMeta } from '@content/notes/moderating-a-community.mdx';
import OneUser, { meta as oneUserMeta } from '@content/notes/software-for-one-user.mdx';
import ProductEngineer, {
  meta as productEngineerMeta,
} from '@content/notes/the-product-engineer.mdx';
import CodingAgents, { meta as codingAgentsMeta } from '@content/blogs/coding-agents.mdx';
import Css, { meta as cssMeta } from '@content/blogs/the-css-i-keep.mdx';
import TaxPlatform, { meta as taxPlatformMeta } from '@content/blogs/tax-platform.mdx';
import RefundService, { meta as refundServiceMeta } from '@content/blogs/refund-service.mdx';
import Ocr, { meta as ocrMeta } from '@content/blogs/ocr-in-production.mdx';
import CodeReview, { meta as codeReviewMeta } from '@content/blogs/code-review.mdx';
import Prisma, { meta as prismaMeta } from '@content/blogs/prisma-7.mdx';
import ResonanceTeam, { meta as resonanceTeamMeta } from '@content/blogs/the-resonance-team.mdx';
import Hospital, { meta as hospitalMeta } from '@content/pages/hospital.mdx';
import { contentMetaSchema, type ContentMeta } from './schema';

export interface PageEntry {
  slug: string;
  meta: ContentMeta;
  Content: ComponentType;
}

const SOURCES = [
  { slug: 'how-i-work', meta: howIWorkMeta, Content: HowIWork },
  {
    slug: 'how-llms-fail-in-production',
    meta: llmFailuresMeta,
    Content: LlmFailures,
  },
  {
    slug: 'the-repository-is-the-product',
    meta: repositoryMeta,
    Content: Repository,
  },
  {
    slug: 'shipping-is-not-the-announcement',
    meta: shippingMeta,
    Content: Shipping,
  },
  {
    slug: 'building-in-public',
    meta: buildingInPublicMeta,
    Content: BuildingInPublic,
  },
  {
    slug: 'developer-tools',
    meta: developerToolsMeta,
    Content: DeveloperTools,
  },
  { slug: 'docs-that-answer', meta: docsMeta, Content: Docs },
  { slug: 'moderating-a-community', meta: moderationMeta, Content: Moderation },
  { slug: 'software-for-one-user', meta: oneUserMeta, Content: OneUser },
  {
    slug: 'the-product-engineer',
    meta: productEngineerMeta,
    Content: ProductEngineer,
  },
  { slug: 'coding-agents', meta: codingAgentsMeta, Content: CodingAgents },
  { slug: 'the-css-i-keep', meta: cssMeta, Content: Css },
  { slug: 'tax-platform', meta: taxPlatformMeta, Content: TaxPlatform },
  { slug: 'refund-service', meta: refundServiceMeta, Content: RefundService },
  { slug: 'ocr-in-production', meta: ocrMeta, Content: Ocr },
  { slug: 'code-review', meta: codeReviewMeta, Content: CodeReview },
  { slug: 'prisma-7', meta: prismaMeta, Content: Prisma },
  {
    slug: 'the-resonance-team',
    meta: resonanceTeamMeta,
    Content: ResonanceTeam,
  },
  { slug: 'hospital', meta: hospitalMeta, Content: Hospital },
] as const;

const ENTRIES: PageEntry[] = SOURCES.map((source) => ({
  slug: source.slug,
  meta: contentMetaSchema.parse(source.meta),
  Content: source.Content,
}));

const BY_SLUG = new Map(ENTRIES.map((entry) => [entry.slug, entry]));

export const notes = ENTRIES.filter((entry) => entry.meta.kind === 'note').sort(
  (left, right) => (left.meta.order ?? 0) - (right.meta.order ?? 0),
);

export const blogs = ENTRIES.filter((entry) => entry.meta.kind === 'blog').sort((left, right) =>
  (right.meta.date ?? '').localeCompare(left.meta.date ?? ''),
);

export const pages = ENTRIES.filter((entry) => entry.meta.kind === 'page');

export const pageSlugs = ENTRIES.map((entry) => entry.slug);

export function getPage(slug: string): PageEntry | undefined {
  return BY_SLUG.get(slug);
}

export function isKnownPage(slug: string): boolean {
  return BY_SLUG.has(slug);
}
