# Portfolio

A faithful rebuild of [leerob.com](https://leerob.com) in Next.js 16, React 19, and Tailwind v4.

The clone covers all 47 live routes: Home, 10 Notes, 8 Blogs, 24 guitar Tab sheets, Bronco, Bookmarks, and the 404 page. It includes the bio modes, the animated painting, margin notes, the image Viewer, the microphone Tuner, the seven interactive AI Figures, responsive layouts, and light/dark themes.

Read `NOTICE.md` first. The cloned text, photos, painting, and identity are © Lee Robinson and must be replaced before any public deployment.

## Stack

- Next.js 16 App Router, React 19, Turbopack
- Tailwind CSS v4 with `@theme` tokens
- MDX for Notes and Blogs, JSON for Tab sheets
- `next-themes`, `next/image`, `next/og`
- Bun 1.4 tests, Playwright (`playwright-core`) for discovery and visual parity
- `@repo/ui` for the icon vocabulary

## Commands

```sh
bun install
bun dev                 # http://localhost:3000
bun build
bun start               # production server for apps/web

bun test                # unit tests (apps/web)
bun check               # typecheck the web app
bun lint                # repo lint
bun fmt                 # repo format

bun run discover        # crawl the reference site, write docs/reference/leerob
bun run fetch-media     # download and optimize reference images
bun run parity          # compare the clone with the reference screenshots
```

Discovery and parity need Chrome. Set `BROWSER_CHANNEL` to another installed channel if needed.

## Structure

```txt
apps/web/
  content/              Notes, Blogs, Tab sheets, Home bios, Bookmarks data
  public/               avatar, favicon, media, cursor logos
  scripts/              discovery, media fetch, import, parity
  src/app/              routes, metadata, sitemap, robots, OG image
  src/components/       site, home, content, figures, tabs
  src/content/          schema, registry, tab loader
  src/lib/              site config, date formatting
packages/ui/            Icon + ICON entry point
docs/plans/             clone plan and gates
docs/reference/         captured reference dossier (git-ignored)
```

## Content swap

1. Replace `apps/web/src/lib/site-config.ts`.
2. Replace `apps/web/content/`.
3. Replace `apps/web/public/media/` and `apps/web/public/avatar.webp`.
4. Point `apps/web/src/app/sitemap.ts`, `layout.tsx`, and `opengraph-image.tsx` at the new identity.
5. Re-run `bun build` and the quality gates.

## Quality state

- `bun fmt`, `bun lint`, `bun check`, `bun test`, and `bun build` pass.
- Bookmarks parity: 0.01–0.02% at 390/768/1440.
- Home light 1440: 0.36% and passing the pixel gate.
- Articles: 1–3% due to text anti-aliasing and sub-pixel layout.
- `/ai` figures: 3.2% at 1440; layout, controls, and captions are in place.
- `/vercel` polaroid strips remain the largest visual gap (17%): the frame and tilt are rebuilt, but the reference grain and photo treatment need a final pass.

See `docs/plans/leerob-clone.md` for the phase plan and `DESIGN.md` for the design system.
