# Autonomous Gaming Platform - Claude Code Project Configuration

## Project Overview
A scalable, browser-based multiplayer gaming platform with integrated payments (PayPal, iDEAL, Wero), user authentication, and autonomous game management. Built for low operational cost and high profitability.

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
