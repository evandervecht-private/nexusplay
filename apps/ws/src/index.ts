import { Server } from "colyseus";
import { WebSocketTransport } from "@colyseus/core";
import { RedisPresence } from "@colyseus/redis-presence";
import { RedisDriver } from "@colyseus/redis-driver";
import express from "express";
import { createServer } from "http";
import { LobbyRoom } from "./rooms/LobbyRoom.js";
import { TicTacToeRoom } from "./rooms/TicTacToeRoom.js";

const PORT = parseInt(process.env["PORT"] ?? "2567", 10);
const REDIS_URL = process.env["REDIS_URL"] ?? "redis://localhost:6379";

async function main() {
  const app = express();
  const httpServer = createServer(app);

  // ── Health check (for Docker + Railway) ────────────────────────────────
  app.get("/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "nexusplay-ws",
      timestamp: new Date().toISOString(),
    });
  });

  // ── Colyseus Server ────────────────────────────────────────────────────
  const gameServer = new Server({
    transport: new WebSocketTransport({ server: httpServer }),
    // Share presence and driver via Redis for horizontal scaling
    presence: new RedisPresence(REDIS_URL),
    driver: new RedisDriver(REDIS_URL),
  });

  // ── Register Rooms ─────────────────────────────────────────────────────
  gameServer.define("lobby", LobbyRoom);
  gameServer.define("tictactoe", TicTacToeRoom).enableRealtimeListing();

  // More rooms added per game issue:
  // gameServer.define("snake", SnakeRoom).enableRealtimeListing();
  // gameServer.define("pong", PongRoom).enableRealtimeListing();
  // gameServer.define("memory", MemoryRoom).enableRealtimeListing();

  // ── Start ──────────────────────────────────────────────────────────────
  await gameServer.listen(PORT);
  console.log(`\n  NexusPlay WS   →  ws://localhost:${PORT}`);
  console.log(`  Health check   →  http://localhost:${PORT}/health\n`);
}

main().catch((err) => {
  console.error("WebSocket server failed to start:", err);
  process.exit(1);
});
