# NexusPlay

Browser-based multiplayer gaming platform with virtual chip economy, PayPal/iDEAL/Wero payments, and real-time multiplayer.

## Getting Started in 5 Minutes

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or Docker + Docker Compose)
- [Node.js 20+](https://nodejs.org/)
- [pnpm 9+](https://pnpm.io/installation) — `npm install -g pnpm`

### Option A: Full Docker Stack (one command)

```bash
git clone https://github.com/evandervecht-private/nexusplay.git
cd nexusplay
docker compose up --build
```

Services start at:
| Service | URL |
|---------|-----|
| Web (Next.js) | http://localhost:3000 |
| API (Fastify) | http://localhost:3001 |
| WebSocket (Colyseus) | ws://localhost:2567 |
| MinIO S3 Console | http://localhost:9001 |
| MailHog (email) | http://localhost:8025 |
| Adminer (DB GUI) | Run `make tools` first → http://localhost:8080 |

### Option B: Native Apps + Docker Infra (recommended for development)

Better HMR (hot module reload) when running Next.js and Node apps natively:

```bash
# 1. Clone and install
git clone https://github.com/evandervecht-private/nexusplay.git
cd nexusplay
pnpm install

# 2. Configure environment
cp .env.local.example .env.local
# .env.local is pre-filled for Docker — no changes needed

# 3. Start infra (Postgres, Redis, MinIO, MailHog)
make infra

# 4. Set up database
make migrate
make seed

# 5. Start all apps with hot reload
pnpm dev
```

### First-Time Full Setup (shortcut)

```bash
make setup   # install + start infra + migrate + seed
make dev     # start apps natively
```

## Test Accounts

All accounts use password: **`dev1234`**

| Email | Role | Tier | Chips |
|-------|------|------|-------|
| admin@nexusplay.local | ADMIN | PREMIUM | 50,000 |
| pro@nexusplay.local | USER | PRO | 2,500 |
| user@nexusplay.local | USER | FREE | 150 |
| dev@nexusplay.local | DEVELOPER | PRO | 5,000 |
| player1-6@nexusplay.local | USER | mixed | mixed |

## Common Commands

```bash
# Development
make dev          # Start infra + run apps natively
make docker-all   # Start everything in Docker
make infra        # Start only Postgres, Redis, MinIO, MailHog
make tools        # Start infra + Adminer DB GUI

# Database
make migrate      # Run Prisma migrations
make seed         # Seed with test data
make reset-db     # Drop + recreate + migrate + seed
make studio       # Open Prisma Studio in browser

# Monitoring
make ps           # Show running containers
make health       # Check all service health endpoints
make logs         # Tail all logs
make logs-api     # Tail API logs only
make logs-ws      # Tail WebSocket logs only

# Shells
make shell-api    # Shell into API container
make shell-db     # psql into Postgres
make shell-redis  # redis-cli

# Cleanup
make stop         # Stop all containers
make clean        # Stop + delete all volumes (DESTROYS DATA)
```

## Architecture

See [ARCHITECTURE_REFERENCE.md](./ARCHITECTURE_REFERENCE.md) for full system design.

### Local Service Map

```
┌─────────────────────────────────────────────────────────────────┐
│                    Docker Compose Network                       │
│                                                                 │
│  postgres:5432    redis:6379    minio:9000    mailhog:1025      │
│       ↑               ↑            ↑              ↑            │
│  apps/api:3001   apps/ws:2567   apps/web:3000                  │
└─────────────────────────────────────────────────────────────────┘
```

## Project Structure

```
nexusplay/
├── apps/
│   ├── web/          # Next.js 14 (App Router, TypeScript)
│   ├── api/          # Fastify REST API
│   ├── ws/           # Colyseus multiplayer server
│   └── admin/        # Admin dashboard (planned)
├── packages/
│   ├── ui/           # Shared React components
│   ├── db/           # Prisma schema + migrations + seed
│   └── config/       # Shared TypeScript/ESLint config
├── games/            # Game bundles (Phaser.js / Babylon.js)
├── infrastructure/
│   └── docker/       # Docker init scripts
├── docker-compose.yml
├── Makefile
└── .env.local.example
```

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14, React 18, Tailwind CSS, shadcn/ui |
| Backend | Fastify, Prisma, PostgreSQL (Supabase in prod) |
| Multiplayer | Colyseus.js (WebSocket) |
| Games | Phaser.js (2D), Babylon.js (3D) |
| Cache | Redis (Upstash in prod) |
| Storage | MinIO locally, Cloudflare R2 in prod |
| Payments | PayPal + Mollie (iDEAL / Wero) |
| Email | MailHog locally, Resend in prod |
| Auth | NextAuth.js v5 + JWT |

## Agents

See [AGENTS.md](./AGENTS.md) for the multi-agent system (CEO, CTO, CISO, SEO Agent, Helpdesk, etc.)

## Skills

See [SKILLS.md](./SKILLS.md) for available Claude Code `/skills`.

## Contributing

1. Pick an issue from the [GitHub Issues](https://github.com/evandervecht-private/nexusplay/issues)
2. Create a branch: `feature/ISSUE-ID-description`
3. Run `make setup` to get a working local environment
4. Write code + tests
5. Open a PR — the labeler will auto-tag it

## License

Private — all rights reserved.
