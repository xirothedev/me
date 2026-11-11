import type { ComponentType } from 'react';
import Ai, { meta as aiMeta } from '@content/notes/ai.mdx';
import Beliefs, { meta as beliefsMeta } from '@content/notes/beliefs.mdx';
import DeveloperMarketing, {
  meta as developerMarketingMeta,
} from '@content/notes/developer-marketing.mdx';
import Devrel, { meta as devrelMeta } from '@content/notes/devrel.mdx';
import Devtools, { meta as devtoolsMeta } from '@content/notes/devtools.mdx';
import Docs, { meta as docsMeta } from '@content/notes/docs.mdx';
import Dx, { meta as dxMeta } from '@content/notes/dx.mdx';
import Moderation, { meta as moderationMeta } from '@content/notes/moderation.mdx';
import PersonalSoftware, {
  meta as personalSoftwareMeta,
} from '@content/notes/personal-software.mdx';
import ProductEngineers, {
  meta as productEngineersMeta,
} from '@content/notes/product-engineers.mdx';
import Agents, { meta as agentsMeta } from '@content/blogs/agents.mdx';
import Css, { meta as cssMeta } from '@content/blogs/css.mdx';
import Heroku, { meta as herokuMeta } from '@content/blogs/heroku.mdx';
import ModelBehavior, { meta as modelBehaviorMeta } from '@content/blogs/model-behavior.mdx';
import Pixo, { meta as pixoMeta } from '@content/blogs/pixo.mdx';
import Reflections, { meta as reflectionsMeta } from '@content/blogs/reflections.mdx';
import Rust, { meta as rustMeta } from '@content/blogs/rust.mdx';
import Vercel, { meta as vercelMeta } from '@content/blogs/vercel.mdx';
import Bronco, { meta as broncoMeta } from '@content/pages/bronco.mdx';
import { contentMetaSchema, type ContentMeta } from './schema';

export interface PageEntry {
  slug: string;
  meta: ContentMeta;
  Content: ComponentType;
}

const SOURCES = [
  { slug: 'beliefs', meta: beliefsMeta, Content: Beliefs },
  { slug: 'ai', meta: aiMeta, Content: Ai },
  { slug: 'dx', meta: dxMeta, Content: Dx },
  {
    slug: 'developer-marketing',
    meta: developerMarketingMeta,
    Content: DeveloperMarketing,
  },
  { slug: 'devrel', meta: devrelMeta, Content: Devrel },
  { slug: 'devtools', meta: devtoolsMeta, Content: Devtools },
  { slug: 'docs', meta: docsMeta, Content: Docs },
  { slug: 'moderation', meta: moderationMeta, Content: Moderation },
  {
    slug: 'personal-software',
    meta: personalSoftwareMeta,
    Content: PersonalSoftware,
  },
  {
    slug: 'product-engineers',
    meta: productEngineersMeta,
    Content: ProductEngineers,
  },
  { slug: 'model-behavior', meta: modelBehaviorMeta, Content: ModelBehavior },
  { slug: 'pixo', meta: pixoMeta, Content: Pixo },
  { slug: 'agents', meta: agentsMeta, Content: Agents },
  { slug: 'reflections', meta: reflectionsMeta, Content: Reflections },
  { slug: 'vercel', meta: vercelMeta, Content: Vercel },
  { slug: 'css', meta: cssMeta, Content: Css },
  { slug: 'heroku', meta: herokuMeta, Content: Heroku },
  { slug: 'rust', meta: rustMeta, Content: Rust },
  { slug: 'bronco', meta: broncoMeta, Content: Bronco },
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
