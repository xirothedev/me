import type { MDXComponents } from 'mdx/types';
import { mdxComponents } from '@/components/content/mdx-components';

export function useMDXComponents(): MDXComponents {
  return mdxComponents;
}
