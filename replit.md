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
- **Course Icons**: Lucide React icons replace emojis. `COURSE_ICON_MAP` in Home.tsx and Admin.tsx. Admin has visual 15-icon picker grid.
- **Theme**: CSS variables `--color-gold`, `--color-gold-dark`, `--color-gold-light`, `--color-gold-faint` in `index.css`
- **Admin password**: `ADMIN_PASSWORD` env var (currently "123")
