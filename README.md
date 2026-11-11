# Portfolio

Personal site of Lê Thành Trung. Built with Next.js 16, React 19, Tailwind CSS v4, and MDX.

Live target: [xirothedev.resonance.io.vn](https://xirothedev.resonance.io.vn)

The reading layout is inspired by [Lee Robinson](https://leerob.com). The footer keeps the credit: “Inspired by @leerob on X.” The code is a clean rebuild. The content and identity are original. The hero illustration is supplied by the author.

## Routes

- **Home** — work, two bio lengths, Notes, Blogs, and the Nha Trang hero illustration.
- **10 Notes** — undated pieces on production, AI, repositories, docs, tools, and community.
- **8 Blogs** — dated pieces on TaxEasy, Ecopick, OCR, Prisma 7, code review, and the team.
- **`/hospital`** — the Hospital AI Assistant case study.
- **`/bookmarks`** — links from GitHub stars and daily tools. It links to the hidden Lab.
- **`/lab`** — the Tuner, a token-cost estimator, and a WCAG contrast checker. `noindex`.
- **404** — the custom not-found page.

The old clone routes redirect: `/tabs` → `/lab`, `/tabs/:slug` → `/lab`, `/bronco` → `/hospital`.

## Stack

- Next.js 16 App Router, React 19, Turbopack
- Tailwind CSS v4 with `@theme` tokens
- MDX for Notes and Blogs, JSON for Bookmarks
- `next-themes`, `next/image`, `next/og`
- Bun 1.4 tests
- `@repo/ui` for the icon vocabulary

## Commands

```sh
bun install
bun dev                 # http://localhost:3000
bun build
bun start               # production server for apps/web

bun test                # unit tests
bun check               # lint, typecheck, and boundaries
bun fmt                 # format
bun fmt --check         # format check
```

## Structure

```txt
apps/web/
  content/              Notes, Blogs, Hospital, Home bios, Bookmarks
  public/               avatar, favicon, bookmark icons
  src/app/              routes, metadata, sitemap, robots, OG image
  src/components/       site, home, content, figures, lab
  src/content/          schema and route registry
  src/lib/              site config, work data, formatting
packages/ui/            Icon + ICON entry point
docs/plans/             content brief and copy gate
```

## Content model

Every Note and Blog is an MDX module with validated metadata:

```mdx
export const meta = {
  title: "How I Work",
  description: "A short summary.",
  kind: "note",
  order: 1,
};
```

- `kind`: `note`, `blog`, or `page`.
- Notes carry `order`. Blogs carry `date` (`YYYY-MM`).
- `src/content/registry.ts` is the single route source.
- `src/lib/site-config.ts` holds the identity, social links, and the design credit.
- `src/lib/work.ts` holds the five rows on Home.

## Quality state

- `bun fmt --check`, `bun lint`, `bun check`, `bun test`, and `bun build` pass.
- The build renders 27 static routes.
- Lighthouse scores 100 for accessibility, best practices, and SEO on `/`, `/hospital`, `/bookmarks`, and `/how-i-work`. `/lab` scores 100 for accessibility and best practices; its SEO score is lower because the page is `noindex` by design.
- The home hero is a local WebP with a layered hover wind; no external art is loaded.
- The copy passed two independent review agents against `docs/plans/content-brief.md`; no blockers remain and every piece scores 2 or lower on the slop scale.

## Assets

The avatar is still a temporary placeholder. Replace `apps/web/public/avatar.webp` with the final headshot before public deployment. The site does not ship Lee Robinson’s other photographs, painting, or written content.

Bookmark icons live in `apps/web/public/media/bookmarks/`. They are favicons from the linked sites, used at 16 px.

## Deploy

The target is `https://xirothedev.resonance.io.vn`. No deployment is configured in this repository. Set the domain in the hosting provider after the headshot is replaced.
