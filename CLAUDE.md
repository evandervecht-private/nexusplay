# Autonomous Gaming Platform - Claude Code Project Configuration

## Project Overview
A scalable, browser-based multiplayer gaming platform with integrated payments (PayPal, iDEAL, Wero), user authentication, and autonomous game management. Built for low operational cost and high profitability.

The platform uses a **virtual chip economy**: players buy Chips with real money, spend Chips to play games and enter tournaments. Chips have no cash-out value — this keeps the platform in social gaming territory (no gambling license required in most jurisdictions).

## Chip Economy Model

### How It Works
```
Real Money → (PayPal / iDEAL / Wero) → Chips → Games / Tournaments / Shop
                                                          ↓
                                                   House keeps rake
```

### Chip Packages (Shop)
| Package | Chips | Price | Effective Rate | Bonus |
|---------|-------|-------|---------------|-------|
| Starter | 500 | €0.99 | €0.00198/chip | — |
| Popular | 2,000 | €2.99 | €0.001495/chip | +200 bonus |
| Value | 5,500 | €4.99 | €0.000907/chip | +1,000 bonus |
| Big Stack | 12,000 | €9.99 | €0.000833/chip | +3,000 bonus |
| Whale | 35,000 | €24.99 | €0.000714/chip | +10,000 bonus |

> Larger packages = better value for user, but all packages profitable for the house. Bonus chips create perceived value and encourage upsizing.

### House Profitability Mechanisms

| Mechanism | Description | House Take |
|-----------|-------------|------------|
| **Tournament Rake** | 10% of entry chips deducted before prize pool | 10% of all tournament volume |
| **Game Entry Fees** | Some games cost chips to enter a paid round | 100% margin (cost is zero) |
| **Chip Package Margin** | Chips cost nothing to issue; all revenue is gross margin | ~95% gross margin |
| **Subscription Bonus** | Pro/Premium subscriptions include chips worth less than subscription price | Embedded in sub price |
| **Chip Expiry** | Unused chips expire after 12 months of inactivity (drives urgency) | Recapture unused liability |
| **Daily Free Chips** | Small daily reward (50 chips) keeps users engaged and buying more | Retention → LTV |
| **Loss Streak Offers** | After losing streaks, offer a chip top-up discount (pop-up) | Conversion of at-risk churners |
| **Ad-Free Toggle** | Spend 200 chips to remove ads for 24h (alternative to subscription) | Chip drain, repurchase cycle |
| **Cosmetic Shop** | Avatars, card backs, game skins purchased with chips | 100% margin |

### Chip Economy Rules (Legal Safety)
- Chips **cannot be exchanged back for real money** — ever
- Chips have **no monetary value** (stated clearly in T&C and UI)
- Chips are **non-transferable** between accounts
- This classifies as **social gaming**, not gambling in EU/US
- Consult legal before enabling any "prize" redemption feature
- If real prizes are ever introduced: obtain legal opinion per jurisdiction

### Unit Economics Target
- Average chip revenue per paying user per month: **€6.50**
- Chip package gross margin: **~95%**
- Tournament rake contribution to revenue: **~25%**
- Cosmetic shop contribution: **~15%**
- Target blended gross margin (chips + subscriptions): **>85%**

## Project Name
**NexusPlay** - Browser Gaming Platform

## Monorepo Structure
```
nexusplay/
├── apps/
│   ├── web/          # Next.js 14 frontend (App Router)
│   ├── api/          # Node.js/Fastify backend API
│   ├── ws/           # WebSocket/Colyseus multiplayer server
│   └── admin/        # Admin dashboard (Next.js)
├── packages/
│   ├── ui/           # Shared React component library
│   ├── game-sdk/     # Browser game SDK (Phaser.js wrapper)
│   ├── db/           # Prisma schema + migrations
│   └── config/       # Shared configs (ESLint, TS, Tailwind)
├── games/            # Individual game bundles
├── infrastructure/   # Terraform / Docker configs
├── docs/             # Documentation
├── AGENTS.md
├── ARCHITECTURE_REFERENCE.md
├── CLAUDE.md
└── SKILLS.md
```

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router, SSR for SEO)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand + React Query (TanStack)
- **Games**: Phaser.js (2D), Babylon.js (3D)
- **Real-time client**: Socket.io-client

### Backend
- **API**: Node.js + Fastify (REST + tRPC)
- **Auth**: NextAuth.js v5 + JWT
- **ORM**: Prisma
- **Validation**: Zod

### Data Layer
- **Primary DB**: PostgreSQL via Supabase (free tier scales to $25/mo)
- **Cache**: Redis via Upstash (serverless, pay-per-request)
- **File Storage**: Cloudflare R2 (S3-compatible, cheap egress)

### Real-time / Multiplayer
- **Framework**: Colyseus.js (purpose-built for browser multiplayer)
- **Transport**: WebSockets
- **Hosting**: Railway (scales to zero, cheap)

### Payments
- **PayPal**: PayPal JS SDK v2 (REST API backend)
- **iDEAL / Wero**: Mollie Payment Gateway (EU-focused, supports both)
- **Subscriptions**: Stripe (fallback for card payments)

### Infrastructure
- **Frontend**: Vercel (free tier, then Pro $20/mo)
- **API/WS**: Railway ($5/mo hobby, scales automatically)
- **Database**: Supabase (free → $25/mo Pro)
- **CDN**: Cloudflare (free)
- **CI/CD**: GitHub Actions

### Monitoring
- **APM**: Sentry (free tier)
- **Analytics**: Plausible (privacy-first, $9/mo)
- **Logs**: Axiom (free tier)
- **Uptime**: Better Uptime (free)

## Development Commands
```bash
# Install dependencies
pnpm install

# Start all services
pnpm dev

# Start specific app
pnpm --filter web dev
pnpm --filter api dev
pnpm --filter ws dev

# Database
pnpm db:push          # Push schema changes
pnpm db:migrate       # Run migrations
pnpm db:studio        # Open Prisma Studio

# Testing
pnpm test             # Run all tests
pnpm test:e2e         # Playwright E2E tests

# Build
pnpm build            # Build all apps

# Lint & Format
pnpm lint
pnpm format
```

## Environment Variables
Always reference `.env.example`. Never commit `.env` files. Required vars:
- `DATABASE_URL` - Supabase PostgreSQL connection string
- `REDIS_URL` - Upstash Redis URL
- `NEXTAUTH_SECRET` - Auth secret (min 32 chars)
- `PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET`
- `MOLLIE_API_KEY` - For iDEAL and Wero
- `CLOUDFLARE_R2_*` - Storage credentials
- `NEXT_PUBLIC_WS_URL` - WebSocket server URL

## Code Standards
- **TypeScript strict mode** enabled everywhere
- **No `any` types** - use proper typing or `unknown`
- **Zod validation** for all API input/output
- **Error boundaries** in all React components
- **Rate limiting** on all API endpoints
- **Input sanitization** before DB queries
- **OWASP Top 10** compliance required

## Security Rules (CISO Mandated)
- Never store raw passwords - bcrypt with salt rounds >= 12
- JWT access tokens: 15min TTL; refresh tokens: 7 days
- All payments handled server-side only - no secret keys in frontend
- CSP headers required on all pages
- Rate limit: 100 req/min per IP on auth routes
- SQL injection prevention via Prisma ORM only (no raw queries unless parameterized)
- XSS prevention: sanitize all user-generated content
- Audit log all payment transactions

## Agent Roles
See AGENTS.md for detailed agent definitions and responsibilities.

## Architecture
See ARCHITECTURE_REFERENCE.md for system design and diagrams.

## Skills
See SKILLS.md for recommended Claude Code skills and capabilities.

## Git Workflow
- `main` - production (protected, requires PR + review)
- `develop` - integration branch
- `feature/ISSUE-ID-description` - feature branches
- `fix/ISSUE-ID-description` - bug fix branches
- Semantic commits: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `perf:`

## Revenue Model Summary

| Stream | How | Margin |
|--------|-----|--------|
| Chip sales | Users buy packages in shop | ~95% |
| Subscriptions | Pro €4.99/mo, Premium €9.99/mo (includes chips) | ~80% |
| Tournament rake | 10% of entry chips retained by house | ~100% |
| Cosmetics | Avatars, skins, card backs sold for chips | ~100% |
| Advertising | Free-tier users see ads (Google AdSense / GameMonetize) | ~70% |

Break-even: ~300 paying users/month at average €6.50 chip spend + subscription mix.

## Cost Budget Targets (Monthly)
| Service | Free Tier | Production |
|---------|-----------|------------|
| Vercel | $0 | $20 |
| Railway | $5 | $20-50 |
| Supabase | $0 | $25 |
| Upstash Redis | $0 | $10 |
| Cloudflare | $0 | $0 |
| Mollie | 0% + €0.29/tx | Per transaction |
| PayPal | 3.49% + fixed | Per transaction |
| **Total** | **~$5** | **~$75-105** |

## Definition of Done
- [ ] Feature implemented with TypeScript strict
- [ ] Unit tests written (>80% coverage)
- [ ] E2E test for critical paths
- [ ] Security review passed
- [ ] Performance budget met (Lighthouse >90)
- [ ] Mobile responsive
- [ ] Accessible (WCAG 2.1 AA)
- [ ] SEO meta tags set
- [ ] Monitored with Sentry
