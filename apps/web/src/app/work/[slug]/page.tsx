import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Article } from '@/components/site/article';
import { getWorkPage, workPageSlugs } from '@/content/work-registry';
import { work } from '@/lib/work';
import { siteConfig } from '@/lib/site-config';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return workPageSlugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getWorkPage(slug);
  if (!entry) return {};
  const workEntry = work.find((item) => item.slug === slug);
  const description = entry.meta.description || siteConfig.description;
  const title = entry.meta.title;
  return {
    title,
    description,
    alternates: { canonical: `/work/${slug}` },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `/work/${slug}`,
    },
    other: workEntry ? { 'work:status': workEntry.meta } : undefined,
  };
}

export default async function WorkPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = getWorkPage(slug);
  if (!entry) notFound();
  const workEntry = work.find((item) => item.slug === slug);

  return (
    <>
      <div className="content-frame mb-2">
        <Link
          href="/#work-heading"
          className="font-ui text-meta text-ink-soft hover:text-ink-muted inline-block no-underline transition-colors"
        >
          ← Work
        </Link>
        {workEntry ? (
          <p className="font-ui text-meta text-ink-soft mt-3">{workEntry.meta}</p>
        ) : null}
      </div>
      <Article entry={entry} />
    </>
  );
}
