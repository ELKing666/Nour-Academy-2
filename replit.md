# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Nour Academy Frontend Features

- **i18n / Language Toggle**: 5 languages (Arabic RTL main, English, French, Spanish, German). Files:
  - `artifacts/nour-academy/src/i18n/translations.ts` — all translation strings
  - `artifacts/nour-academy/src/contexts/LanguageContext.tsx` — React context + `useLang()` hook
  - Toggle in navbar: globe icon dropdown on desktop, pill buttons in mobile menu
  - Language persisted to `localStorage` key `na_lang`
- **Auto-translation**: Dynamic content (FAQ, course titles/descriptions, course features) auto-translates via Google Translate API when language changes. Cache in `localStorage` key `na_trans_cache_v1`. Files: `src/lib/translate.ts`, `src/hooks/use-auto-translate.ts`
- **Course Icons**: Lucide React icons replace emojis. `COURSE_ICON_MAP` in Home.tsx and Admin.tsx. Admin has visual 15-icon picker grid.
- **Theme**: CSS variables `--color-gold`, `--color-gold-dark`, `--color-gold-light`, `--color-gold-faint` in `index.css`
- **Admin password**: `ADMIN_PASSWORD` env var (currently "123")

## Railway Deployment

The project is fully configured for self-hosted deployment on Railway. See `DEPLOYMENT.md` for step-by-step instructions.

- **`Dockerfile`** — multi-stage build: builds React frontend (Vite) + Express API (esbuild), starts the server in production mode
- **`railway.toml`** — points Railway to the Dockerfile builder
- **`lib/db/drizzle/`** — Drizzle migration SQL files; applied automatically on first startup to create all database tables
- **Production mode**: Express serves both the API (`/api/*`) and the built React frontend as static files from one process
- **Environment variables needed on Railway**: `DATABASE_URL` (auto-set by Railway PostgreSQL plugin), `NODE_ENV=production`, `ADMIN_PASSWORD`
- **Replit-only vite plugins** (`runtimeErrorOverlay`, `cartographer`, `devBanner`) are gated behind `REPL_ID` env check — never included in Railway builds
