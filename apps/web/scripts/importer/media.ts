import { readFile } from 'node:fs/promises';

interface ManifestEntry {
  src: string;
  originPath: string;
  localPath: string;
  width: number;
  height: number;
}

interface Manifest {
  entries: ManifestEntry[];
}

export interface LocalMedia {
  localPath: string;
  width: number;
  height: number;
}

export type MediaLookup = (src: string) => LocalMedia | null;

export async function loadMediaManifest(path: string): Promise<MediaLookup> {
  const manifest = JSON.parse(await readFile(path, 'utf8')) as Manifest;
  const byOrigin = new Map<string, LocalMedia>();
  const bySrc = new Map<string, LocalMedia>();
  for (const entry of manifest.entries) {
    const local = {
      localPath: entry.localPath,
      width: entry.width,
      height: entry.height,
    };
    byOrigin.set(entry.originPath, local);
    bySrc.set(entry.src, local);
  }

  return (src: string): LocalMedia | null => {
    if (src.startsWith('data:')) return null;
    const decoded = src.replace(/&amp;/g, '&');
    const absolute = new URL(decoded, 'https://leerob.com');
    if (absolute.pathname === '/_next/image') {
      const inner = absolute.searchParams.get('url');
      if (inner) {
        const innerUrl = new URL(inner, 'https://leerob.com');
        const match =
          byOrigin.get(inner) ??
          byOrigin.get(innerUrl.pathname) ??
          bySrc.get(inner) ??
          bySrc.get(innerUrl.href);
        if (match) return match;
      }
    }
    return (
      byOrigin.get(`${absolute.pathname}${absolute.search}`) ??
      byOrigin.get(absolute.pathname) ??
      bySrc.get(decoded) ??
      bySrc.get(absolute.href) ??
      null
    );
  };
}
