# Multi-stage build for the NestJS API in the pnpm/Turborepo monorepo.
FROM node:20-bookworm-slim AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app

FROM base AS build
# Build tooling for native deps (argon2).
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm turbo run build --filter=@webshop/api

FROM base AS runner
ENV NODE_ENV=production
COPY --from=build /app /app
WORKDIR /app
EXPOSE 4000
# Apply migrations, then start the API.
CMD ["sh", "-c", "pnpm --filter @webshop/database migrate && node apps/api/dist/main.js"]
