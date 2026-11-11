import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { siteConfig } from '@/lib/site-config';
import './globals.css';

const person = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: siteConfig.name,
  url: siteConfig.url,
  image: `${siteConfig.url}${siteConfig.avatar}`,
  description: siteConfig.description,
  email: siteConfig.email,
  jobTitle: siteConfig.jobTitle,
  worksFor: {
    '@type': 'Organization',
    name: siteConfig.worksFor,
  },
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: siteConfig.alumniOf,
  },
  sameAs: Object.values(siteConfig.socials),
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: ['/opengraph-image'],
    creator: siteConfig.handle,
  },
  icons: { icon: '/favicon.svg' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f3ea' },
    { media: '(prefers-color-scheme: dark)', color: '#121815' },
  ],
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-reading text-body antialiased">
        <a
          href="#main"
          className="focus:bg-ink focus:text-canvas sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-sm focus:px-3 focus:py-2"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <div className="site-shell px-page sm:py-page [container-type:inline-size] relative min-h-screen w-full pt-10 pb-5">
            <main id="main">{children}</main>
            <footer className="site-footer max-w-content border-line mt-16 w-full border-t pt-4">
              <div className="font-ui text-meta text-ink-soft flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p>
                  {siteConfig.credit.text}{' '}
                  <a
                    href={siteConfig.credit.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="decoration-ink-soft/30 hover:text-ink-muted underline decoration-1 underline-offset-[0.18em] transition-colors"
                  >
                    {siteConfig.credit.handle}
                  </a>{' '}
                  {siteConfig.credit.suffix}.
                </p>
                <p>© 2026 {siteConfig.name}.</p>
              </div>
            </footer>
          </div>
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
        />
      </body>
    </html>
  );
}
