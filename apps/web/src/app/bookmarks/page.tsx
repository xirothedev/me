import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import bookmarks from '@content/bookmarks.json';

interface BookmarkLink {
  title: string;
  href: string;
  favicon: string | null;
}

interface BookmarkGroup {
  title: string;
  links: BookmarkLink[];
}

const GROUPS = (bookmarks as { groups: BookmarkGroup[] }).groups;

export const metadata: Metadata = {
  title: 'Bookmarks',
  description: 'Links I use, read, and steal from.',
  alternates: { canonical: '/bookmarks' },
};

export default function BookmarksPage() {
  return (
    <article className="content-frame">
      <h1 className="content-title font-reading text-title-sm text-ink-strong sm:text-title mb-[0.6em] leading-[1.4] font-semibold tracking-[-0.02em] text-balance">
        Bookmarks
      </h1>
      <p className="mb-[1.45rem]">A collection of links I use, read, and steal from.</p>
      <p className="mb-[1.45rem]">
        I also keep a small{' '}
        <Link
          href="/lab"
          className="text-ink-soft decoration-ink-soft/30 hover:text-ink-muted underline decoration-1 underline-offset-[0.18em] transition-colors"
        >
          lab
        </Link>
        .
      </p>

      {GROUPS.map((group) => (
        <section key={group.title}>
          <h2 className="font-reading text-section text-ink-strong mt-[3.1rem] mb-[1.2rem] font-semibold tracking-[-0.02em]">
            {group.title}
          </h2>
          <div>
            {group.links.map((link) => (
              <a
                key={`${group.title}-${link.href}`}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-soft decoration-ink-soft/30 hover:text-ink-muted mb-1 flex items-center gap-2 underline decoration-1 underline-offset-[0.18em] transition-colors"
              >
                {link.favicon ? (
                  <Image
                    src={link.favicon}
                    alt=""
                    width={16}
                    height={16}
                    unoptimized
                    loading="lazy"
                    className="size-4 shrink-0"
                  />
                ) : (
                  <span className="bg-surface size-4 shrink-0 rounded-sm" />
                )}
                {link.title}
              </a>
            ))}
          </div>
        </section>
      ))}
    </article>
  );
}
