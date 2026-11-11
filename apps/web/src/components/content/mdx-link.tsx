import Link from 'next/link';
import type { AnchorHTMLAttributes, ReactNode } from 'react';

interface MdxLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
  children: ReactNode;
}

const LINK_CLASS =
  'underline decoration-ink-soft/30 decoration-1 underline-offset-[0.18em] transition-colors hover:text-ink-muted hover:decoration-ink-muted/30';

export function MdxLink({ href, children, ...props }: MdxLinkProps) {
  if (!href) return <>{children}</>;

  if (href === '/cursor' || href === '/vercel') {
    const cursorClass = href === '/cursor' ? 'home-cursor-link' : 'home-vercel-link';
    return (
      <Link href={href} className={`${LINK_CLASS} ${cursorClass}`} {...props}>
        {children}
      </Link>
    );
  }

  if (href.startsWith('http') || href.startsWith('mailto:')) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={LINK_CLASS} {...props}>
        {children}
      </a>
    );
  }

  if (href.startsWith('#')) {
    return (
      <a href={href} className={LINK_CLASS} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={LINK_CLASS} {...props}>
      {children}
    </Link>
  );
}
