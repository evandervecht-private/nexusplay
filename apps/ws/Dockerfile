# ── Base ──────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS base
RUN npm install -g pnpm@9
WORKDIR /app

# ── Dev ───────────────────────────────────────────────────────────────────────
FROM base AS dev
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY apps/ws/package.json ./apps/ws/
COPY packages/config/package.json ./packages/config/
RUN pnpm install --frozen-lockfile

COPY apps/ws/ ./apps/ws/
COPY packages/config/ ./packages/config/

WORKDIR /app/apps/ws
EXPOSE 2567
CMD ["pnpm", "dev"]

# ── Build ─────────────────────────────────────────────────────────────────────
FROM base AS builder
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY apps/ws/package.json ./apps/ws/
COPY packages/config/package.json ./packages/config/
RUN pnpm install --frozen-lockfile --prod=false

COPY apps/ws/ ./apps/ws/
COPY packages/config/ ./packages/config/

WORKDIR /app/apps/ws
RUN pnpm build

# ── Production ────────────────────────────────────────────────────────────────
FROM node:20-alpine AS production
RUN npm install -g pnpm@9
WORKDIR /app

COPY --from=builder /app/apps/ws/dist ./dist
COPY --from=builder /app/apps/ws/package.json ./

RUN pnpm install --prod
ENV NODE_ENV=production
EXPOSE 2567
CMD ["node", "dist/index.js"]
