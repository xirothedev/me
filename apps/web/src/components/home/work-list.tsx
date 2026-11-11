import Link from 'next/link';
import { ICON, Icon } from '@repo/ui';
import { work } from '@/lib/work';

export function WorkList() {
  return (
    <section aria-labelledby="work-heading" className="mt-12">
      <h2
        id="work-heading"
        className="font-reading text-section text-ink-strong mb-[1.2rem] font-semibold tracking-[-0.02em] text-balance"
      >
        Work
      </h2>
      <div>
        {work.map((entry) => {
          const body = (
            <>
              <span className="min-w-0">
                <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="font-reading text-ink-strong text-[1.05rem] font-semibold">
                    {entry.name}
                  </span>
                  <span className="font-ui text-meta text-ink-soft">{entry.kind}</span>
                </span>
                <span className="text-ink-muted mt-1 block text-[0.95rem] leading-[1.5] text-pretty">
                  {entry.summary}
                </span>
              </span>
              <span className="font-ui text-meta text-ink-soft flex items-center gap-1 whitespace-nowrap sm:justify-self-end">
                {entry.meta}
                {entry.external ? <Icon icon={ICON.external} size="xs" /> : null}
              </span>
            </>
          );

          const className =
            'border-line grid grid-cols-1 items-baseline gap-1 border-b py-[0.85em] no-underline transition-opacity sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-6';

          if (entry.href && entry.external) {
            return (
              <a
                key={entry.name}
                href={entry.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${className} text-ink opacity-85 hover:opacity-100`}
              >
                {body}
              </a>
            );
          }

          if (entry.href) {
            return (
              <Link
                key={entry.name}
                href={entry.href}
                className={`${className} text-ink opacity-85 hover:opacity-100`}
              >
                {body}
              </Link>
            );
          }

          return (
            <div key={entry.name} className={className}>
              {body}
            </div>
          );
        })}
      </div>
    </section>
  );
}
