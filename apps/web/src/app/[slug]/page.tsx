import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Article } from '@/components/site/article';
import { getPage, pageSlugs } from '@/content/registry';
import { siteConfig } from '@/lib/site-config';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return pageSlugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getPage(slug);
  if (!entry) return {};
  const description = entry.meta.description || siteConfig.description;
  return {
    title: entry.meta.title,
    description,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      type: 'article',
      title: entry.meta.title,
      description,
      url: `/${slug}`,
      ...(entry.meta.date ? { publishedTime: `${entry.meta.date}-01T00:00:00.000Z` } : {}),
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const entry = getPage(slug);
  if (!entry) notFound();
  return <Article entry={entry} />;
}
