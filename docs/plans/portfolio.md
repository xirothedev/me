# Portfolio — build plan

Status: content replacement implemented 2026-11-11. Copy gate passed 2026-11-11.

## Current state

- Identity: Lê Thành Trung, `@xirothedev`, AI Driven Software Engineer, Technical Lead at The Resonance Team.
- Target: `https://xirothedev.resonance.io.vn`.
- Routes: Home, 10 Notes, 8 Blogs, Hospital case study, Bookmarks, Lab, 404. 27 static routes.
- Home leads with Work, then Notes and Blogs. Two bio lengths. Nha Trang hero illustration.
- Lab is hidden, `noindex`, and linked from Bookmarks. It holds the Tuner, a token estimator, and a contrast checker.
- Old clone routes redirect: `/tabs` → `/lab`, `/tabs/:slug` → `/lab`, `/bronco` → `/hospital`.
- Palette: warm paper and deep green. SVG hero scene: ocean, park, and city planes, five palms, foam, and sparkle. Ambient motion, stronger on hover.
- The current avatar is a placeholder until the headshot arrives.
- The hero master is `apps/web/assets/hero/nha-trang.png`; `bun run --cwd apps/web hero:build` rebuilds the served WebP.

## Decisions

| #   | Decision          | Choice                                                                   |
| --- | ----------------- | ------------------------------------------------------------------------ |
| 1   | Purpose           | Work first; Writing and Lab next.                                        |
| 2   | Language          | English only.                                                            |
| 3   | Title             | AI Driven Software Engineer. Technical Lead at The Resonance Team.       |
| 4   | Personal boundary | Professional plus origin story. No age, date of birth, or relationships. |
| 5   | Article set       | 10 Notes and 8 Blogs, all mapped to real work.                           |
| 6   | Hidden section    | `/lab` replaces `/tabs`. Keep the Tuner.                                 |
| 7   | Photo essay       | Hospital case study replaces Bronco. Anonymized client.                  |
| 8   | Design            | Keep the reading layout; change palette, hero image, avatar, and logos.    |
| 9   | Social links      | GitHub, LinkedIn, X, email. Facebook is not linked.                      |
| 10  | Repo              | Push the replacement to PR #1.                                           |
| 11  | Copy gate         | Two independent agents: fact audit and hostile reader.                   |

## Copy gate

1. `docs/plans/content-brief.md` is the source of truth.
2. First pass: independent fact audit and hostile reader. Findings applied.
3. Second pass: re-audit and re-score.
4. Target: every piece at 2 or lower on the slop scale, no blocker claims.
5. Final human review before deploy.

Result: no blocker claims. Every piece scores 2 or lower on the slop scale.

## Remaining work

Done 2026-11-11:

- [x] Hero scene: three planes, five palms, tide, foam, and sparkle.
- [x] `bun fmt --check`, `bun lint`, `bun check`, `bun test`, and the production build.
- [x] Axe WCAG 2.1 A/AA on `/`, `/hospital`, `/bookmarks`, and `/lab` in light and dark: 0 violations.
- [x] Verify the 390 / 768 / 1440 layouts. The hero shows at 1100 px and wider.
- [x] Reduced motion renders the untouched base. No seam at 1110 and 1440.
- [x] Lighthouse on `/`: 100 performance, 100 accessibility, 100 best practices, 100 SEO.
- [x] Copy gate: content is unchanged since the pass. No blocker claims.

Open:

- [ ] Replace `apps/web/public/avatar.webp` with the final headshot.
- [ ] Add the 3-5 origin facts to `apps/web/content/home/bio-long.mdx`.
- [ ] Deploy to `xirothedev.resonance.io.vn` after the headshot and the copy gate.

## Notes

- The prior clone remains in the git history of PR #1. Deploy only the current tree.
- `docs/reference/` is local and git-ignored. The clone scripts were removed.
- The site does not ship Lee Robinson’s photographs, painting, or written content.
