import { PNG } from 'pngjs';
import type { LayoutSnapshot } from './extract-layout';
import type { LayoutRecord } from './types';
import type { ParsedShot } from './parity-types';

export function crop(image: PNG, width: number, height: number): PNG {
  if (image.width === width && image.height === height) return image;
  const output = new PNG({ width, height });
  for (let y = 0; y < height; y += 1) {
    const start = y * image.width * 4;
    const end = start + width * 4;
    image.data.copy(output.data, y * width * 4, start, end);
  }
  return output;
}

export function parseShot(shot: string): ParsedShot | null {
  const match = /-(dark|light)-(\d+)(?:-viewport)?\.png$/.exec(shot);
  if (!match) return null;
  return { scheme: match[1] as ParsedShot['scheme'], width: Number(match[2]) };
}

export function compareLayout(
  reference: LayoutRecord,
  actual: LayoutSnapshot,
  heightDelta: number,
): string[] {
  const differences: string[] = [];
  if (reference.body.fontFamily !== actual.body.fontFamily) {
    differences.push(`font: ${reference.body.fontFamily} -> ${actual.body.fontFamily}`);
  }
  if (reference.body.fontSize !== actual.body.fontSize) {
    differences.push(`font-size: ${reference.body.fontSize} -> ${actual.body.fontSize}`);
  }
  if (reference.body.background !== actual.body.background) {
    differences.push(`background: ${reference.body.background} -> ${actual.body.background}`);
  }
  if (reference.body.color !== actual.body.color) {
    differences.push(`color: ${reference.body.color} -> ${actual.body.color}`);
  }
  if (reference.marginNotes.length !== actual.marginNotes.length) {
    differences.push(
      `margin notes: ${reference.marginNotes.length} -> ${actual.marginNotes.length}`,
    );
  }

  const keys = [
    '.content-frame',
    '.content-title',
    '.site-title',
    '.home-visual',
    '.notes-list',
    '.article-meta',
  ];
  for (const key of keys) {
    const before = reference.regions[key];
    const after = actual.regions[key];
    if (!before && !after) continue;
    if (!before || !after) {
      differences.push(
        `${key}: ${before ? 'present' : 'absent'} -> ${after ? 'present' : 'absent'}`,
      );
      continue;
    }
    if (before.display !== after.display) {
      differences.push(`${key} display: ${before.display} -> ${after.display}`);
    }
    if (Math.abs(before.rect.width - after.rect.width) > 2) {
      differences.push(`${key} width: ${before.rect.width} -> ${after.rect.width}`);
    }
    if (Math.abs(before.rect.x - after.rect.x) > 2) {
      differences.push(`${key} x: ${before.rect.x} -> ${after.rect.x}`);
    }
    if (Math.abs(before.rect.height - after.rect.height) > heightDelta) {
      differences.push(`${key} height: ${before.rect.height} -> ${after.rect.height}`);
    }
  }
  return differences;
}
