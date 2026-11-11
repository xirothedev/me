# Design system

The site is a quiet, typographic personal site. The reading column is 600 px. Surfaces are flat. Hierarchy comes from type, space, and a single hairline divider, not from cards or shadows.

`AGENTS.md` points here. `GLOSSARY.md` defines the domain terms.

## 1. Aesthetic direction

- Warm paper `#f7f3ea` or deep green-black `#121815` canvas. No gradients except the Viewer backdrop.
- Serif reading face. System sans for UI labels. Monospace for code and tool output.
- One accent: deep green `#1f5c45` for focus and links. Everything else is ink on canvas.
- Thin rules (`1px`, 10% ink) separate list rows. No boxes around content.
- Motion is subtle: link colour and underline fade, gallery lifts, the Nha Trang hero drifts and sways on hover.

## 2. Tokens

Defined in `apps/web/src/app/globals.css` under `@theme inline`. Use utilities, never raw hex in app code. The hero image and the OG image are illustrations and may use raw values.

| Token         | Light     | Dark      |
| ------------- | --------- | --------- |
| `canvas`      | `#f7f3ea` | `#121815` |
| `ink`         | `#1f2a24` | `#e6e1d6` |
| `ink-strong`  | `#16201b` | `#f4efe4` |
| `ink-muted`   | `#4b5a51` | `#c2bcb0` |
| `ink-soft`    | `#5c6860` | `#9aa39b` |
| `surface`     | `#efe9dc` | `#1b2420` |
| `line`        | `#ddd5c4` | `#33403a` |
| `code-inline` | `#9a3f2f` | `#e08a72` |
| `focus`       | `#1f5c45` | `#7fc2a3` |

Fonts:

- `font-reading` — Iowan Old Style, then Palatino, Georgia, serif. No webfont download.
- `font-ui` — system UI stack.
- `font-code` — SF Mono, Monaco, Inconsolata, Fira Code, monospace.

Type scale:

| Token          | Size            | Use                                        |
| -------------- | --------------- | ------------------------------------------ |
| `text-title`   | 1.875rem        | Article and page title (2rem below 640 px) |
| `text-section` | 1.45rem         | h2                                         |
| `text-body`    | 1.0625rem / 1.6 | Body                                       |
| `text-date`    | 0.875rem        | Blog dates                                 |
| `text-meta`    | 0.8125rem       | Author line, UI labels                     |
| `text-note`    | 0.8125rem       | Margin notes, footnotes                    |

Layout:

- `max-w-content` — 37.5rem (600 px) reading column.
- `max-w-home` — 93.75rem (1500 px) home grid.
- `px-page` / `py-page` — `clamp(1.25rem, 3.4vw, 3.25rem)`.
- Breakpoints: `content` 68.75rem (1100 px), `wide` 87.5rem (1400 px). Tailwind defaults remain for `sm`, `md`, `lg`.

## 3. Primitives

| Primitive         | Role                                                                     |
| ----------------- | ------------------------------------------------------------------------ |
| `SiteShell`       | Full-width page padding and container query root                         |
| `PageTitle`       | Serif title, optional subtitle line                                      |
| `ArticleMeta`     | 20 px grayscale avatar, date, author                                     |
| `MarginNote`      | Inline note below `wide`; 240 px gutter note at `wide`                   |
| `BlogRow`         | Title + date row with hairline divider                                   |
| `NoteList`        | Two-column square-bullet list                                            |
| `WorkList`        | Five work rows: name, kind, summary, meta                                |
| `Viewer`          | Native `<dialog>` image viewer with close, next, previous, Escape, swipe |
| `Gallery`         | Image set that opens the Viewer                                          |
| `FigureFrame`     | Label, caption, progress dots, play/pause, 0.5×/1×/2×                    |
| `HospitalDiagram` | Four-step hospital network diagram                                       |
| `Tuner`           | Microphone pitch display: note, octave, cents, Hz, needle                |
| `TokenEstimator`  | Rough token count and input cost                                         |
| `ContrastChecker` | WCAG ratio with AA and AAA results                                       |
| `Icon`            | `@repo/ui` icon with a concept key                                       |

Component names describe the domain role, never the order (`work-list`, not `rows-1`).

### Hero scene

The Home hero is one WebP drawn as an SVG scene. A **plane** is a full-canvas copy masked to a region: ocean, park, or city and road. A **palm** is a masked copy rotated about its canopy. A **mask** is a blurred vector shape, so the seam never shows. The base image is never redrawn or recoloured. Three planes, five palms, foam, and sparkle move.

## 4. Icon vocabulary

All functional icons come from `@repo/ui`:

```tsx
import { ICON, Icon } from "@repo/ui";

<Icon icon={ICON.play} label="Play" />;
```

Keys: `play`, `pause`, `close`, `next`, `previous`, `external`, `mail`, `music`, `rss`, `bot`, `dice`. No inline SVG, no Unicode glyphs, no icon package imports in app code. Decorative brand marks use the favicon or an image, not an icon.

## 5. Responsive rules

- `< 640px`: page padding 1.25rem, title 2rem, Notes list one column, blog date under the title, even gallery images offset 1.5rem.
- `640–1099px`: Notes list two columns, blog title and date on one row.
- `≥ 1100px`: home becomes two columns; the hero is sticky on the right.
- `≥ 1400px`: the hero column grows so more of the ocean and city stay in frame.
- `< 1400px`: margin notes flow inline after the paragraph.
- `≥ 1400px`: margin notes sit in the 240 px right gutter.
- 100% keyboard reachability at every width. No horizontal scroll except code blocks and media strips, which own their scroll container.

## 6. Motion

- The hero uses registered CSS properties `--hero-wind`, `--hero-tide`, `--hero-sway`, and `--hero-gust`. The ocean tide advances 6 px at rest and 18 px on hover; the park drifts 3/9 px and the city 1.5/4.5 px. Palms sway 0.6° at rest and 3° on hover. `prefers-reduced-motion` shows the untouched base image.
- 160–300 ms colour, underline, and opacity transitions for links and rows.
- No page-enter animations. No scroll-triggered reveals.
- Figures pause under reduced motion and expose play/pause.

## 7. User-facing copy

| Internal term    | Displayed copy            |
| ---------------- | ------------------------- |
| Home             | (no label)                |
| Work entry       | Work                      |
| Note             | Notes                     |
| Blog             | Blogs                     |
| Case study       | Case study                |
| Lab              | Lab                       |
| Tuner            | Tuner / Stop Tuner        |
| Token estimator  | Tokens                    |
| Contrast checker | Contrast                  |
| Bio mode Default | Default                   |
| Bio mode Long    | Long                      |
| Margin note      | (numbered note)           |
| Gallery          | (no label)                |
| Viewer           | Image gallery modal       |
| Credit           | Inspired by @leerob on X. |

Copy is sentence case. No machinery words (`MDX`, `API`, `component`) in user-facing text. Dates use `Month YYYY`.

## 8. Content changes

The site is not a clone. To change the content:

1. Edit `apps/web/src/lib/site-config.ts` for identity, links, and the credit.
2. Edit `apps/web/content/` for Notes, Blogs, the Hospital case study, the Home bios, and Bookmarks.
3. Edit `apps/web/src/lib/work.ts` for the Home work rows.
4. Replace `apps/web/public/avatar.webp` with the final headshot.
5. Keep the `credit` entry pointing at the original design while the reading layout derives from it.
6. Run `bun fmt --check`, `bun lint`, `bun check`, `bun test`, and `bun build`.

The copy gate is in `docs/plans/content-brief.md`. Every claim must trace to a verified source, and an independent reviewer must score the piece at 2 or lower before it ships.
