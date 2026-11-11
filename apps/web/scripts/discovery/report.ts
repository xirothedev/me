import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { DiscoveryReport, PageRecord } from './types';

export async function writeReport(report: DiscoveryReport, outDir: string): Promise<void> {
  await mkdir(outDir, { recursive: true });
  await writeFile(join(outDir, 'discovery.json'), `${JSON.stringify(report, null, 2)}\n`);
  await writeFile(join(outDir, 'DISCOVERY.md'), renderMarkdown(report));
}

function renderMarkdown(report: DiscoveryReport): string {
  const lines: string[] = [];
  lines.push(`# Site discovery — ${report.baseUrl}`);
  lines.push('');
  lines.push(`Generated: ${report.generatedAt}`);
  lines.push('');
  lines.push(
    `Widths: ${report.options.widths.join(', ')}. Schemes: ${report.options.schemes.join(', ')}. Pages: ${report.pages.length}.`,
  );
  lines.push('');
  lines.push('## Routes');
  lines.push('');
  lines.push(
    '| Path | Status | Title | Images | Videos | Details | Controls | Figures | HTML KB |',
  );
  lines.push('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const page of report.pages) {
    const route = page.route;
    lines.push(
      `| \`${route.path}\` | ${route.status} | ${escape(route.title)} | ${page.media.filter((m) => m.kind === 'image').length} | ${page.media.filter((m) => m.kind === 'video').length} | ${page.details.length} | ${page.controls.length} | ${page.layout[0]?.figures.length ?? 0} | ${Math.round(page.htmlBytes / 1024)} |`,
    );
  }
  lines.push('');
  lines.push('## Redirects');
  lines.push('');
  lines.push('| From | Status | To |');
  lines.push('| --- | --- | --- |');
  for (const redirect of report.redirects) {
    lines.push(`| \`${redirect.from}\` | ${redirect.status} | ${redirect.to || '—'} |`);
  }
  lines.push('');
  lines.push('## Meta probes');
  lines.push('');
  lines.push('| Path | Status | Content type |');
  lines.push('| --- | --- | --- |');
  for (const probe of report.metaProbes) {
    lines.push(`| \`${probe.path}\` | ${probe.status} | ${probe.contentType ?? '—'} |`);
  }
  lines.push('');
  lines.push('## Design tokens');
  for (const token of report.tokens) {
    lines.push('');
    lines.push(`### ${token.scheme}`);
    lines.push('');
    lines.push('```css');
    for (const [name, value] of Object.entries(token.values)) {
      if (!isDesignToken(name) || value.length === 0) continue;
      lines.push(`${name}: ${value};`);
    }
    lines.push('```');
  }
  lines.push('');
  lines.push('## Fonts');
  lines.push('');
  for (const font of report.fonts) {
    lines.push(`- \`${font.family}\` ${font.style} ${font.weight} — ${font.src.slice(0, 160)}`);
  }
  lines.push('');
  lines.push('## Keyframes');
  lines.push('');
  lines.push(
    report.keyframes.length > 0
      ? report.keyframes.map((name) => `\`${name}\``).join(', ')
      : 'None.',
  );
  lines.push('');
  lines.push('## Responsive behaviour');
  for (const page of report.pages) {
    const shifts = responsiveShifts(page);
    if (shifts.length === 0) continue;
    lines.push('');
    lines.push(`### \`${page.route.path}\``);
    lines.push('');
    for (const shift of shifts) lines.push(`- ${shift}`);
  }
  lines.push('');
  lines.push('## Hidden and interactive features');
  for (const page of report.pages) {
    const notable = page.hidden.filter((item) => item.reason !== 'display-none');
    if (page.details.length === 0 && page.controls.length === 0 && notable.length === 0) continue;
    lines.push('');
    lines.push(`### \`${page.route.path}\``);
    lines.push('');
    if (page.controls.length > 0) {
      const pressed = page.controls.filter((control) => control.ariaPressed !== null);
      if (pressed.length > 0) {
        lines.push(
          `- Toggles: ${pressed.map((control) => `\`${control.text || control.ariaLabel}\` (${control.ariaPressed})`).join(', ')}`,
        );
      }
      const withControls = page.controls.filter((control) => control.ariaControls !== null);
      if (withControls.length > 0) {
        lines.push(
          `- Controls a region: ${withControls.map((control) => `${control.ariaControls}`).join(', ')}`,
        );
      }
    }
    if (page.details.length > 0) {
      lines.push(
        `- Collapsible sections: ${page.details.length} (first: “${page.details[0].summary}”)`,
      );
    }
    for (const item of notable.slice(0, 8)) {
      lines.push(
        `- \`${item.tag}${item.id ? `#${item.id}` : ''}\` hidden by ${item.reason}: ${item.text.slice(0, 80)}`,
      );
    }
  }
  lines.push('');
  lines.push('## Animation and cursors');
  lines.push('');
  for (const page of report.pages) {
    if (page.animations.length === 0 && page.cursors.length === 0) continue;
    lines.push(`### \`${page.route.path}\``);
    lines.push('');
    for (const animation of page.animations.slice(0, 12)) {
      lines.push(
        `- ${animation.name !== 'none' ? `animation \`${animation.name}\`` : 'transition'} ${animation.duration} — \`${animation.selector}\``,
      );
    }
    for (const cursor of page.cursors) {
      lines.push(`- cursor ${cursor.cursor.slice(0, 100)} — \`${cursor.selector}\``);
    }
    lines.push('');
  }
  lines.push('## Probes');
  for (const page of report.pages) {
    if (page.probes.length === 0) continue;
    lines.push('');
    lines.push(`### \`${page.route.path}\``);
    lines.push('');
    for (const probe of page.probes) {
      lines.push(`- ${probe.ok ? 'PASS' : 'FAIL'} **${probe.name}** — ${probe.details}`);
      for (const change of probe.changes.slice(0, 8)) lines.push(`  - ${change}`);
    }
  }
  lines.push('');
  lines.push('## Anomalies');
  lines.push('');
  for (const anomaly of report.anomalies) lines.push(`- ${anomaly}`);
  lines.push('');
  lines.push('## Screenshots');
  lines.push('');
  for (const page of report.pages) {
    if (page.screenshots.length === 0) continue;
    lines.push(
      `- \`${page.route.path}\`: ${page.screenshots.map((shot) => `\`${shot}\``).join(', ')}`,
    );
  }
  lines.push('');
  return lines.join('\n');
}

function responsiveShifts(page: PageRecord): string[] {
  const shifts: string[] = [];
  const layouts = page.layout;
  if (layouts.length < 2) return shifts;
  const keys = new Set<string>();
  for (const layout of layouts) {
    for (const key of Object.keys(layout.regions)) keys.add(key);
  }
  for (const key of keys) {
    const values = layouts.map((layout) => {
      const region = layout.regions[key];
      return region
        ? `${region.display}/${region.position} ${region.rect.width}×${region.rect.height}`
        : 'absent';
    });
    if (new Set(values).size > 1) {
      shifts.push(`\`${key}\`: ${values.join(' → ')}`);
    }
  }
  const noteCounts = layouts.map((layout) => layout.marginNotes.length);
  const figures = layouts.map((layout) => layout.figures.length);
  if (new Set(noteCounts).size > 1) shifts.push(`margin notes: ${noteCounts.join(' → ')}`);
  if (new Set(figures).size > 1) shifts.push(`figures: ${figures.join(' → ')}`);
  return shifts;
}

function escape(value: string): string {
  return value.replace(/\|/g, '\\|').slice(0, 120);
}

function isDesignToken(name: string): boolean {
  return /^--(bg|divider|text-(copy|heading|nav|nav-hover|secondary)|surface-subtle|code-(background|inline)|font-(reading|ui|caveat)|sh-(class|sign|string|keyword|comment|jsxliterals|property|entity))$/.test(
    name,
  );
}
