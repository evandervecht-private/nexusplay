.PHONY: dev docker-all infra seed reset-db logs-api logs-ws logs-web shell-api shell-db clean stop ps ci ci-lint ci-test ci-build help

# ─── Default ────────────────────────────────────────────────────────────────
.DEFAULT_GOAL := help

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-18s\033[0m %s\n", $$1, $$2}'

# ─── Development ────────────────────────────────────────────────────────────
dev: infra ## Start infra in Docker + run apps natively (best HMR)
	pnpm dev

docker-all: ## Start everything in Docker (full stack)
	docker compose up --build

infra: ## Start only infra services (postgres, redis, minio, mailhog)
	docker compose up -d postgres redis minio minio-init mailhog
	@echo ""
	@echo "  Infra ready:"
	@echo "  Postgres  → localhost:5432  (user: nexusplay / pass: dev / db: nexusplay_dev)"
	@echo "  Redis     → localhost:6379"
	@echo "  MinIO S3  → localhost:9000  (key: minioadmin / secret: minioadmin)"
	@echo "  MinIO UI  → http://localhost:9001"
	@echo "  MailHog   → http://localhost:8025"
	@echo ""

tools: infra ## Start infra + dev tools (adminer DB GUI)
	docker compose --profile tools up -d

# ─── Database ────────────────────────────────────────────────────────────────
migrate: ## Run Prisma migrations
	pnpm db:migrate

seed: ## Seed database with test data
	pnpm db:seed

reset-db: ## Drop and recreate database, run migrations and seed
	@echo "Resetting database..."
	docker compose exec postgres psql -U nexusplay -c "DROP DATABASE IF EXISTS nexusplay_dev;" postgres
	docker compose exec postgres psql -U nexusplay -c "CREATE DATABASE nexusplay_dev;" postgres
	pnpm db:migrate
	pnpm db:seed
	@echo "Database reset complete."

studio: ## Open Prisma Studio (DB GUI in browser)
	pnpm db:studio

# ─── Logs ────────────────────────────────────────────────────────────────────
logs: ## Tail logs for all services
	docker compose logs -f

logs-api: ## Tail API server logs
	docker compose logs -f api

logs-ws: ## Tail WebSocket server logs
	docker compose logs -f ws

logs-web: ## Tail Next.js web logs
	docker compose logs -f web

logs-db: ## Tail Postgres logs
	docker compose logs -f postgres

# ─── Shells ──────────────────────────────────────────────────────────────────
shell-api: ## Open shell in API container
	docker compose exec api sh

shell-db: ## Open psql shell in Postgres container
	docker compose exec postgres psql -U nexusplay nexusplay_dev

shell-redis: ## Open redis-cli in Redis container
	docker compose exec redis redis-cli

# ─── Status ──────────────────────────────────────────────────────────────────
ps: ## Show running containers and their health
	docker compose ps

health: ## Check health of all services
	@echo "Checking service health..."
	@node -e "fetch('http://localhost:3001/health').then(()=>process.stdout.write('  API        ✓\n')).catch(()=>process.stdout.write('  API        ✗ (not running)\n'))" 2>/dev/null
	@node -e "fetch('http://localhost:2567/health').then(()=>process.stdout.write('  WebSocket  ✓\n')).catch(()=>process.stdout.write('  WebSocket  ✗ (not running)\n'))" 2>/dev/null
	@node -e "fetch('http://localhost:3000/api/health').then(()=>process.stdout.write('  Web        ✓\n')).catch(()=>process.stdout.write('  Web        ✗ (not running)\n'))" 2>/dev/null
	@docker compose exec -T redis redis-cli ping 2>/dev/null | grep -q PONG && echo "  Redis      ✓" || echo "  Redis      ✗"
	@docker compose exec -T postgres pg_isready -U nexusplay 2>/dev/null && echo "  Postgres   ✓" || echo "  Postgres   ✗"

# ─── Cleanup ─────────────────────────────────────────────────────────────────
stop: ## Stop all running containers
	docker compose down

clean: ## Stop containers and remove all volumes (DELETES DATA)
	@echo "WARNING: This will delete all local data. Press Ctrl+C to cancel..."
	@sleep 3
	docker compose down -v
	docker system prune -f

# ─── CI (local, via act) ─────────────────────────────────────────────────────
install-act: ## Install act (local GitHub Actions runner)
	curl -s https://raw.githubusercontent.com/nektos/act/master/install.sh | bash -s -- -b /usr/local/bin
	@echo "act installed. Run 'make ci' to test the pipeline locally."

ci: ## Run full CI pipeline locally (requires Docker + act)
	@cp -n .env.act.example .env.act 2>/dev/null || true
	act push --workflows .github/workflows/ci.yml

ci-lint: ## Run only the lint job locally
	act push --workflows .github/workflows/ci.yml --job lint-and-typecheck

ci-test: ## Run only the test job locally
	act push --workflows .github/workflows/ci.yml --job test

ci-build: ## Run only the build job locally
	act push --workflows .github/workflows/ci.yml --job build

ci-security: ## Run only the security audit job locally
	act push --workflows .github/workflows/ci.yml --job security-audit

# ─── Install ─────────────────────────────────────────────────────────────────
install: ## Install all dependencies
	pnpm install

setup: install infra migrate seed ## Full first-time setup (install + infra + migrate + seed)
	@echo ""
	@echo "  Setup complete! Run 'make dev' to start."
	@echo ""
