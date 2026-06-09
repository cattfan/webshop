# Webshop — Digital Product Marketplace

A professional black-and-white marketplace for selling digital goods (SaaS accounts, license
keys, subscription slots, invite-based products, and manual fulfillment services).

## Stack

- Monorepo: Turborepo + pnpm workspaces
- Storefront: Next.js (App Router, TypeScript, Tailwind) — locales `en`, `cn`
- Admin: Next.js (App Router, TypeScript, Tailwind) — locales `vi`, `en`, `cn`
- API: NestJS (TypeScript)
- Database: PostgreSQL + Prisma
- Queue/cache: Redis + BullMQ
- Payments: self-hosted Epusdt / GMPay (crypto)
- i18n: next-intl
- Design: black & white only, minimal, premium

## Structure

```
apps/
  storefront/   customer storefront (en, cn)
  admin/        backoffice dashboard (vi, en, cn)
  api/          NestJS API
packages/
  database/     Prisma schema, client, migrations, seed
  ui/           shared B/W component library + Tailwind preset
  config/       runtime config + env zod schemas
  i18n/         shared message catalogs + locale config
  types/        shared enums + zod schemas (FE/BE single source of truth)
  eslint-config/
  tsconfig/
docker/         Dockerfiles + nginx config
```

## Getting started

```bash
pnpm install
cp .env.example .env        # fill in secrets
pnpm docker:dev             # start postgres + redis
pnpm db:migrate             # apply schema
pnpm db:seed                # seed roles + admin + sample catalog
pnpm dev                    # run all apps
```

## Status

Built incrementally per milestone — see `.cursor/plans` for the implementation plan.
