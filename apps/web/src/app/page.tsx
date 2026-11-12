import Link from 'next/link';
import BioDefault from '@content/home/bio-default.mdx';
import BioLong from '@content/home/bio-long.mdx';
import { BioModes } from '@/components/home/bio-modes';
import { HeroScene } from '@/components/home/hero-scene';
import { WorkList } from '@/components/home/work-list';
import { blogs, notes } from '@/content/registry';
import { formatMonth } from '@/lib/format';
import { siteConfig } from '@/lib/site-config';

export default function Home() {
  return (
    <article className="content-frame">
      <div className="home-layout content:grid-cols-[minmax(0,1.75fr)_minmax(380px,1fr)] wide:grid-cols-[minmax(0,1.38fr)_minmax(380px,1fr)] content:items-start content:gap-[clamp(2rem,3.6vw,3.75rem)] grid gap-8">
        <div className="home-copy max-w-content w-full min-w-0">
          <h1 className="site-title font-reading text-ink-strong mb-[0.95em] text-[clamp(2.2rem,3.5vw,2.65rem)] leading-[1.15] font-semibold tracking-[-0.02em] text-balance">
            <Link
              href={siteConfig.socials.x}
              target="_blank"
              rel="noopener noreferrer"
              className="text-inherit no-underline transition-opacity hover:opacity-[0.72]"
            >
              <span className="relative top-[0.015em] mr-[0.015em] inline-block text-[1.1em] leading-0">
                @
              </span>
              {siteConfig.handle.replace('@', '')}
            </Link>
          </h1>

          <BioModes defaultBio={<BioDefault />} longBio={<BioLong />} />

          <WorkList />

          <div className="writing-index mt-14">
            <section aria-labelledby="notes-heading">
              <h2
                id="notes-heading"
                className="font-reading text-section text-ink-strong mb-[1.2rem] font-semibold tracking-[-0.02em] text-balance"
              >
                Notes
              </h2>
              <ul className="notes-list mt-[0.8em] list-[square] columns-1 gap-x-10 pl-[1.1em] sm:columns-2">
                {notes.map((note) => (
                  <li
                    key={note.slug}
                    className="marker:text-ink-soft/70 mb-[0.2rem] break-inside-avoid pl-[0.15em]"
                  >
                    <Link
                      href={`/${note.slug}`}
                      className="text-ink-soft decoration-ink-soft/30 hover:text-ink-muted underline decoration-1 underline-offset-[0.18em] transition-colors"
                    >
                      {note.meta.label ?? note.meta.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="blogs-heading" className="mt-14">
              <h2
                id="blogs-heading"
                className="font-reading text-section text-ink-strong mb-[1.2rem] font-semibold tracking-[-0.02em] text-balance"
              >
                Blogs
              </h2>
              <div className="blogs-list">
                {blogs.map((blog) => (
                  <Link
                    key={blog.slug}
                    href={`/${blog.slug}`}
                    className="border-line text-ink grid grid-cols-1 items-baseline gap-[0.15rem] border-b py-[0.72em] no-underline sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-5"
                  >
                    <span>{blog.meta.label ?? blog.meta.title}</span>
                    {blog.meta.date ? (
                      <time
                        dateTime={blog.meta.date}
                        className="font-ui text-date-sm text-ink-muted sm:text-date tracking-normal whitespace-nowrap tabular-nums"
                      >
                        {formatMonth(blog.meta.date)}
                      </time>
                    ) : null}
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>

        <aside className="home-visual content:sticky content:top-page content:block content:h-[calc(100svh-2*var(--spacing-page))] content:min-h-[min(72svh,760px)] content:overflow-hidden content:rounded-hero content:border content:border-line content:bg-surface hidden">
          <HeroScene />
        </aside>
      </div>
    </article>
  );
}
