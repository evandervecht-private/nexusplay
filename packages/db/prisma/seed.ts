/**
 * NexusPlay Database Seed
 * Run with: pnpm db:seed
 *
 * Creates realistic test data for local development.
 */

import { PrismaClient, ChipTxType, TournamentStatus } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const BCRYPT_ROUNDS = 10; // lower rounds for seed speed
const DEV_PASSWORD = "dev1234";

async function main() {
  console.log("🌱 Seeding database...");

  // ── Users ────────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash(DEV_PASSWORD, BCRYPT_ROUNDS);

  const admin = await prisma.user.upsert({
    where: { email: "admin@nexusplay.local" },
    update: {},
    create: {
      email: "admin@nexusplay.local",
      username: "admin",
      passwordHash,
      role: "ADMIN",
      tier: "PREMIUM",
      chipBalance: 50_000,
      emailVerified: new Date(),
      lastActivityAt: new Date(),
    },
  });

  const proUser = await prisma.user.upsert({
    where: { email: "pro@nexusplay.local" },
    update: {},
    create: {
      email: "pro@nexusplay.local",
      username: "ProGamer",
      passwordHash,
      role: "USER",
      tier: "PRO",
      chipBalance: 2_500,
      emailVerified: new Date(),
      lastActivityAt: new Date(),
    },
  });

  const freeUser = await prisma.user.upsert({
    where: { email: "user@nexusplay.local" },
    update: {},
    create: {
      email: "user@nexusplay.local",
      username: "CasualPlayer",
      passwordHash,
      role: "USER",
      tier: "FREE",
      chipBalance: 150,
      emailVerified: new Date(),
      lastActivityAt: new Date(),
    },
  });

  const devUser = await prisma.user.upsert({
    where: { email: "dev@nexusplay.local" },
    update: {},
    create: {
      email: "dev@nexusplay.local",
      username: "GameDev",
      passwordHash,
      role: "DEVELOPER",
      tier: "PRO",
      chipBalance: 5_000,
      emailVerified: new Date(),
      lastActivityAt: new Date(),
    },
  });

  // Extra test users
  const extraUsers = await Promise.all(
    Array.from({ length: 6 }, (_, i) =>
      prisma.user.upsert({
        where: { email: `player${i + 1}@nexusplay.local` },
        update: {},
        create: {
          email: `player${i + 1}@nexusplay.local`,
          username: `Player${i + 1}`,
          passwordHash,
          role: "USER",
          tier: i < 2 ? "PRO" : "FREE",
          chipBalance: i < 2 ? 1_000 : 50,
          emailVerified: new Date(),
          lastActivityAt: new Date(Date.now() - i * 86400_000),
        },
      })
    )
  );

  console.log(
    `  ✓ Users: ${2 + extraUsers.length + 2} created (admin, pro, free, dev, player1-6)`
  );
  console.log(`    Credentials: any@nexusplay.local / ${DEV_PASSWORD}`);

  // ── Games ────────────────────────────────────────────────────────────────
  const games = await Promise.all([
    prisma.game.upsert({
      where: { slug: "snake-multiplayer" },
      update: {},
      create: {
        slug: "snake-multiplayer",
        title: "Snake Multiplayer",
        description:
          "The classic Snake game — but now you compete against up to 3 other players in real time! Collect apples to grow your snake while avoiding other snakes. Last snake alive wins.",
        shortDesc: "Classic Snake, now with real-time multiplayer for 2-4 players!",
        category: ["Arcade", "Multiplayer"],
        tags: ["snake", "multiplayer", "arcade", "real-time"],
        thumbnailUrl: "/public/games/snake-thumb.png",
        bundleUrl: "/games/snake-multiplayer/index.html",
        minPlayers: 1,
        maxPlayers: 4,
        isMultiplayer: true,
        isPublished: true,
        isPremium: false,
        playCount: 1_432,
        rating: 4.3,
        ratingCount: 87,
        maxScore: 5_000,
        minDuration: 10,
      },
    }),
    prisma.game.upsert({
      where: { slug: "memory-match" },
      update: {},
      create: {
        slug: "memory-match",
        title: "Memory Match",
        description:
          "Flip cards and find matching pairs. Test your memory in single player or race against a friend in turn-based multiplayer. Multiple themes available.",
        shortDesc: "Flip cards and match pairs — solo or against a friend!",
        category: ["Puzzle", "Card"],
        tags: ["memory", "cards", "puzzle", "turn-based"],
        thumbnailUrl: "/public/games/memory-thumb.png",
        bundleUrl: "/games/memory-match/index.html",
        minPlayers: 1,
        maxPlayers: 2,
        isMultiplayer: true,
        isPublished: true,
        isPremium: false,
        playCount: 2_891,
        rating: 4.6,
        ratingCount: 203,
        maxScore: 10_000,
        minDuration: 20,
      },
    }),
    prisma.game.upsert({
      where: { slug: "blackjack" },
      update: {},
      create: {
        slug: "blackjack",
        title: "Blackjack",
        description:
          "Classic casino-style Blackjack. Play against the house and try to beat the dealer without going over 21. Wager your chips and climb the leaderboard.",
        shortDesc: "Beat the dealer in classic Blackjack — wager your chips!",
        category: ["Card", "Casino"],
        tags: ["blackjack", "cards", "casino", "chips"],
        thumbnailUrl: "/public/games/blackjack-thumb.png",
        bundleUrl: "/games/blackjack/index.html",
        minPlayers: 1,
        maxPlayers: 1,
        isMultiplayer: false,
        isPublished: true,
        isPremium: false,
        playCount: 3_204,
        rating: 4.1,
        ratingCount: 156,
        maxScore: 100_000,
        minDuration: 30,
      },
    }),
    prisma.game.upsert({
      where: { slug: "pong" },
      update: {},
      create: {
        slug: "pong",
        title: "Pong",
        description:
          "The original arcade classic, reimagined for online play. Challenge another player in real-time Pong. Server-authoritative ball physics ensure fair play.",
        shortDesc: "Real-time 2-player Pong — the original arcade classic!",
        category: ["Arcade", "Multiplayer"],
        tags: ["pong", "multiplayer", "arcade", "classic"],
        thumbnailUrl: "/public/games/pong-thumb.png",
        bundleUrl: "/games/pong/index.html",
        minPlayers: 2,
        maxPlayers: 2,
        isMultiplayer: true,
        isPublished: true,
        isPremium: false,
        playCount: 987,
        rating: 4.0,
        ratingCount: 45,
        maxScore: 10,
        minDuration: 60,
      },
    }),
    prisma.game.upsert({
      where: { slug: "tic-tac-toe" },
      update: {},
      create: {
        slug: "tic-tac-toe",
        title: "Tic-Tac-Toe",
        description:
          "Simple but strategic! Play classic 3x3 Tic-Tac-Toe against the AI or challenge a friend online. Also includes the Gomoku 5-in-a-row variant.",
        shortDesc: "Classic Tic-Tac-Toe vs AI or a friend — includes Gomoku!",
        category: ["Board", "Multiplayer"],
        tags: ["tictactoe", "strategy", "board", "gomoku"],
        thumbnailUrl: "/public/games/tictactoe-thumb.png",
        bundleUrl: "/games/tic-tac-toe/index.html",
        minPlayers: 1,
        maxPlayers: 2,
        isMultiplayer: true,
        isPublished: true,
        isPremium: false,
        playCount: 4_102,
        rating: 3.9,
        ratingCount: 312,
        maxScore: 10,
        minDuration: 5,
      },
    }),
    prisma.game.upsert({
      where: { slug: "maze-runner-3d" },
      update: {},
      create: {
        slug: "maze-runner-3d",
        title: "3D Maze Runner",
        description:
          "Race through procedurally generated 3D mazes in your browser. Compete with up to 7 other players to find the exit first. Powered by Babylon.js WebGL.",
        shortDesc: "Race through 3D mazes against 8 players — Premium exclusive!",
        category: ["3D", "Racing", "Multiplayer"],
        tags: ["3d", "maze", "race", "multiplayer", "webgl"],
        thumbnailUrl: "/public/games/maze-thumb.png",
        bundleUrl: "/games/maze-runner-3d/index.html",
        minPlayers: 2,
        maxPlayers: 8,
        isMultiplayer: true,
        isPublished: true,
        isPremium: true,
        playCount: 234,
        rating: 4.8,
        ratingCount: 28,
        maxScore: 0,
        minDuration: 120,
      },
    }),
  ]);

  console.log(`  ✓ Games: ${games.length} seeded`);

  // ── Chip Transactions ────────────────────────────────────────────────────
  // Give pro user a realistic chip history
  await prisma.chipTransaction.createMany({
    skipDuplicates: true,
    data: [
      {
        id: "seed-chip-1",
        userId: proUser.id,
        type: ChipTxType.PURCHASE,
        amount: 2_000,
        balance: 2_000,
        description: "Purchased Value Pack (2,000 chips)",
        createdAt: new Date(Date.now() - 7 * 86400_000),
      },
      {
        id: "seed-chip-2",
        userId: proUser.id,
        type: ChipTxType.BONUS,
        amount: 200,
        balance: 2_200,
        description: "Bonus chips for Value Pack",
        createdAt: new Date(Date.now() - 7 * 86400_000),
      },
      {
        id: "seed-chip-3",
        userId: proUser.id,
        type: ChipTxType.EARN,
        amount: 50,
        balance: 2_250,
        description: "Daily login reward (day 1)",
        createdAt: new Date(Date.now() - 6 * 86400_000),
      },
      {
        id: "seed-chip-4",
        userId: proUser.id,
        type: ChipTxType.SPEND,
        amount: -100,
        balance: 2_150,
        description: "Tournament entry: Weekly Snake Championship",
        createdAt: new Date(Date.now() - 2 * 86400_000),
      },
      {
        id: "seed-chip-5",
        userId: proUser.id,
        type: ChipTxType.EARN,
        amount: 350,
        balance: 2_500,
        description: "Tournament prize: 2nd place",
        createdAt: new Date(Date.now() - 86400_000),
      },
      {
        id: "seed-chip-6",
        userId: freeUser.id,
        type: ChipTxType.EARN,
        amount: 100,
        balance: 100,
        description: "Welcome bonus: complete your first game",
        createdAt: new Date(Date.now() - 3 * 86400_000),
      },
      {
        id: "seed-chip-7",
        userId: freeUser.id,
        type: ChipTxType.EARN,
        amount: 50,
        balance: 150,
        description: "Daily login reward",
        createdAt: new Date(Date.now() - 86400_000),
      },
    ],
  });

  console.log("  ✓ Chip transactions: history seeded for test users");

  // ── Scores ───────────────────────────────────────────────────────────────
  const allUsers = [admin, proUser, freeUser, devUser, ...extraUsers];
  const scoreData = [];

  for (const game of games.slice(0, 4)) {
    for (const user of allUsers) {
      scoreData.push({
        userId: user.id,
        gameId: game.id,
        score: Math.floor(Math.random() * (game.maxScore ?? 1_000)),
        createdAt: new Date(Date.now() - Math.random() * 7 * 86400_000),
      });
    }
  }

  await prisma.score.createMany({ data: scoreData, skipDuplicates: true });
  console.log(`  ✓ Scores: ${scoreData.length} leaderboard entries seeded`);

  // ── Tournament ───────────────────────────────────────────────────────────
  const snakeGame = games.find((g) => g.slug === "snake-multiplayer")!;
  const tournament = await prisma.tournament.upsert({
    where: { id: "seed-tournament-1" },
    update: {},
    create: {
      id: "seed-tournament-1",
      gameId: snakeGame.id,
      title: "Weekly Snake Championship",
      description: "Compete in our weekly Snake tournament. Top 3 win chips!",
      entryFee: 100,
      maxPlayers: 16,
      prizePool: 0, // calculated on entry
      rake: 0,
      status: TournamentStatus.UPCOMING,
      startsAt: new Date(Date.now() + 2 * 86400_000), // starts in 2 days
      endsAt: new Date(Date.now() + 3 * 86400_000),
    },
  });

  // Enter proUser into the tournament
  await prisma.tournamentEntry.upsert({
    where: {
      tournamentId_userId: {
        tournamentId: tournament.id,
        userId: proUser.id,
      },
    },
    update: {},
    create: {
      tournamentId: tournament.id,
      userId: proUser.id,
    },
  });

  console.log("  ✓ Tournament: Weekly Snake Championship seeded");

  // ── Notifications ────────────────────────────────────────────────────────
  await prisma.notification.createMany({
    skipDuplicates: true,
    data: [
      {
        id: "seed-notif-1",
        userId: proUser.id,
        type: "chip_credited",
        title: "Chips credited!",
        body: "350 chips have been added to your balance (Tournament prize).",
        isRead: false,
        metadata: { amount: 350 },
        createdAt: new Date(Date.now() - 86400_000),
      },
      {
        id: "seed-notif-2",
        userId: proUser.id,
        type: "tournament_upcoming",
        title: "Tournament starting soon",
        body: "Weekly Snake Championship starts in 2 days. You're registered!",
        isRead: true,
        metadata: { tournamentId: tournament.id },
      },
      {
        id: "seed-notif-3",
        userId: freeUser.id,
        type: "achievement",
        title: "Achievement unlocked!",
        body: "First Win — You won your first game. 100 chips awarded!",
        isRead: false,
        metadata: { achievement: "first_win", chipsAwarded: 100 },
      },
    ],
  });

  console.log("  ✓ Notifications: seeded");

  // ── Summary ──────────────────────────────────────────────────────────────
  console.log("");
  console.log("✅ Seed complete! Test accounts:");
  console.log("┌─────────────────────────────────────────────────────────────┐");
  console.log("│  Email                      │ Role      │ Tier    │ Chips   │");
  console.log("├─────────────────────────────────────────────────────────────┤");
  console.log("│  admin@nexusplay.local      │ ADMIN     │ PREMIUM │ 50,000  │");
  console.log("│  pro@nexusplay.local        │ USER      │ PRO     │  2,500  │");
  console.log("│  user@nexusplay.local       │ USER      │ FREE    │    150  │");
  console.log("│  dev@nexusplay.local        │ DEVELOPER │ PRO     │  5,000  │");
  console.log("│  player1-6@nexusplay.local  │ USER      │ mixed   │  mixed  │");
  console.log("└─────────────────────────────────────────────────────────────┘");
  console.log(`  Password for all accounts: ${DEV_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
