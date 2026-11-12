import type { ReactNode } from 'react';

interface DetailsProps {
  summary: string;
  children: ReactNode;
}

export function Details({ summary, children }: DetailsProps) {
  return (
    <details className="group my-[1.6em]">
      <summary className="font-ui text-meta text-ink-soft hover:text-ink flex cursor-pointer list-none items-center gap-[0.55rem] tracking-normal transition-colors [&::-webkit-details-marker]:hidden">
        <span
          aria-hidden="true"
          className="size-[7px] shrink-0 rotate-0 bg-current transition-transform [clip-path:polygon(0_0,100%_50%,0_100%)] group-open:rotate-90"
        />
        {summary}
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}
