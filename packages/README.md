# Packages (deep modules)

Each directory under `packages/` is a **deep module**: a lot of behaviour behind a small public interface. A package's public surface is its **entry points** — the files at the package root. Anything in a subfolder (`lib/`, `tests/`, or any other) is private implementation.

## Layout

```
packages/<name>/
  index.ts        # entry point (public)
  client.ts       # another entry point (public)
  lib/            # implementation (private)
  tests/          # tests and fixtures (private)
```

## Rules

1. **Entry-point boundary**: code outside a package may import only that package's entry points (root files), never anything in its subfolders.
2. **Intra-package freedom**: a package's own files import each other freely.
3. **Tests through entry points**: tests import packages only through entry points; they never reach into internals, not even their own.
4. **No cycles**: no dependency cycles.

Import only through a package's entry points (its root files). Prefer several small entry points (`index.ts`, `client.ts`, `server.ts`) over one giant barrel `index.ts` that re-exports a whole subtree.

## Check

Run `bun run lint:boundaries` to enforce the four rules.
