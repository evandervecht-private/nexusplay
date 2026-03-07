# ── Base ──────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS base
RUN npm install -g pnpm@9
WORKDIR /app

# ── Dev ───────────────────────────────────────────────────────────────────────
FROM base AS dev
# Install dependencies first (cached layer)
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/db/package.json ./packages/db/
COPY packages/config/package.json ./packages/config/
RUN pnpm install --frozen-lockfile

# Copy source
COPY apps/api/ ./apps/api/
COPY packages/ ./packages/

WORKDIR /app/apps/api
EXPOSE 3001
CMD ["pnpm", "dev"]

# ── Build ─────────────────────────────────────────────────────────────────────
FROM base AS builder
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/db/package.json ./packages/db/
COPY packages/config/package.json ./packages/config/
RUN pnpm install --frozen-lockfile --prod=false

COPY apps/api/ ./apps/api/
COPY packages/ ./packages/

WORKDIR /app/apps/api
RUN pnpm build

# ── Production ────────────────────────────────────────────────────────────────
FROM node:22-alpine AS production
RUN npm install -g pnpm@9
WORKDIR /app

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./

RUN pnpm install --prod --frozen-lockfile

ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "dist/index.js"]
