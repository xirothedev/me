# Content brief — xirothedev portfolio

Status: approved 2026-11-11. This brief is the single source for the replacement copy.
The site is English only. Home leads with work, then Writing and Lab.

## 1. Identity

| Field     | Value                                                                                                                                    |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Name      | Lê Thành Trung                                                                                                                           |
| Handle    | `@xirothedev`                                                                                                                            |
| Title     | AI Driven Software Engineer                                                                                                              |
| Role      | Technical Lead at The Resonance Team                                                                                                     |
| Email     | `lethanhtrung.trungle@gmail.com`                                                                                                         |
| Site      | `https://xirothedev.resonance.io.vn`                                                                                                     |
| GitHub    | `https://github.com/xirothedev`                                                                                                          |
| LinkedIn  | `https://www.linkedin.com/in/xirothedev/`                                                                                                |
| X         | `https://x.com/xirothedev`                                                                                                               |
| Facebook  | `https://www.facebook.com/xirothedev` — public, about 2.7K followers. The site does not link it, but the copy may mention posting there. |
| Education | International University, Vietnam National University HCMC. B.S. Computer Science, expected 2029.                                        |
| Origin    | Nha Trang. Moved to Ho Chi Minh City for university.                                                                                     |

Do not publish: date of birth, age, relationships, home address, phone number, patient data, private repository code, private screenshots, client secrets.

The user chose the exact display title `AI Driven Software Engineer`. Use that form in the site title, metadata, and the first bio sentence. In running prose, `AI-driven` is acceptable.

The current avatar is a temporary placeholder until the user sends the headshot. It is a deploy blocker.

Footer credit stays: `Inspired by @leerob on X.`

## 2. Verified claims

Use these claims. Do not invent a number.

### Employment

- Technical Lead at The Resonance Team, Apr 2025 – present.
- Leads a team of 5 and still writes code.
- 700+ PRs merged across three live platforms.
- The resume's framing: “a bug doesn't get a stack trace — it gets a tax agent who can't file.”

### TaxEasy — tax management SaaS (private)

- 5 apps in a Turborepo monorepo: api, web, portal, mobile-rn, mobile-flutter.
- 400+ PRs.
- Vercel AI SDK v7+ LLM gateway with multi-provider abstraction.
- OCR vision pipeline for receipt and invoice extraction, zod-validated structured output.
- Email ingest: Cloudflare Email Routing → Worker → webhook → NestJS → PostgreSQL + S3.
- Processes XML invoices, SMS bank notifications, and receipt OCR through BullMQ.
- Anomaly detection with 8 detectors: late filing, missing declaration, partner KPI breach, high refund rate, revenue mismatch, and others.
- Auto-close lifecycle and ZNS notifications.
- Observability: Grafana, Loki, Tempo, Prometheus, OpenTelemetry collector.
- Docker build time reduced from about 10 minutes to about 30 seconds with pnpm cache mounts and multi-stage builds.
- Self-hosted GitHub Actions runners with Turborepo remote cache.
- Tag-push CD: build → GHCR → VPS over SSH → docker compose.
- Nginx reverse proxy and SSL termination across 5 domains.
- React Native app brought to pixel parity with a Flutter baseline across 12 money screens.
- Token parity checked by a Jest diff; behavioural parity by 6 Maestro flows.
- Prisma 7 `prisma-client` migration across 75 files.
- Missing foreign-key indexes added.

### Ecopick — marketplace and tournaments (private)

- 4 apps: api, web, portal, miniapp.
- 300+ PRs.
- Three AI features: support assistant, product matcher, refund gate.
- Rule-based pricing on a Price Bank.
- State machines for rental, listing, inspection, and refund workflows.
- CAS concurrency guards.
- Repository seam: one repo file per module, exposing domain verbs such as `findCloseCandidates` and `markCommissionPaid`.
- Scoped tournament roles: host, admin, referee, player, spectator.
- One player can hold different roles across tournaments.
- Loyalty ledger with points and persona experience packs.
- CI/CD: Docker config, image pruning for VPS disk, consolidated CD with portal deploy and MiniApp publish.

### XaDaoXa — government e-services (private)

- 3 apps: api, cms, miniapp.
- Commune-level e-services for Xã Đào Xá, Thanh Thủy district, Phú Thọ province.
- Zalo MiniApp built with ZaUI and the ZMP SDK.
- Next.js 16 CMS for commune officials.
- JWT access and refresh tokens.
- Separate clusters for independent deployment.
- Role-based access control.
- Live for citizens.

### Hospital AI Assistant — clinical document retrieval (private, pilot)

- Provincial general hospital in Phú Thọ. Anonymize the hospital name on the site.
- In pilot since Aug 2026.
- NVIDIA DGX Spark, local model inference inside the hospital network.
- Self-hosted RAGFlow v0.27.x.
- Retrieval over the hospital's digital document set.
- Parsing and chunking chosen per document type, not one default template.
- Proxy bridges RAGFlow into an agent harness so staff workflows call the knowledge base as a tool.
- Owns deployment, development, and operations.
- No patient data, no internal screenshots, no hospital name.

### Open source

- WebDev Studios: NestJS + Next.js e-commerce reference. CQRS, Passport JWT, Google and GitHub OAuth, TOTP 2FA, PayOS, Cloudflare R2, Sharp, Redis, rate limiting, CSRF, Helmet, Swagger.
- Orderly: order management with workflow automation. Next.js 16 + NestJS 11, Turborepo, JWT, Zod, PostgreSQL, Prisma.
- Agent Skills: 26 NestJS rules across 13 categories at the time of the README. The repository may have grown; use “26+” if the exact count is uncertain. AgentSkills format. MIT.
- opencode-office-plugin: Office document automation for OpenCode. Draft lifecycle, version history, format conversion, template batch generation.
- openmod-vn: Open Vietnamese moderation dataset hub and a compositional toxicity pipeline (L0–L3) with a ViGuard-X encoder. L0 normalizer, L1 lexical matcher over 435+ terms, L2 compositional detector with 13 skip-gram rules, L3 decision engine with `kid_safe`, `standard_social`, and `relaxed_gaming` policy profiles. Outputs `ALLOW`, `WARN`, or `BLOCK` with spans, severity, and a rationale.
- skills: NestJS API best-practice skill and adapter pack.
- claude-workflow-plugin: multi-phase agent orchestration plugin for Claude Code.
- Vika: document intelligence platform. Next.js 16 + NestJS 11, Bun + Turborepo. Namespace-scoped ingest jobs, TOC detection, document tree indexing, grounded LLM retrieval. Live at `https://vika.com.vn`.

### Claims to avoid

- “4+ years professional”, “since 2022”, “4+ YOE”.
- “Founder” unless the user confirms it.
- “Sole owner” of a platform.
- User counts, revenue, uptime, accuracy percentages, or cost savings not listed above.
- “Millions of users”, “99.9%”, “10x”, “zero downtime”.
- Any hospital name or patient detail.
- Any private repository code or screenshot.

## 3. Voice

- First person. `I` for personal claims. `we` only for team work.
- Concrete nouns and verbs. Name the system, the failure, and the trade-off.
- Short sentences mixed with longer ones. One idea per paragraph.
- Admit what broke and what you would change. No fake vulnerability.
- No rhetorical question openers. No “not just X but Y”. No “isn’t about X, it’s about Y”. No “In conclusion”.
- Limit em dashes to one per 200 words.
- British or American spelling: American. Use `behavior`, `color`, `organize`.
- Dates: `Month YYYY`.
- Headings: sentence case, specific. No “Introduction”, “Overview”, “Key takeaways”.

Banned words: passionate, leverage, seamless, journey, delve, game-changer, cutting-edge, robust, empower, unlock, elevate, showcase, landscape, realm, testament, navigate, foster, vibrant, pivotal, crucial, meticulous, intricate, paramount, transformative, innovative, state-of-the-art, best-in-class, world-class.

Additional banned phrases: “in today’s fast-paced world”, “it’s important to note”, “at the end of the day”, “the possibilities are endless”, “a testament to”, “dive into”, “unpack”, “double-edged sword”, “game changer”, “paradigm shift”, “revolutionize”, “supercharge”, “turbocharge”, “future-proof”.

## 4. Article contract

- Notes: 400–900 words. Undated. `order` 1–10.
- Blogs: 550–1,200 words. Dated `YYYY-MM`. Length is not a target. A shorter piece with a clear argument is better than a padded one.
- Every piece needs:
  - one concrete example from the verified claims;
  - one trade-off or failure;
  - one thing you would do differently;
  - a title that names the subject.
- No piece may be a list of generic advice. Every section adds a fact, a scene, or an argument.
- Use MDX components only:
  - `<Heading id="slug" level={2}>{'Title'}</Heading>`
  - `<MarginNote number={1}>...</MarginNote>`
  - `<Details summary={"..."}>...</Details>`
  - `<Figure name="llm" />` and the other six names
- Do not use raw HTML. Do not add scripts. Do not use `style=` attributes.
- Code blocks are allowed. Code must be generic, not copied from a private repo.
- Links: prefer primary sources. No affiliate links.

## 5. Page map

### Home

- Work first. Five rows: TaxEasy, Ecopick, XaDaoXa, Hospital AI Assistant, Agent Skills.
- Default bio: 60–90 words. Work, AI, writing.
- Long bio: 600–900 words. Start at the tax platform, then Nha Trang, IU, Discord bots, The Resonance Team, the hospital, writing, open source, degree, CTA.
- Notes and Blogs lists stay.
- Hero: Nha Trang illustration supplied by the author. One blue-sea theme, no dark mode.
- Avatar: keep the current file until the user sends the headshot. Mark it as a deploy blocker.
- CTA: open to remote roles. Email link.

### Notes

1. **How I Work** — Optimize for the shortest path to a working system, then for the person who operates it.
2. **How LLMs Fail in Production** — Most failures are input, schema, retrieval, and evaluation failures, not model failures. Keeps all seven Figures.
3. **The Repository Is the Product** — The repo is the interface your team and your agents use.
4. **Shipping Is Not the Announcement** — A launch is a date; adoption is a sequence of small proofs.
5. **Building in Public Without Performing** — Report what changed, what broke, and what it cost.
6. **What I Look For in Developer Tools** — Judge by the first 10 minutes, the first error, and the first month.
7. **Docs That Answer the Question** — Answer the question the user typed, not the one the team wanted.
8. **Moderating a Developer Community** — Moderation is product work; rules, bots, and appeals decide who stays.
9. **Software for One User** — The best personal software starts with one annoying task and no plan to scale.
10. **The Product Engineer in an AI Team** — AI lowers the cost of a prototype, not the cost of ownership.

### Blogs

1. **What 700 PRs Taught Me About Coding Agents** (2026-10) — Agents are good at volume and bad at judgment. The review system is the product.
2. **The CSS I Keep** (2026-08) — A design system is the CSS you can delete and still ship.
3. **A Tax Platform Where Failure Has a Name** (2026-06) — A failed request is a person who cannot file.
4. **How We Taught a Refund Service to Say No** (2026-05) — A policy engine with a language model at the edge, not a classifier.
5. **What Broke When We Put OCR in Production** (2026-03) — Demos read clean receipts; production reads a photo taped to a tax form.
6. **Reflections on Code Review in an AI Team** (2026-01) — AI reduced the cost of writing code and raised the cost of reviewing it.
7. **Why We Moved 75 Files to Prisma 7** (2025-12) — A migration is a chance to fix the indexes and seams you ignored.
8. **A Year and a Half at The Resonance Team** (2026-11) — Four platforms, one team, and the shift from features to outcomes.

### Hospital

- Route: `/hospital`.
- Special page, replaces `/bronco`.
- Anonymized hospital. Stack is public. No patient data.
- Sections: The constraint; The machine; The retrieval; The bridge; What broke; What I own; What is next.
- One original architecture diagram.

### Bookmarks

- Route: `/bookmarks`.
- Groups: Daily, AI, Infra, Design, Reading.
- Links come from the user's GitHub stars plus daily tools.
- Intro links to `/lab`.

### Lab

- Route: `/lab`. Hidden from Home and the sitemap. `noindex`.
- Three tools: Tuner, token-cost estimator, WCAG contrast checker.
- Tuner copy: listen to an instrument, see the nearest note and the distance in cents.
- Token estimator: paste text, estimate tokens and cost. Label the estimate as approximate.
- Contrast checker: two colors, WCAG ratio, AA and AAA results for normal and large text.
- Link from Bookmarks.

## 6. Copy gate

1. Writer drafts from this brief.
2. Independent reviewer checks every claim against section 2. Flags any claim that is not traceable.
3. Reviewer applies the voice rules and the banned list line by line.
4. Hostile reader scores each piece 1–5 for slop and marks the worst three lines.
5. Writer revises. Reviewer re-checks. No piece ships with a score above 2.
6. Final check: no private data, no hospital name, no Lee Robinson text, no anime assets.
