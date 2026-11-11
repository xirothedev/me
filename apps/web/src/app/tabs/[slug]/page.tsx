import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ICON, Icon } from '@repo/ui';
import { TabSheet } from '@/components/tabs/tab-sheet';
import { Tuner } from '@/components/tabs/tuner';
import { getTab, getTabs } from '@/content/tabs';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const songs = await getTabs();
  return songs.map((song) => ({ slug: song.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tab = await getTab(slug);
  if (!tab) return {};
  return {
    title: `${tab.title} — ${tab.artist}`,
    description: `Guitar chords for ${tab.title} by ${tab.artist}.`,
    alternates: { canonical: `/tabs/${slug}` },
  };
}

export default async function TabPage({ params }: PageProps) {
  const { slug } = await params;
  const tab = await getTab(slug);
  if (!tab) notFound();

  return (
    <article className="content-frame">
      <div className="mb-8">
        <Link
          href="/tabs"
          className="font-ui text-meta text-ink-soft hover:text-ink-muted mb-3 inline-block no-underline transition-colors"
        >
          <Icon icon={ICON.previous} size="xs" className="mr-1 inline" />
          Tabs
        </Link>
        <h1 className="content-title font-reading text-title-sm text-ink-strong sm:text-title mb-[0.6em] leading-[1.4] font-semibold tracking-[-0.02em] text-balance">
          {tab.title}
        </h1>
        <p className="text-ink-soft italic">{tab.artist}</p>
      </div>
      <Tuner />
      <TabSheet text={tab.text} />
    </article>
  );
}
