import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import cookie from "@fastify/cookie";
import { prisma } from "@nexusplay/db";

const PORT = parseInt(process.env["PORT"] ?? "3001", 10);
const HOST = "0.0.0.0";

async function build() {
  const app = Fastify({
    logger: {
      level: process.env["LOG_LEVEL"] ?? "info",
      transport:
        process.env["NODE_ENV"] === "development"
          ? { target: "pino-pretty" }
          : undefined,
    },
  });

  // ── Plugins ──────────────────────────────────────────────────────────────
  await app.register(helmet, {
    contentSecurityPolicy: false, // configured in Next.js layer
  });

  await app.register(cors, {
    origin: process.env["CORS_ORIGIN"] ?? "http://localhost:3000",
    credentials: true,
  });

  await app.register(cookie, {
    secret: process.env["JWT_SECRET"] ?? "dev-secret",
  });

  await app.register(rateLimit, {
    global: true,
    max: 1000,
    timeWindow: "1 minute",
  });

  // ── Health Check ──────────────────────────────────────────────────────────
  app.get("/health", async (_req, reply) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return reply.send({
        status: "ok",
        service: "nexusplay-api",
        timestamp: new Date().toISOString(),
        db: "connected",
      });
    } catch {
      return reply.status(503).send({
        status: "error",
        service: "nexusplay-api",
        timestamp: new Date().toISOString(),
        db: "disconnected",
      });
    }
  });

  // ── Routes ────────────────────────────────────────────────────────────────
  // TODO: register route plugins here as they are built
  // app.register(authRoutes, { prefix: '/api/auth' })
  // app.register(gameRoutes, { prefix: '/api/games' })
  // app.register(chipRoutes, { prefix: '/api/chips' })
  // app.register(paymentRoutes, { prefix: '/api/payments' })
  // app.register(leaderboardRoutes, { prefix: '/api/leaderboard' })

  // Placeholder for not-yet-implemented routes (development only)
  app.get("/api/*", async (req, reply) => {
    return reply.status(404).send({
      error: "Not implemented yet",
      path: req.url,
      hint: "This route is planned — check GitHub issues for the relevant task",
    });
  });

  // ── Hooks ────────────────────────────────────────────────────────────────
  app.addHook("onClose", async () => {
    await prisma.$disconnect();
  });

  return app;
}

async function start() {
  const app = await build();
  try {
    await app.listen({ port: PORT, host: HOST });
    console.log(`\n  NexusPlay API  →  http://localhost:${PORT}`);
    console.log(`  Health check   →  http://localhost:${PORT}/health\n`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
