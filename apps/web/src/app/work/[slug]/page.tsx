import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Article } from '@/components/site/article';
import { getWorkPage, workPageSlugs } from '@/content/work-catalog';
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
    other: { 'work:status': entry.status },
  };
}

export default async function WorkPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = getWorkPage(slug);
  if (!entry) notFound();

  return (
    <>
      <div className="content-frame mb-2">
        <Link
          href="/#work-heading"
          className="font-ui text-meta text-ink-soft hover:text-ink-muted inline-block no-underline transition-colors"
        >
          ← Work
        </Link>
        <p className="font-ui text-meta text-ink-soft mt-3">{entry.status}</p>
      </div>
      <Article entry={entry} />
    </>
  );
}
