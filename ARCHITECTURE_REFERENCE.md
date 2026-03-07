# NexusPlay - Architecture Reference

## System Overview

NexusPlay is a browser-based multiplayer gaming platform built as a cloud-native, horizontally scalable system optimized for low cost and high availability.

---

## High-Level Architecture

```
                          ┌─────────────────────────────────────────┐
                          │              USERS (Browser)             │
                          │   Chrome / Firefox / Safari / Mobile     │
                          └────────────┬────────────────────────────┘
                                       │ HTTPS / WSS
                          ┌────────────▼────────────────────────────┐
                          │         Cloudflare CDN / WAF            │
                          │   DDoS Protection, Static Assets, TLS   │
                          └────────────┬────────────────────────────┘
                                       │
              ┌────────────────────────┼────────────────────────┐
              │                        │                        │
   ┌──────────▼──────────┐  ┌──────────▼──────────┐  ┌────────▼────────┐
   │   Vercel Edge       │  │   Railway API        │  │  Railway WS     │
   │   Next.js 14        │  │   Fastify REST/tRPC  │  │  Colyseus.js    │
   │   SSR + App Router  │  │   Node.js 20         │  │  Multiplayer    │
   │   Game Client JS    │  │   Port 3001          │  │  Port 2567      │
   └──────────┬──────────┘  └──────────┬──────────┘  └────────┬────────┘
              │                        │                        │
              │             ┌──────────┼──────────┐            │
              │             │          │          │            │
              │   ┌─────────▼──┐  ┌───▼───────┐  │     ┌──────▼──────┐
              │   │ Supabase   │  │  Upstash  │  │     │  Upstash    │
              │   │ PostgreSQL │  │  Redis    │  │     │  Redis      │
              │   │ + Auth     │  │  Cache    │  │     │  Pub/Sub    │
              │   └────────────┘  └───────────┘  │     └─────────────┘
              │                                  │
              │                    ┌─────────────▼──────────┐
              │                    │   Cloudflare R2        │
              │                    │   Game Assets / Images │
              └────────────────────┘   User Avatars         │
                                   └────────────────────────┘
```

---

## Component Architecture

### 1. Frontend (Vercel - Next.js 14)

```
apps/web/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx          # Login page (SSR)
│   │   ├── register/page.tsx       # Registration
│   │   └── forgot-password/        # Password reset
│   ├── (platform)/
│   │   ├── layout.tsx              # Authenticated layout
│   │   ├── dashboard/page.tsx      # User dashboard
│   │   ├── games/
│   │   │   ├── page.tsx            # Game catalog (SSR + ISR)
│   │   │   └── [slug]/page.tsx     # Game detail page (SSR)
│   │   ├── play/[gameId]/page.tsx  # Game player
│   │   ├── leaderboard/page.tsx    # Global leaderboard
│   │   └── profile/page.tsx        # User profile
│   ├── (payments)/
│   │   ├── pricing/page.tsx        # Pricing page
│   │   ├── checkout/page.tsx       # Checkout flow
│   │   └── success/page.tsx        # Payment success
│   └── api/
│       ├── auth/[...nextauth]/     # NextAuth.js routes
│       └── webhooks/
│           ├── paypal/route.ts     # PayPal webhooks
│           └── mollie/route.ts     # Mollie webhooks
├── components/
│   ├── auth/                       # Auth forms
│   ├── games/                      # Game cards, player
│   ├── payments/                   # PayPal button, checkout
│   └── ui/                         # shadcn/ui components
└── lib/
    ├── auth.ts                     # NextAuth config
    ├── api-client.ts               # API client
    └── game-client.ts              # Colyseus client
```

**Rendering Strategy**:
- Game catalog pages: ISR (revalidate every 60s) - SEO + performance
- Game detail pages: SSR - SEO critical
- Game player: CSR - no SEO needed, needs fast hydration
- Dashboard: CSR - private content
- Auth pages: SSR - fast initial load

### 2. API Server (Railway - Fastify)

```
apps/api/
├── src/
│   ├── routes/
│   │   ├── auth/                   # Login, register, refresh
│   │   ├── users/                  # User CRUD
│   │   ├── games/                  # Game catalog API
│   │   ├── sessions/               # Game session management
│   │   ├── payments/               # Payment initiation
│   │   │   ├── paypal.ts
│   │   │   └── mollie.ts
│   │   ├── leaderboard/            # Score submission & ranking
│   │   └── webhooks/               # Payment provider webhooks
│   ├── middleware/
│   │   ├── auth.ts                 # JWT verification
│   │   ├── rate-limit.ts           # Rate limiting (Redis)
│   │   ├── cors.ts
│   │   └── security.ts             # Helmet, CSP
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── payment.service.ts
│   │   ├── game.service.ts
│   │   └── notification.service.ts
│   ├── db/
│   │   └── prisma.ts               # Prisma client singleton
│   └── lib/
│       ├── redis.ts                # Upstash client
│       └── r2.ts                   # Cloudflare R2 client
```

### 3. Multiplayer Server (Railway - Colyseus)

```
apps/ws/
├── src/
│   ├── rooms/
│   │   ├── LobbyRoom.ts            # Matchmaking lobby
│   │   ├── GameRoom.ts             # Base game room
│   │   └── games/
│   │       ├── TicTacToeRoom.ts
│   │       ├── SnakeRoom.ts
│   │       └── PongRoom.ts
│   ├── state/
│   │   ├── LobbyState.ts           # Colyseus schema
│   │   └── GameState.ts
│   ├── middleware/
│   │   └── auth.ts                 # JWT verification for WS
│   └── index.ts                    # Colyseus server setup
```

---

## Data Architecture

### Database Schema (PostgreSQL / Prisma)

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  username      String    @unique
  passwordHash  String
  avatarUrl     String?
  role          Role      @default(USER)
  tier          Tier      @default(FREE)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  sessions      Session[]
  payments      Payment[]
  gameSessions  GameSession[]
  scores        Score[]
  subscription  Subscription?
}

model Game {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  description String   @db.Text
  category    String[]
  tags        String[]
  thumbnailUrl String
  bundleUrl   String
  minPlayers  Int      @default(1)
  maxPlayers  Int      @default(1)
  isMultiplayer Boolean @default(false)
  isPublished Boolean  @default(false)
  isPremium   Boolean  @default(false)
  playCount   Int      @default(0)
  rating      Float    @default(0)
  createdAt   DateTime @default(now())

  gameSessions GameSession[]
  scores       Score[]
}

model GameSession {
  id         String   @id @default(cuid())
  gameId     String
  roomId     String?  // Colyseus room ID
  userId     String
  startedAt  DateTime @default(now())
  endedAt    DateTime?
  score      Int?
  metadata   Json?

  game       Game     @relation(fields: [gameId], references: [id])
  user       User     @relation(fields: [userId], references: [id])
}

model Payment {
  id              String        @id @default(cuid())
  userId          String
  provider        PaymentProvider
  providerPaymentId String      @unique
  amount          Int           // in cents
  currency        String        @default("EUR")
  status          PaymentStatus @default(PENDING)
  type            PaymentType
  idempotencyKey  String        @unique
  metadata        Json?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  user            User          @relation(fields: [userId], references: [id])
  subscription    Subscription? @relation(fields: [subscriptionId], references: [id])
  subscriptionId  String?
}

model Subscription {
  id           String             @id @default(cuid())
  userId       String             @unique
  tier         Tier
  status       SubscriptionStatus @default(ACTIVE)
  currentPeriodStart DateTime
  currentPeriodEnd   DateTime
  cancelAtPeriodEnd  Boolean      @default(false)
  createdAt    DateTime           @default(now())

  user         User               @relation(fields: [userId], references: [id])
  payments     Payment[]
}

model Score {
  id        String   @id @default(cuid())
  userId    String
  gameId    String
  score     Int
  metadata  Json?
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id])
  game      Game     @relation(fields: [gameId], references: [id])

  @@index([gameId, score(sort: Desc)])
}

enum Role { USER DEVELOPER ADMIN }
enum Tier { FREE PRO PREMIUM }
enum PaymentProvider { PAYPAL MOLLIE STRIPE }
enum PaymentStatus { PENDING COMPLETED FAILED REFUNDED CANCELLED }
enum PaymentType { SUBSCRIPTION ONE_TIME COINS }
enum SubscriptionStatus { ACTIVE CANCELLED PAST_DUE PAUSED }
```

### Caching Strategy (Redis / Upstash)

| Cache Key | TTL | Content |
|-----------|-----|---------|
| `game:catalog` | 60s | Game catalog list |
| `game:{slug}` | 300s | Game detail |
| `leaderboard:{gameId}` | 30s | Top 100 scores (sorted set) |
| `user:session:{userId}` | 900s | Active session data |
| `rate:auth:{ip}` | 60s | Rate limit counter |
| `room:active:{roomId}` | TTL=session | Active game room state |

---

## Authentication Flow

```
User                  Next.js              API               Database
  |                      |                   |                   |
  |--- POST /login ------>|                   |                   |
  |                      |--- POST /auth/login -->               |
  |                      |                   |--- SELECT user -->|
  |                      |                   |<-- user data -----|
  |                      |                   |--- bcrypt verify  |
  |                      |<-- {accessToken,  |                   |
  |                      |     refreshToken} |                   |
  |<-- Set-Cookie: -------|                   |                   |
  |    accessToken (15m)  |                   |                   |
  |    refreshToken (7d)  |                   |                   |
  |                      |                   |                   |
  |--- GET /dashboard --->|                   |                   |
  |                      |--- Verify JWT ---->|                   |
  |                      |<-- 200 OK --------|                   |
  |<-- Dashboard HTML ----|                   |                   |
```

**Token Strategy**:
- Access token: JWT, 15 min TTL, stored in httpOnly cookie
- Refresh token: opaque token, 7 day TTL, stored in httpOnly cookie + DB
- Rotation: refresh token rotated on each use (prevents replay)

---

## Payment Flow

### PayPal Flow
```
User          Frontend          API             PayPal
  |               |               |                |
  |-- Click Pay ->|               |                |
  |               |-- Create Order -->             |
  |               |               |-- Create Order ->
  |               |               |<-- orderId ----  |
  |               |<-- orderId ---|               |  |
  |               |               |               |  |
  |-- Approve --> PayPal Popup    |               |  |
  |               |               |               |  |
  |               |-- Capture Order -->           |  |
  |               |               |-- Capture ------>|
  |               |               |<-- Confirmed ----|
  |               |               |-- Update DB   |  |
  |               |<-- Success ---|               |  |
  |<-- Redirect --|               |               |  |
```

### iDEAL / Wero Flow (Mollie)
```
User          Frontend          API             Mollie
  |               |               |                |
  |-- Click Pay ->|               |                |
  |               |-- Create Payment -->           |
  |               |               |-- Create ------->|
  |               |               |<-- paymentUrl ----|
  |               |<-- paymentUrl-|               |  |
  |-- Redirect -->| Mollie Checkout               |  |
  |               |               |               |  |
  |   [Bank Auth] |               |               |  |
  |               |               |<-- Webhook (paid)|
  |               |               |-- Update DB   |  |
  |<-- Redirect --|  (success URL)|               |  |
```

**Idempotency**: Every payment operation uses an idempotency key (`userId + timestamp + random`) stored in DB to prevent double-charging on retry.

---

## Multiplayer Architecture

### Colyseus Room Lifecycle
```
Client A            Colyseus Server         Client B
  |                       |                    |
  |-- joinOrCreate(room)->|                    |
  |                       |-- Room created     |
  |<-- roomId, sessionId--|                    |
  |                       |                    |
  |                       |<-- join(roomId) ---|
  |                       |-- Add Client B     |
  |                       |-- Broadcast state->|
  |<-- state patch -------|                    |
  |                       |                    |
  |-- send("move", data)->|                    |
  |                       |-- Validate move    |
  |                       |-- Update state     |
  |<-- state patch -------|-- state patch ---->|
```

### State Synchronization
- Colyseus uses delta compression for state updates
- Server is authoritative - all moves validated server-side
- Client prediction for smooth UX, server reconciliation
- Reconnection: 30-second window to rejoin same room

### Matchmaking
```
Player requests game
        |
        v
Check Redis: any open room with < maxPlayers?
        |
   Yes  |  No
        |   \
        |    Create new room
        |    Register in Redis
        |          |
        +----------+
        |
    Join room via Colyseus
        |
    Wait for players (30s timeout)
        |
    Start game when full OR timeout
```

---

## Security Architecture

### Defense Layers
```
Layer 1: Cloudflare WAF
  - DDoS protection
  - Bot mitigation
  - Rate limiting (by IP)
  - OWASP rule set

Layer 2: API Gateway (Fastify)
  - Helmet.js (security headers)
  - CORS (whitelist only)
  - Request size limits (1MB)
  - Rate limiting (Redis-backed)

Layer 3: Authentication
  - JWT verification (every request)
  - Role-based access control
  - Session invalidation capability

Layer 4: Application
  - Zod input validation
  - Prisma (prevents SQL injection)
  - Output sanitization (DOMPurify)
  - Server-side score validation

Layer 5: Data
  - PostgreSQL row-level security
  - Encrypted PII fields
  - Audit log table
```

### Security Headers (all responses)
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval' cdn.nexusplay.io; ...
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

---

## Scalability Design

### Horizontal Scaling Points

| Component | Scale Method | Trigger |
|-----------|-------------|---------|
| Next.js (Vercel) | Auto (edge functions) | Always on |
| Fastify API | Railway replicas | CPU >70% |
| Colyseus WS | Railway replicas | Rooms >100 |
| PostgreSQL | Supabase read replicas | DB CPU >60% |
| Redis | Upstash (serverless) | Auto-scales |

### Traffic Projections

| Users | Monthly Cost | Architecture |
|-------|-------------|--------------|
| 0-1,000 | ~$30 | Single instance everything |
| 1,000-10,000 | ~$150 | Add read replica, 2x API |
| 10,000-100,000 | ~$500 | CDN aggressive caching, 4x API, 3x WS |
| 100,000+ | ~$2,000 | Full multi-region, dedicated DB |

---

## Game Integration Architecture

### Game Bundle Format
```
games/{game-slug}/
├── index.html          # Game entry point (loaded in iframe)
├── game.js             # Bundled game code (Phaser/vanilla)
├── assets/             # Static assets (served from R2)
└── manifest.json       # Game metadata
```

### Game Manifest
```json
{
  "id": "snake-multiplayer",
  "title": "Snake Multiplayer",
  "version": "1.0.0",
  "minPlayers": 2,
  "maxPlayers": 4,
  "roomType": "SnakeRoom",
  "controls": ["keyboard", "touch"],
  "estimatedDuration": 180,
  "scoreType": "higher-is-better"
}
```

### Game SDK API (window.NexusPlaySDK)
```typescript
interface NexusPlaySDK {
  // Auth
  getUser(): Promise<User>

  // Multiplayer
  joinRoom(gameId: string): Promise<Room>

  // Scoring
  submitScore(score: number, metadata?: object): Promise<void>

  // Payments
  requirePremium(): Promise<boolean>

  // Events
  on(event: 'playerJoined' | 'playerLeft' | 'gameEnd', handler: Function): void
}
```

---

## CI/CD Pipeline

```
GitHub Push / PR Open
    |
    v
GitHub Actions
    |
    +-- [PR opened/edited] Auto Labeler
    |       +-- Label by changed file paths (.github/labeler.yml)
    |       +-- Label by issue/PR title keywords (labeler.yml)
    |       +-- Label by agent mentioned in body
    |
    +-- Lint (ESLint + TypeScript strict)
    +-- Unit Tests (Vitest, coverage >80%)
    +-- Security Audit (npm audit --audit-level=high)
    +-- Build (turbo build, all workspaces)
    |
    v (on PR merge to main)
    |
    +-- Auto Labeler (re-run on merge commit)
    +-- Deploy: Vercel (web + admin)           [parallel]
    +-- Deploy: Railway (api + ws)             [parallel]
    |
    v (after deploys succeed)
    +-- Run DB Migrations (Prisma migrate deploy)
    +-- E2E Tests (Playwright, staging)
    +-- Notify: Slack/Discord (success or failure)
```

### Labeler Details
The auto-labeler runs on two triggers:
1. **PR files changed** → `actions/labeler@v5` uses `.github/labeler.yml` to map file paths to labels
2. **Issue/PR title + body** → `actions/github-script` applies labels based on:
   - `[P1]–[P10]` prefix → phase label
   - Keywords in title/body → domain labels (frontend, backend, multiplayer, payment, security, seo, infra, database, testing)
   - Priority markers (`P1-critical`, `P2-high`, `P3-medium`)
   - Agent mentions (`Agent: CISO` → `security` label)

---

## Local Development Architecture (Docker Compose)

### Philosophy
- `docker compose up` → full production-like stack, zero cloud credentials needed
- Developers can also run apps natively (better HMR) with only infra in Docker
- All cloud services mirrored locally: Supabase→Postgres, Upstash→Redis, R2→MinIO, Resend→MailHog

### Service Map

```
docker-compose.yml
├── postgres:16          → localhost:5432  (mirrors Supabase)
│     └── Volume: pg_data
├── redis:7-alpine       → localhost:6379  (mirrors Upstash)
├── minio                → localhost:9000  (mirrors Cloudflare R2)
│     └── Console: localhost:9001
├── mailhog              → localhost:8025  (catches all outgoing email)
├── web (Next.js)        → localhost:3000  (hot reload via volume mount)
├── api (Fastify)        → localhost:3001  (hot reload via tsx watch)
├── ws (Colyseus)        → localhost:2567  (hot reload via tsx watch)
└── adminer              → localhost:8080  (DB GUI, dev only)
```

### docker-compose.yml (reference)

```yaml
version: '3.9'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: nexusplay
      POSTGRES_PASSWORD: dev
      POSTGRES_DB: nexusplay_dev
    ports: ["5432:5432"]
    volumes: [pg_data:/var/lib/postgresql/data]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U nexusplay"]
      interval: 5s

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]

  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    ports: ["9000:9000", "9001:9001"]
    volumes: [minio_data:/data]

  mailhog:
    image: mailhog/mailhog
    ports: ["1025:1025", "8025:8025"]  # SMTP + Web UI

  api:
    build: { context: ./apps/api, target: dev }
    ports: ["3001:3001"]
    volumes: ["./apps/api:/app", "/app/node_modules"]
    environment:
      DATABASE_URL: postgresql://nexusplay:dev@postgres:5432/nexusplay_dev
      REDIS_URL: redis://redis:6379
      SMTP_HOST: mailhog
      SMTP_PORT: 1025
    depends_on: [postgres, redis, mailhog]

  ws:
    build: { context: ./apps/ws, target: dev }
    ports: ["2567:2567"]
    depends_on: [redis]

  web:
    build: { context: ./apps/web, target: dev }
    ports: ["3000:3000"]
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001
      NEXT_PUBLIC_WS_URL: ws://localhost:2567
    depends_on: [api]

  adminer:
    image: adminer
    ports: ["8080:8080"]
    profiles: ["tools"]  # Only starts with: docker compose --profile tools up

volumes:
  pg_data:
  minio_data:
```

### Developer Workflows

```bash
# Option A: Full Docker stack (easiest)
docker compose up

# Option B: Just infra + run apps natively (best HMR)
docker compose up postgres redis minio mailhog
pnpm dev

# Seed database with test data
pnpm db:migrate
pnpm db:seed

# Reset everything
docker compose down -v && docker compose up

# Open DB GUI
docker compose --profile tools up adminer
# → http://localhost:8080 (server: postgres, user: nexusplay, pass: dev)

# View all emails sent by the app
# → http://localhost:8025 (MailHog)

# View/manage file storage
# → http://localhost:9001 (MinIO console, user: minioadmin, pass: minioadmin)
```

### Local Seed Data (pnpm db:seed)

```
Users:
  admin@nexusplay.local  / dev1234  (role: ADMIN, tier: PREMIUM, 50,000 chips)
  pro@nexusplay.local    / dev1234  (role: USER, tier: PRO, 2,500 chips)
  user@nexusplay.local   / dev1234  (role: USER, tier: FREE, 150 chips)
  dev@nexusplay.local    / dev1234  (role: DEVELOPER, tier: PRO)

Games (5 seeded, published):
  snake-multiplayer, memory-match, blackjack, pong, tic-tac-toe

Tournaments (1 active):
  Weekly Snake Championship (entry: 100 chips, 4 players max)

Chip transactions: realistic history for each user
Scores: leaderboard data for all 5 games
```

### Environment Files

```
.env.local.example    → Pre-filled with Docker defaults (commit this)
.env.local            → Developer overrides (gitignored)
.env.test             → Test environment (CI-safe values, commit this)
.env.staging          → Staging secrets (in GitHub Actions secrets)
.env.production       → Production secrets (in Vercel + Railway)
```

### Makefile Shortcuts

```makefile
dev:          docker compose up postgres redis minio mailhog && pnpm dev
docker-all:   docker compose up
seed:         pnpm db:migrate && pnpm db:seed
reset-db:     docker compose down -v postgres && docker compose up -d postgres && sleep 3 && pnpm db:migrate && pnpm db:seed
logs-api:     docker compose logs -f api
logs-ws:      docker compose logs -f ws
clean:        docker compose down -v && docker system prune -f
```

---

## Monitoring & Observability

```
Metrics Flow:
App → Sentry (errors) → Alert → PagerDuty (on-call)
App → Axiom (structured logs) → Dashboards
App → Plausible (user analytics) → Marketing reports
DB → Supabase Dashboard → DBA alerts
Infra → Better Uptime → Status page
```

### Key Alerts
- Error rate > 1% → Slack alert
- API p99 latency > 2s → Slack alert
- Failed payments > 5% → PagerDuty (critical)
- DB connections > 80% → Auto-scale trigger
- WebSocket disconnections spike → Investigate

---

## Architecture Decision Records

### ADR-001: Colyseus over Socket.io for multiplayer
**Decision**: Use Colyseus.js instead of raw Socket.io
**Rationale**: Built-in room management, state synchronization, reconnection handling, and matchmaking. Socket.io requires reimplementing all of this.
**Status**: Accepted

### ADR-002: Mollie over Stripe for EU payments
**Decision**: Use Mollie as primary EU payment processor
**Rationale**: Native support for iDEAL, Wero, Bancontact, and Sofort. Lower fees for EU bank transfers. Stripe supports iDEAL but Mollie is optimized for EU market.
**Status**: Accepted

### ADR-003: Supabase over managed RDS
**Decision**: Use Supabase (managed Postgres) instead of AWS RDS
**Rationale**: 5-10x cheaper at startup scale. Includes auth (backup), realtime subscriptions, and row-level security. Migrate to RDS if needed at 100k users.
**Status**: Accepted

### ADR-004: Monorepo with Turborepo
**Decision**: Single monorepo with Turborepo build system
**Rationale**: Shared types between frontend/backend, atomic deploys, single PR for cross-cutting changes.
**Status**: Accepted

### ADR-005: Games in iframes with postMessage SDK
**Decision**: Serve games in sandboxed iframes, communicate via postMessage
**Rationale**: Security isolation (games can't access platform cookies/storage), allows third-party game developers to submit games, consistent API.
**Status**: Accepted
