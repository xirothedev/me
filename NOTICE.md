# Notice

## Design credit

The reading layout is inspired by [Lee Robinson](https://leerob.com) ([@leerob on X](https://x.com/leerob)). The site footer keeps the credit: “Inspired by @leerob on X.”

The code is a clean rebuild. The content, identity, and writing are original. The hero illustration is supplied by the author.

## Prior clone history

This repository previously contained a technical clone of leerob.com on the `feat/leerob-clone` branch. That branch was used to study the layout, routes, and interactions. The current site replaces the cloned text, photographs, painting, and identity.

The old clone remains in the git history of pull request #1. Do not deploy an older commit from that branch. Deploy only a commit that contains the current `apps/web/content/`, `apps/web/src/lib/site-config.ts`, and `apps/web/public/` files.

## Assets

The avatar at `apps/web/public/avatar.webp` is still a temporary placeholder and is the only remaining reference asset. Replace it with the final headshot before public deployment.

The hero master is committed at `apps/web/assets/hero/nha-trang.png` (not served). `bun run --cwd apps/web hero:build` writes the served WebP. The scene masks and motion are original code.

The OG card uses the supplied landscape version at `apps/web/assets/og/nha-trang-landscape.png`. `bun run --cwd apps/web og:build` writes `src/app/opengraph-image.jpg`. The text overlay is original.

The site does not ship Lee Robinson’s other photographs, painting, or written content. Bookmark icons are favicons from the linked sites, used at 16 px.

## Hospital case study

The Hospital page anonymizes the client as “a provincial general hospital in Phú Thọ.” It contains no hospital name, patient data, internal screenshots, or private repository code. Keep it that way.

## Content ownership

All original text is © Lê Thành Trung. The hero illustration is supplied by the author. The design credit above does not grant rights to the reference site’s content, and the reference site’s content does not grant rights to this site.
