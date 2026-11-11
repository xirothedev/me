import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const sourceRoot = new URL('../apps/web/src', import.meta.url).pathname;
const write = process.argv.includes('--write');
const darkToken = /(^|\s)dark:[^\s"'`]+/g;

function filesIn(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return filesIn(path);
    return entry.isFile() && entry.name.endsWith('.tsx') ? [path] : [];
  });
}

let total = 0;
const touched: string[] = [];

for (const file of filesIn(sourceRoot)) {
  const source = readFileSync(file, 'utf8');
  const count = source.match(/dark:/g)?.length ?? 0;
  if (count === 0) continue;

  total += count;
  touched.push(`${relative(sourceRoot, file)} (${count})`);

  if (!write) continue;

  const next = source.replace(darkToken, '$1');
  if (next.includes('dark:')) {
    throw new Error(`Dark variant left in ${file}`);
  }
  writeFileSync(file, next);
}

if (total === 0) {
  process.stdout.write('No dark variants found.\n');
  process.exit(0);
}

process.stdout.write(
  `${write ? 'Removed' : 'Found'} ${total} dark variants in ${touched.length} files:\n`,
);
for (const file of touched) process.stdout.write(`  ${file}\n`);

if (!write) {
  process.stderr.write('Run with --write to remove them.\n');
  process.exit(1);
}
