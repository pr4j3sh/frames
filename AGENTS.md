# AGENTS.md

## Overview

Two independent projects in one repo:

- **Root** — `@pr4j3sh/create-frames` npm CLI. `index.js` is the entrypoint; esbuild bundles it (entry + `src/` modules + runtime deps) to `dist/bundle.js` (`main` and `bin` both point there). Runtime deps (`commander`, `@clack/prompts`, `picocolors`) are `devDependencies` and bundled in, so the published package is self-contained. `node_modules`/`dist` are gitignored.
- **`docs/`** — separate Vite + Tailwind marketing site (own `package.json`), deployed to GitHub Pages by `.github/workflows/static.yml` on push to `master`. Multi-page build (index, templates, guides, request) with `base: "/frames/"`.

## Commands

```bash
# Root (CLI)
npm run build   # esbuild bundle -> dist/bundle.js (must run before testing the CLI)
npm run dev     # node .
npm test        # NO-OP (echo + exit 0) — do not rely on it

# Docs site
cd docs && npm install
npm run dev     # vite dev server
npm run build   # vite build -> docs/dist
```

## CLI

- `create-frames [template] [projectName]` scaffolds a template (clone → strip → `.env.example`→`.env` → install → optional `git init` → run-command summary). No args + TTY → interactive picker.
- Flags: `--list`, `--search <q>`, `--info <tpl>`, `--yes`, `--force`, `--pm <npm|pnpm|yarn|bun>`, `--no-install`, `--no-env`, `--git`, `--dry-run`, `--json`, `-V/--version`, `-h/--help`. Code lives in `src/` (`args`, `registry`, `steps`, `ui`, `run`).

## How templates work

- `templates.json` (repo root) is the **single source of truth** for the template list: `repo`, `title`, `description`, `tech`, `demo` (optional live URL), `source` (repo URL). `docs/templates/data.js` re-exports it; `docs/vite.config.js` sets `server.fs.allow: [".."]` so Vite can read it.
- Each template is a **separate GitHub repo** `pr4j3sh/<name>` (e.g. `temp-blog`, `react-auth`, `python`), NOT a directory in this repo.
- The CLI clones `https://github.com/pr4j3sh/<name>.git` then deletes `.git`, `.github`, `LICENSE`, `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `Dockerfile` from the clone. Template repos use `.env.example` so the CLI renames it to `.env`.
- The CLI guesses the run command in order: `package.json` → `npm run dev`, `Cargo.toml` → `cargo run`, `Makefile` → `make run`, `pyproject.toml` → `python -m package.main`. Install runs only when `package.json` is present.
- The CLI fetches the latest `templates.json` from GitHub raw (cached 1h in `~/.cache/frames/`), falling back to the bundled copy on failure.
- **To add a template:** create the `pr4j3sh/<name>` repo, then add an entry to `templates.json` (keep `docs/templates/data.js` untouched — it re-exports). Templates are sorted by title at render time (`docs/templates/template.js`), so array order in `templates.json` is irrelevant.

## Release

- npm publish is triggered by publishing a GitHub release (`.github/workflows/publish.yml`). It uses **OIDC trusted publishing** (no token secret): `npm ci`, `npm test`, `npm run build`, then `npm publish --access public --provenance`. The published version comes from `package.json` on `master`, so bump it before tagging. Requires npm >= 11.5 (installed via `npm install -g npm@11`) for OIDC; node 20, engines `>=20.12.0`. The trusted publisher on npmjs.com is bound to workflow filename `publish.yml`.
- Docs deploy is automatic on `master` push.
