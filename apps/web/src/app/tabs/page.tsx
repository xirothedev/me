import type { Metadata } from 'next';
import Link from 'next/link';
import { getTabs } from '@/content/tabs';

export const metadata: Metadata = {
  title: 'Tabs',
  description: 'Guitar tabs I like playing.',
  alternates: { canonical: '/tabs' },
};

export default async function TabsPage() {
  const songs = await getTabs();
  return (
    <article className="content-frame">
      <h1 className="content-title font-reading text-title-sm text-ink-strong sm:text-title mb-[0.6em] leading-[1.4] font-semibold tracking-[-0.02em] text-balance">
        My Tabs
      </h1>
      <p className="text-ink-muted mb-8 italic">Some songs I like playing</p>
      <ul className="list-none space-y-2 pl-0">
        {songs.map((song) => (
          <li key={song.slug}>
            <Link
              href={`/tabs/${song.slug}`}
              className="text-ink-soft decoration-ink-soft/30 hover:text-ink-muted underline decoration-1 underline-offset-[0.18em] transition-colors"
            >
              {song.title} — {song.artist}
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
