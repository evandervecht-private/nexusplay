# NexusPlay - Suggested Claude Code Skills

Skills are reusable agentic workflows that can be invoked via `/skill-name` in Claude Code.
Define these in your `~/.claude/skills/` directory or reference them for team-wide use.

---

## Core Development Skills

### `/scaffold-game`
**Purpose**: Scaffold a new browser game with Phaser.js boilerplate and Colyseus multiplayer integration.

**Triggers**: "create a new game", "add game [name]", "scaffold multiplayer game"

**Actions**:
1. Create `games/{slug}/` directory structure
2. Generate `manifest.json` from game spec
3. Create Phaser.js game template with NexusPlaySDK integration
4. Create Colyseus Room class (`apps/ws/src/rooms/`)
5. Add Prisma seed entry for the game
6. Generate game detail page (`apps/web/app/games/[slug]/`)
7. Add E2E test scaffold

**Prompt**:
```
You are scaffolding a new browser game for NexusPlay.
Required: game name, slug, min/max players, game type (single/multi), category.
Generate: Phaser.js game class, Colyseus room (if multiplayer), manifest.json, Next.js game page.
Follow the Game Integration Architecture in ARCHITECTURE_REFERENCE.md.
Use TypeScript throughout. Include NexusPlaySDK.submitScore() call on game end.
```

---

### `/add-payment-method`
**Purpose**: Integrate a new payment method following the existing PayPal/Mollie patterns.

**Triggers**: "add payment", "integrate [provider]"

**Actions**:
1. Add provider to `PaymentProvider` enum in Prisma schema
2. Create `apps/api/src/routes/payments/{provider}.ts`
3. Create webhook handler
4. Add idempotency key generation
5. Update frontend checkout component
6. Write unit tests for payment flow

---

### `/security-review`
**Purpose**: Run CISO-perspective security review on changed files.

**Triggers**: "security review", "check security", "CISO review"

**Actions**:
1. Scan for hardcoded secrets (regex patterns)
2. Check for SQL injection vectors (raw queries without parameterization)
3. Verify input validation (Zod schemas present)
4. Check auth middleware on all new routes
5. Validate rate limiting on auth routes
6. Check for XSS vectors (unescaped user content)
7. Verify payment routes are server-side only
8. Output: severity-graded finding list (CRITICAL/HIGH/MEDIUM/LOW)

**Prompt**:
```
You are the CISO of NexusPlay performing a security review.
Analyze the provided code for OWASP Top 10 vulnerabilities.
Check: injection, broken auth, sensitive data exposure, XXE, broken access control,
security misconfiguration, XSS, insecure deserialization, known vulnerabilities, logging gaps.
Output each finding as: [SEVERITY] Description | File:Line | Recommendation
```

---

### `/db-migration`
**Purpose**: Safely create and apply a Prisma database migration.

**Triggers**: "add database field", "create migration", "update schema"

**Actions**:
1. Update `packages/db/schema.prisma`
2. Run `prisma migrate dev --name {migration-name}`
3. Verify migration file generated correctly
4. Update any affected service/repository files
5. Add seed data if needed

---

### `/seo-optimize-page`
**Purpose**: Ensure a Next.js page meets all SEO requirements from the SEO Agent spec.

**Triggers**: "optimize SEO", "add SEO to", "SEO review"

**Actions**:
1. Add/update `generateMetadata()` function
2. Add OG image tags (1200x630)
3. Add `VideoGame` or `WebPage` structured data (JSON-LD)
4. Verify canonical URL set
5. Check page is SSR (not CSR) for SEO-critical pages
6. Verify heading hierarchy (one H1, logical H2-H6)
7. Add/check alt text on all images
8. Output: SEO checklist completion status

---

### `/create-api-route`
**Purpose**: Scaffold a new Fastify API route with auth, validation, and tests.

**Triggers**: "create API route", "add endpoint", "new route"

**Actions**:
1. Create route file in `apps/api/src/routes/`
2. Add Zod input schema
3. Add JWT auth middleware
4. Add rate limiting
5. Implement route handler with error handling
6. Register route in server
7. Write unit test with supertest
8. Update API documentation

---

### `/cost-analysis`
**Purpose**: CFO-perspective analysis of a proposed feature or infrastructure change.

**Triggers**: "cost analysis", "financial impact", "CFO review"

**Prompt**:
```
You are the CFO of NexusPlay. Analyze the cost impact of the proposed change.
Consider: infrastructure costs (Railway, Vercel, Supabase, Upstash), payment processing fees,
developer time (at $100/hr), maintenance burden, and revenue impact.
Output: monthly cost delta, break-even analysis, recommendation (build/buy/defer).
```

---

### `/generate-game-page-content`
**Purpose**: SEO Agent generates game page copy (300+ words) for a new game.

**Triggers**: "write game description", "generate game page", "SEO content for game"

**Actions**:
1. Generate SEO-optimized game title and meta description
2. Write 300+ word game description targeting primary keywords
3. Generate "How to Play" section
4. Generate FAQ section (5 questions)
5. Suggest tags and categories
6. Output structured content ready for CMS

---

### `/multiplayer-load-test`
**Purpose**: Generate a Colyseus load test for a game room.

**Triggers**: "load test", "stress test multiplayer", "test room capacity"

**Actions**:
1. Generate `@colyseus/loadtest` script for specified room type
2. Simulate N concurrent players
3. Measure: room creation time, message latency, state sync delay
4. Output performance report with bottleneck identification

---

### `/generate-github-issues`
**Purpose**: Generate GitHub issues for a feature or epic from a high-level description.

**Triggers**: "create issues for", "break down into issues"

**Actions**:
1. Decompose feature into atomic tasks
2. Assign labels (frontend, backend, multiplayer, payment, security, seo)
3. Assign agent responsible (from AGENTS.md)
4. Estimate complexity (S/M/L/XL)
5. Create issues via `gh issue create`
6. Link issues to milestone

---

### `/performance-audit`
**Purpose**: CTO-directed performance audit of frontend and backend.

**Triggers**: "performance audit", "optimize performance", "lighthouse check"

**Actions**:
1. Check Lighthouse scores (target: >90 all metrics)
2. Identify bundle size issues (`next build` analysis)
3. Check for missing ISR/SSR caching opportunities
4. Review DB query patterns (N+1 queries, missing indexes)
5. Check Redis cache hit rates
6. Output: prioritized optimization list with estimated impact

---

## Business & Strategy Skills

### `/market-analysis`
**Purpose**: Business Consultant performs competitive analysis for a feature.

**Triggers**: "competitive analysis", "market research", "what do competitors do"

**Prompt**:
```
You are the Business Consultant for NexusPlay. Analyze the gaming platform market.
Competitors: Poki.com, CrazyGames, Miniclip, GameDistribution.
For any proposed feature, evaluate: do competitors have it, is it a differentiator,
what is the user demand signal, revenue potential.
Output: competitive matrix, recommendation, GTM approach.
```

---

### `/revenue-model-check`
**Purpose**: Validate a feature against the revenue model and pricing strategy.

**Triggers**: "monetize", "pricing for", "revenue check"

**Prompt**:
```
You are the CFO and Business Consultant for NexusPlay.
Pricing tiers: Free (ads, limited games), Pro $4.99/mo (all games, no ads), Premium $9.99/mo (+ exclusives + tournaments).
Evaluate: which tier does this feature belong to, how does it affect conversion, churn, and LTV.
Output: recommended tier placement, pricing, expected revenue impact.
```

---

## Operations Skills

### `/incident-response`
**Purpose**: Guide through an incident response following CISO playbook.

**Triggers**: "incident", "security breach", "site down", "payment failing"

**Actions**:
1. Classify incident (P1/P2/P3)
2. Identify affected systems
3. Escalation contacts
4. Immediate mitigation steps
5. Communication template (status page update)
6. Post-mortem template

---

### `/deploy-checklist`
**Purpose**: Pre-deployment checklist enforced by CTO/CISO.

**Triggers**: "ready to deploy", "deploy checklist", "pre-launch check"

**Checklist**:
- [ ] All tests passing (unit + E2E)
- [ ] `npm audit` clean (no HIGH/CRITICAL)
- [ ] Environment variables set in target environment
- [ ] DB migration tested on staging
- [ ] Rollback plan documented
- [ ] Feature flags configured
- [ ] Monitoring alerts active
- [ ] Lighthouse scores >90
- [ ] Security headers verified
- [ ] Payment webhooks tested end-to-end

---

### `/monthly-report`
**Purpose**: Controller generates monthly financial and operational report.

**Triggers**: "monthly report", "end of month", "financial report"

**Actions**:
1. Pull MRR from payment DB (PayPal + Mollie)
2. Calculate churn rate from subscription changes
3. Compute CAC from spend vs new users
4. Infrastructure cost summary
5. Gross margin calculation
6. Top performing games by session time
7. Generate PDF/markdown report

---

## Skill Configuration

### Installing Skills Locally

Create skill files in `~/.claude/skills/`:

```bash
mkdir -p ~/.claude/skills
# Copy skill definitions from this file
# Each skill is a markdown file with a system prompt
```

### Skill File Format

```markdown
# /skill-name
## Description
What this skill does

## System Prompt
The prompt injected when skill is invoked

## Required Context
- Files to read before execution
- Environment variables needed

## Output Format
What the skill produces
```

### Recommended Skill Load Order
For complex multi-agent tasks, load skills in this order:
1. Architecture context (`ARCHITECTURE_REFERENCE.md`)
2. Agent persona (`AGENTS.md` relevant section)
3. Task-specific skill prompt
4. Code context (relevant source files)
