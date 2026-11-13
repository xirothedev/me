import Image from 'next/image';
import Link from 'next/link';
import type { ComponentType } from 'react';
import type { ContentMeta } from '@/content/schema';
import { formatMonth } from '@/lib/format';
import { siteConfig } from '@/lib/site-config';

interface ArticleProps {
  entry: {
    meta: ContentMeta;
    Content: ComponentType;
  };
}

export function Article({ entry }: ArticleProps) {
  const { meta, Content } = entry;
  return (
    <article className="content-frame">
      <h1 className="content-title font-reading text-title-sm text-ink-strong sm:text-title mb-[0.6em] font-semibold tracking-[-0.02em] text-balance">
        {meta.title}
      </h1>
      <Link
        href="/"
        className="article-meta font-ui text-meta text-ink-soft hover:text-ink-muted mb-[2.4rem] flex items-center gap-[0.45rem] leading-[1.35] no-underline transition-colors"
      >
        <Image
          src={siteConfig.avatar}
          alt=""
          width={20}
          height={20}
          className="border-line size-5 shrink-0 rounded-full border object-cover grayscale"
        />
        <span className="flex items-baseline gap-[0.4rem]">
          {meta.date ? <time dateTime={meta.date}>{formatMonth(meta.date)}</time> : null}
          {meta.date ? <span aria-hidden="true">·</span> : null}
          <span>{siteConfig.name}</span>
          {meta.updated ? <span>(updated {meta.updated})</span> : null}
        </span>
      </Link>
      <Content />
    </article>
  );
}
