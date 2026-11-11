# Design system

The site is a quiet, typographic personal site. The reading column is 600 px. Surfaces are flat. Hierarchy comes from type, space, and a single hairline divider, not from cards or shadows.

`AGENTS.md` points here. `GLOSSARY.md` defines the domain terms.

## 1. Aesthetic direction

- Near-black `#1b1a19` or white `#ffffff` canvas, no gradients except the Viewer backdrop.
- Serif reading face. System sans for UI labels. Monospace for code and chord sheets.
- One accent: inline code and the focus ring. Everything else is ink on canvas.
- Thin rules (`1px`, 10% ink) separate list rows. No boxes around content.
- Motion is subtle: link colour and underline fade, gallery lifts, painting sways on hover.

## 2. Tokens

Defined in `apps/web/src/app/globals.css` under `@theme inline`. Use utilities, never raw hex in app code.

| Token         | Light     | Dark      |
| ------------- | --------- | --------- |
| `canvas`      | `#ffffff` | `#1b1a19` |
| `ink`         | `#282828` | `#e8e5df` |
| `ink-strong`  | `#282828` | `#f4f1eb` |
| `ink-muted`   | `#504945` | `#cbc6be` |
| `ink-soft`    | `#676767` | `#aaa59e` |
| `surface`     | `#f3f3f2` | `#242321` |
| `line`        | `#e2e2df` | `#3b3936` |
| `code-inline` | `#ad2111` | `#e06c5f` |
| `focus`       | `#6657c8` | `#8f83e8` |

Fonts:

- `font-reading` — Iowan Old Style, then Palatino, Georgia, serif. No webfont download.
- `font-ui` — system UI stack.
- `font-code` — SF Mono, Monaco, Inconsolata, Fira Code, monospace.
- `font-caveat` — local Caveat woff2, only for painting annotations.

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

| Primitive     | Role                                                                     |
| ------------- | ------------------------------------------------------------------------ |
| `SiteShell`   | Full-width page padding and container query root                         |
| `PageTitle`   | Serif title, optional artist/subtitle line                               |
| `ArticleMeta` | 20 px grayscale avatar, date, author                                     |
| `MarginNote`  | Inline note below `wide`; 240 px gutter note at `wide`                   |
| `BlogRow`     | Title + date row with hairline divider                                   |
| `NoteList`    | Two-column square-bullet list                                            |
| `Viewer`      | Native `<dialog>` image viewer with close, next, previous, Escape, swipe |
| `Gallery`     | Image set that opens the Viewer                                          |
| `FigureFrame` | Label, caption, progress dots, play/pause, 0.5×/1×/2×                    |
| `TabSheet`    | Monospace chord chart with chord chips                                   |
| `Tuner`       | Microphone pitch display: note, octave, cents, Hz, needle                |
| `Icon`        | `@repo/ui` icon with a concept key                                       |

Component names describe the domain role, never the order (`bio-modes`, not `tabs-1`).

## 4. Icon vocabulary

All functional icons come from `@repo/ui`:

```tsx
import { ICON, Icon } from "@repo/ui";

<Icon icon={ICON.play} label="Play" />;
```

Keys: `play`, `pause`, `close`, `next`, `previous`, `external`, `mail`, `music`, `rss`. No inline SVG, no Unicode glyphs, no icon package imports in app code. Decorative brand marks use the favicon or an image, not an icon.

## 5. Responsive rules

- `< 640px`: page padding 1.25rem, title 2rem, Notes list one column, blog date under the title, even gallery images offset 1.5rem.
- `640–1099px`: Notes list two columns, blog title and date on one row.
- `≥ 1100px`: home becomes two columns; the painting is sticky on the right.
- `< 1400px`: margin notes flow inline after the paragraph.
- `≥ 1400px`: margin notes sit in the 240 px right gutter.
- 100% keyboard reachability at every width. No horizontal scroll except code blocks and media strips, which own their scroll container.

## 6. Motion

- CSS keyframes for the painting (`painting-drift`, `painting-gust`). Respect `prefers-reduced-motion`.
- 160–300 ms colour, underline, and opacity transitions for links and rows.
- No page-enter animations. No scroll-triggered reveals.
- Figures pause under reduced motion and expose play/pause.

## 7. User-facing copy

| Internal term    | Displayed copy            |
| ---------------- | ------------------------- |
| Home             | (no label)                |
| Note             | Notes                     |
| Blog             | Blogs                     |
| Tab sheet        | Tabs                      |
| Tuner            | Tuner / Stop Tuner        |
| Bio mode Default | Default                   |
| Bio mode Long    | Long                      |
| Margin note      | (numbered note)           |
| Gallery          | (no label)                |
| Viewer           | Image gallery modal       |
| Credit           | Inspired by @leerob on X. |

Copy is sentence case. No machinery words (`MDX`, `API`, `component`) in user-facing text. Dates use `Month YYYY`.

## 8. Content swap

To replace the reference content:

1. Replace `apps/web/src/lib/site-config.ts`.
2. Replace `apps/web/content/` (Notes, Blogs, Tabs, bios).
3. Replace `apps/web/public/media/` and `apps/web/public/avatar.webp`.
4. Run `bun run discover -- --base-url <new site>` only if you want a new reference. Otherwise run `bun run parity` against the existing reference until the design is stable, then delete the reference.
5. Update the Term table above if your vocabulary differs.
6. Keep the `credit` entry in `site-config.ts` pointing at the original design, or remove the footer when the design no longer derives from it.
