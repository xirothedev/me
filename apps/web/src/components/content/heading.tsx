import type { ReactNode } from 'react';

interface HeadingProps {
  id?: string;
  level?: 1 | 2 | 3;
  children: ReactNode;
}

export function Heading({ id, level = 2, children }: HeadingProps) {
  if (level === 1) {
    return (
      <h1
        id={id}
        className="font-reading text-title-sm text-ink-strong sm:text-title mb-[0.6em] scroll-mt-24 font-semibold tracking-[-0.02em] text-balance"
      >
        {children}
      </h1>
    );
  }

  const Tag = level === 2 ? 'h2' : 'h3';
  return (
    <Tag
      id={id}
      className="font-reading text-section text-ink-strong mt-[3.1rem] mb-[1.2rem] scroll-mt-24 font-semibold tracking-[-0.02em] text-balance"
    >
      {children}
    </Tag>
  );
}
