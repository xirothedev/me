import type { ColorScheme } from './types';

const ASSET_EXTENSION =
  /\.(png|jpe?g|webp|avif|gif|svg|ico|css|js|mjs|json|xml|txt|mp4|webm|mov|pdf|zip|woff2?|ttf)$/i;

export function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

export function uniqueRequests(
  values: { url: string; status: number | null }[],
): { url: string; status: number | null }[] {
  const seen = new Set<string>();
  return values.filter((value) => {
    const key = `${value.status ?? 'fail'}:${value.url}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function normalizePath(input: string, origin: string): string | null {
  try {
    const url = new URL(input, origin);
    if (url.origin !== origin) return null;
    if (!/^https?:$/.test(url.protocol)) return null;
    if (url.pathname === '/.') return '/';
    if (/^\/(_next|_vercel|api)\//.test(url.pathname)) return null;
    if (ASSET_EXTENSION.test(url.pathname)) return null;
    return url.pathname.replace(/\/+$/, '') || '/';
  } catch {
    return null;
  }
}

export function parseSitemap(body: string, origin: string): string[] {
  const paths: string[] = [];
  for (const match of body.matchAll(/<loc>(.*?)<\/loc>/g)) {
    const path = normalizePath(decodeXml(match[1]), origin);
    if (path) paths.push(path);
  }
  return unique(paths);
}

export function slugOf(path: string): string {
  if (path === '/') return 'home';
  return path.replace(/^\//, '').replace(/\//g, '-');
}

export function decodeXml(value: string): string {
  return value.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

export function isKnownError(error: string): boolean {
  return (
    error.includes('/_vercel/insights/script.js') ||
    error.includes('net::ERR_BLOCKED_BY_CLIENT') ||
    error.includes('Permissions-Policy')
  );
}

export function isColorScheme(value: string): value is ColorScheme {
  return value === 'dark' || value === 'light';
}

export function progress(message: string): void {
  process.stdout.write(`${message}\n`);
}
