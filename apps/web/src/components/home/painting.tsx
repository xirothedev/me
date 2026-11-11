import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const layers = readFileSync(
  join(process.cwd(), 'src/components/home/painting-layers.html'),
  'utf8',
);

export function Painting() {
  return (
    <div
      className="home-painting"
      role="img"
      aria-label="A colorful, hand-painted illustration with textured brushstrokes blending the San Francisco skyline into the Des Moines skyline and rolling Iowa fields."
      dangerouslySetInnerHTML={{ __html: layers }}
    />
  );
}
