declare module '*.mdx' {
  import type { MDXProps } from 'mdx/types';
  import type { JSX } from 'react';
  import type { ContentMeta } from '@/content/schema';

  export const meta: ContentMeta;
  const MDXContent: (props: MDXProps) => JSX.Element;
  export default MDXContent;
}
