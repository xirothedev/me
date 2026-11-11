# Discovery scripts

`discover-site.ts` crawls a reference site and writes a feature report.

```sh
bun run discover
bun run discover -- --widths 390,768,1440 --schemes dark,light
```

Output defaults to `docs/reference/leerob/`:

- `discovery.json` — full machine-readable record.
- `DISCOVERY.md` — route table, tokens, responsive shifts, features, probes, anomalies.
- `screenshots/` — one full-page shot per page, scheme, and width.

The script drives a real Chrome channel through `playwright-core`. Set `BROWSER_CHANNEL` to another installed channel when needed.

## Why `no-await-in-loop` is off here

The crawler is deliberately sequential. Two pages must not share one browser context at the same time: screenshots, lazy-image priming, and probe clicks would interfere. The lint override in `.oxlintrc.json` is scoped to `apps/web/scripts/**/*.ts` for that reason.
