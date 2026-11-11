import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  reactCompiler: true,
  devIndicators: false,
  transpilePackages: ['@repo/ui'],
  experimental: {
    optimizePackageImports: ['lucide-react', 'shiki', 'date-fns'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      { source: '/tabs', destination: '/lab', permanent: true },
      { source: '/tabs/:slug', destination: '/lab', permanent: true },
      { source: '/bronco', destination: '/hospital', permanent: true },
    ];
  },
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: ['remark-gfm'],
    rehypePlugins: [
      [
        'rehype-pretty-code',
        {
          theme: { dark: 'github-dark', light: 'github-light' },
          keepBackground: false,
          defaultLang: 'text',
        },
      ],
      'rehype-slug',
    ],
  },
});

export default withMDX(nextConfig);
