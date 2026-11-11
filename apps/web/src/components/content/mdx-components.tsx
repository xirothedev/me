import type { MDXComponents } from 'mdx/types';
import { Details } from './details';
import { Figure } from '../figures/figure';
import { Heading } from './heading';
import { HospitalDiagram } from './hospital-diagram';
import { MarginNote } from './margin-note';
import { MdxLink } from './mdx-link';

export const mdxComponents: MDXComponents = {
  h1: ({ id, children }) => (
    <Heading id={id} level={1}>
      {children}
    </Heading>
  ),
  h2: ({ id, children }) => (
    <Heading id={id} level={2}>
      {children}
    </Heading>
  ),
  h3: ({ id, children }) => (
    <Heading id={id} level={3}>
      {children}
    </Heading>
  ),
  p: ({ children }) => <p className="mb-[1.45rem] text-pretty">{children}</p>,
  ul: ({ children }) => <ul className="mb-[1.2rem] list-disc pl-10">{children}</ul>,
  ol: ({ children }) => <ol className="mb-[1.2rem] list-decimal pl-10">{children}</ol>,
  li: ({ children }) => <li className="mb-[0.2rem] pl-0 text-pretty">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-ink-soft/35 text-ink-muted mb-[1.6rem] border-l-2 pr-4 pl-5">
      {children}
    </blockquote>
  ),
  a: MdxLink,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em>{children}</em>,
  code: ({ children }) => (
    <code className="font-code text-code-inline text-[0.9em]">{children}</code>
  ),
  pre: ({ children }) => (
    <pre className="rounded-media bg-surface font-code mb-[1.333rem] overflow-x-auto p-4 text-[13px] leading-[1.75]">
      {children}
    </pre>
  ),
  hr: () => <hr className="bg-line my-8 h-px border-0" />,
  Heading,
  MarginNote,
  Details,
  Figure,
  HospitalDiagram,
};
