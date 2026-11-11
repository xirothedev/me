# leerob.com clone — build plan

Status: approved 2026-11-11. Phases 0–3 implemented. Phase 4 in progress.

## Current state

- 47 live routes exist, plus sitemap, robots, OG image, and 404.
- All 24 Tab sheets and the microphone Tuner work.
- All seven AI Figures render with play/pause, speed, captions, and progress dots.
- Bookmarks parity is 0.01–0.02%. Home light 1440 passes at 0.36%.
- Articles sit at 1–3%, `/ai` at 3.2% (1440), `/vercel` at 16%. The remaining `/vercel` gap is the polaroid photo treatment.
- `bun fmt`, `bun lint`, `bun check`, `bun test`, and `bun build` pass.
Reference dossier: `docs/reference/leerob/README.md`.
Domain terms: `GLOSSARY.md`.

## 1. Decisions

| #   | Decision          | Choice                                                                                 |
| --- | ----------------- | -------------------------------------------------------------------------------------- |
| 1   | Content           | Exact replica first. Replace copy, identity, and photos later.                         |
| 2   | Fidelity          | Full parity, including all seven interactive Figures and the Tuner.                    |
| 3   | Destination       | Replace `apps/web`.                                                                    |
| 4   | Content model     | MDX for Notes and Blogs; JSON for Tab sheets. Typed, validated metadata.               |
| 5   | Discovery         | Committed Playwright script; also the parity harness.                                  |
| 6   | Styling           | Tailwind v4 utilities and tokens. CSS only for fonts, keyframes, selection, scrollbar. |
| 7   | Media             | Vendor optimized images; hotlink videos; commit the clone.                             |
| 8   | Deployment        | Local only until the content is replaced.                                              |
| 9   | Figure acceptance | Behaviour and visual parity; minor pixel differences allowed.                          |
| 10  | Import            | Scripted HTML-to-MDX import, then hand-fix the six special pages.                      |
| 11  | Components        | App-local. Promote to a package only on a second consumer.                             |
| 12  | Phase order       | Harness → foundation → special pages → Figures → QA.                                   |
| 13  | Fonts             | Match the source: local Iowan Old Style, no webfont download.                          |

`packages/ui` gets one narrow exception: the mandatory icon vocabulary (`rules/frontend.md` #17). It gets a root entry point with `Icon` and `ICON`. Site components stay app-local.

## 2. Architecture

```txt
apps/web/
  content/
    notes/*.mdx            10 Notes
    blogs/*.mdx            8 Blogs
    tabs/*.json            24 Tab sheets
    pages/*.mdx            Bronco, Bookmarks body
    home/bio-default.mdx
    home/bio-long.mdx
    registry.ts            imports, validates, sorts
  public/
    avatar.webp
    media/<page>/*.webp    optimized, committed
    logos/*.svg            cursors
  scripts/
    discover-site.ts       CLI
    discovery/*.ts         browser, extract, report, probes
    fetch-media.ts         download + resize + convert
    import-content.ts      HTML → MDX (temporary)
    parity.ts              clone vs reference
  src/
    app/
      layout.tsx
      page.tsx             Home
      [slug]/page.tsx      Note + Blog
      tabs/page.tsx        Tab index
      tabs/[slug]/page.tsx Tab sheet + Tuner
      bronco/page.tsx
      bookmarks/page.tsx
      not-found.tsx
      sitemap.ts
      robots.ts
      opengraph-image.tsx
      globals.css
    components/
      site/                shell, title, article meta, margin note
      home/                bio, bio toggle, painting, index
      content/             MDX map, images, video, toc, gallery, viewer
      figures/             frame, clock, one file per Figure
    content/               schema, loader
    lib/                   site config, route registry, format
    types/mdx.d.ts
  tests/
    unit/*.test.ts
    e2e/*.spec.ts
    visual/*.spec.ts
  playwright.config.ts
```

No route group barrels. Imports go to the file. Every component file stays under 300 formatted lines.

## 3. Content model

MDX modules export a typed metadata object:

```mdx
import type { ContentMeta } from '@content/schema';

export const meta = {
  title: 'Things I Believe',
  description: 'Short summary for cards, metadata, and feeds.',
  kind: 'note',
  order: 1,
} satisfies ContentMeta;
```

- `ContentMeta` is a zod schema. `registry.ts` validates every module at import time and fails the build on a bad field.
- `kind`: `note` or `blog`. Blogs carry `date` (`YYYY-MM`); Notes carry `order`.
- Tab sheets are JSON: `{ slug, title, artist, text }`. The route `/tabs/[slug]` parses chord lines and renders chord chips; the Tuner is a client island.
- `registry.ts` is the single route source. Home lists and `generateStaticParams` read from it.
- Special pages (`/bronco`, `/bookmarks`, `/tabs`) are TSX pages with their own layout. `/docs` stays a Note.
- Home identity lives in `src/lib/site-config.ts`: name, handle, email, socials, avatar, description. Swapping to your content is one config file plus `content/`.
- Videos stay remote. Images are local WebP, sized to at most 2× their largest rendered width, capped at 2048 px.

## 4. Design system

- `globals.css` holds `@import 'tailwindcss'`, `@source`, `@font-face` local stacks, `@theme inline` tokens, `@keyframes`, `::selection`, and scrollbar rules.
- Tokens: `canvas`, `ink`, `ink-strong`, `ink-muted`, `ink-soft`, `surface`, `line`, `code-inline`, plus `font-reading`, `font-ui`, `font-code`.
- Custom breakpoints: `content` = 68.75rem (1100 px), `wide` = 87.5rem (1400 px).
- Tokens: `--container-content` 37.5rem, `--container-home` 93.75rem, `--spacing-page` `clamp(1.25rem, 3.4vw, 3.25rem)`.
- Text: body 1.0625rem/1.6, title 1.875rem (2rem below 640 px), heading 1.45rem, meta 0.8125rem, date 0.875rem.
- `DESIGN.md` records tokens, primitives, icon keys, responsive rules, and the copy term table. `AGENTS.md` points to it.
- Icons: `lucide-react` in `packages/ui` only. Keys name concepts (`ICON.play`, `ICON.pause`, `ICON.close`, `ICON.next`, `ICON.previous`, `ICON.external`, `ICON.mail`). No Unicode glyphs, no inline SVG in app code.
- Viewer uses native `<dialog>` with `showModal()` for focus trapping. Documented exception to the shadcn primitive baseline: one overlay, no Radix dependency.

## 5. Page and feature map

| Route         | Layout                            | Islands                                        |
| ------------- | --------------------------------- | ---------------------------------------------- |
| `/`           | Home: bio, Notes, Blogs, painting | Bio toggle, Viewer                             |
| 10 Notes      | Article                           | Viewer when a Gallery exists; Figures on `/ai` |
| 8 Blogs       | Article                           | Viewer when a Gallery exists                   |
| `/bronco`     | Photo essay, 2-up at `md`         | Viewer                                         |
| `/bookmarks`  | Grouped link list with favicons   | None                                           |
| `/tabs`       | Song index, serif list            | None                                           |
| 24 Tab sheets | Monospace chord sheet             | Tuner (microphone pitch detection)             |
| 404           | Minimal message                   | None                                           |

Shared Article features: title, author line (avatar + date + name), body, Margin notes (gutter at `wide`, inline below), code highlighting, `<details>`, external links, hr, tables.

Tab sheet features: back link, title, artist subtitle, Tuner button, monospace chord chart with chord chips. The Tuner shows the nearest note, octave, cents, frequency, and a needle track; it requests microphone access only after the button is pressed.

## 6. Phases

### Phase 0 — Reference and harness

- Read Next.js 16 docs for MDX, images, metadata, fonts, lazy loading, static rendering.
- Add `playwright-core`, `pixelmatch`, `pngjs`, `@axe-core/playwright` as dev dependencies.
- `discover-site.ts`: crawl sitemap and internal links; capture metadata, DOM features, layout metrics, animations, media, hidden elements, responsive shifts, redirects, and dead routes; write JSON + Markdown + screenshots at 390/768/1440, dark and light for Home.
- `parity.ts`: screenshot and DOM-metrics diff against the reference.
- `fetch-media.ts`: download, resize, convert to WebP.
- Fix the root lint/format/typecheck commands if Bun 1.4.4 lacks `--no-script`.
- Gate: discovery report is complete and reproducible; every live page returns 200; dead sitemap routes are recorded and excluded.

### Phase 1 — Foundation

- `site-config`, route registry, zod content schema, MDX loader.
- `globals.css` tokens, font stacks, keyframes.
- Root layout: theme script, metadata, skip link.
- Article layout, MDX component map, Margin notes, code highlighting.
- Home: bio modes, Notes/Blogs index, painting, Viewer.
- Import 16 ordinary pages; hand-fix Home bios.
- `DESIGN.md` and `AGENTS.md` pointer.
- Gate: Home + 18 Note/Blog pages match reference at 3 widths, light and dark; no console errors.

### Phase 2 — Special pages

- `/vercel`: vintage photo strips.
- `/bronco`: 2-up photo essay.
- `/bookmarks`: 76 favicons, five groups, link to `/tabs`.
- `/docs`: TOC, 7 lazy videos, full-bleed media.
- `/tabs`: song index and 24 Tab sheets.
- Tuner: Web Audio pitch detection, note/octave/cents/Hz display, needle, start/stop, mic permission, cleanup on unmount.
- Import fixes for long bios and galleries.
- Gate: all 47 routes present; media layout parity; Viewer works with keyboard and swipe; Tuner works with a fake microphone device.

### Phase 3 — Figures

- Reverse-engineer each Figure from the reference DOM and the 188 KB chunk.
- Shared `FigureFrame` (label, caption, dots, play/pause, speed) and `useFigureClock`.
- One component per Figure, each under 300 lines, pure state functions unit-tested.
- `next/dynamic` islands with static fallback for first paint.
- Reduced motion starts paused.
- Gate: all seven Figures match copy, states, timing, and controls; keyboard operable; no layout shift.

### Phase 4 — Quality and optimization

- Run `modern-web-guidance` for HTML/CSS/client JS patterns.
- Run `vercel-react-best-practices` and `next-bundle-optimizer` on the result.
- Run `web-design-guidelines` and `building-components` review.
- Lighthouse via Chrome DevTools MCP: 99+ Performance, 100 Accessibility, 100 Best Practices, 100 SEO on Home, an Article, and `/ai`.
- Bundle budgets, image sizes audit, video lazy-load audit, SVG size audit.
- Full accessibility pass: axe, focus order, contrast, reduced motion, screen-reader labels.
- Gate: `bun fmt --check`, lint, typecheck, unit tests, e2e, visual parity, build all green.

## 7. Budgets

| Metric                   | Budget                                                |
| ------------------------ | ----------------------------------------------------- |
| Home HTML (uncompressed) | ≤ 850 KB. Actual 837 KB; the 4-layer painting is inline for hover fidelity. Externalizing it is the next optimization. |
| Home JS (gzip)           | ≤ 120 KB                                              |
| Article JS (gzip)        | ≤ 100 KB, no page-only island unless a Gallery exists |
| Tab sheet JS (gzip)      | ≤ 110 KB, Tuner in a separate chunk                   |
| `/ai` JS (gzip)          | ≤ 180 KB, Figures in a separate chunk                 |
| CLS                      | 0                                                     |
| LCP (desktop, local)     | ≤ 1.5 s                                               |
| Images                   | WebP, correct `sizes`, lazy below the fold            |
| Videos                   | No preload; load and play on approach                 |

## 8. Quality gates

1. `bun fmt` (then verify `--check`).
2. `bun lint --no-script --max-warnings=0 --allow-unsupported` (only if the Bun build supports it; otherwise use the documented fallback).
3. `bun check` / `bun run check-types`.
4. `bun test --check` then `bun test`.
5. `bun run build`.
6. Playwright e2e + axe.
7. Visual parity at 390/768/1440, dark + light.
8. Lighthouse.
9. `git status` clean of generated files (`apps/web/AGENTS.md`, `.next`, test artifacts).

## 9. Risks

| Risk                                    | Mitigation                                                 |
| --------------------------------------- | ---------------------------------------------------------- |
| Copyright if the repo is published      | `NOTICE.md`, local-only deployment, content-swap guide     |
| Figure reverse-engineering overruns     | Behaviour spec per Figure before code; phase 3 isolated    |
| 180 KB painting SVG                     | SVGO pass; measure HTML; budget 500 KB                     |
| Tailwind translation drifts from source | Screenshot parity gate each phase                          |
| Videos depend on Vercel Blob            | Document; provide a local media cache flag                 |
| Bun lint flag unsupported               | Verify in Phase 0; use a canary or the documented fallback |
| Next 16 MDX + Turbopack plugin limits   | Spike in Phase 1 before authoring content                  |
| Local font differs on Windows/Linux     | Parity runs on macOS Chrome; document the fallback         |

## 10. Out of scope

- Vercel Analytics.
- The 46 dead `/_glossary/*` routes.
- Newsletter backend (redirect only).
- Search, comments, CMS, authentication.
- Public deployment.
- Changes to `apps/docs` or the starter packages beyond the icon entry point.

## 11. Definition of done

- 47 live routes render at parity at 390/768/1440 in light and dark.
- Every feature in the reference dossier works, including all seven Figures, the Viewer, and the Tuner.
- No console errors or failed requests.
- Quality gates green and budgets met.
- A content-swap guide lets you replace Lee's identity, copy, and media without touching components.
