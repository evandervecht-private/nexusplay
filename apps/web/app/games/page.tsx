import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Games" };

const GAMES = [
  {
    slug: "snake",
    name: "Snake",
    description: "Eat, grow, don't crash. Classic single-player arcade.",
    emoji: "🐍",
    tag: "Single Player",
    live: true,
  },
  {
    slug: "tic-tac-toe",
    name: "Tic-Tac-Toe",
    description: "Multiplayer 3x3 strategy. First to three in a row wins.",
    emoji: "⭕",
    tag: "Multiplayer",
    live: false,
  },
  {
    slug: "blackjack",
    name: "Blackjack",
    description: "Beat the dealer to 21. Standard casino rules.",
    emoji: "🃏",
    tag: "Casino",
    live: false,
  },
  {
    slug: "chess",
    name: "Chess",
    description: "Online 1v1 chess with ELO ranking.",
    emoji: "♟️",
    tag: "Multiplayer",
    live: false,
  },
  {
    slug: "poker",
    name: "Texas Hold'em",
    description: "6-player chip poker. No-limit hold'em.",
    emoji: "🂡",
    tag: "Multiplayer",
    live: false,
  },
  {
    slug: "battleship",
    name: "Battleship",
    description: "Classic naval grid strategy vs a real opponent.",
    emoji: "🚢",
    tag: "Multiplayer",
    live: false,
  },
] as const;

export default function GamesPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10">
        <h1 className="mb-1 text-xl font-semibold">Games</h1>
        <p className="text-[13px] text-muted-foreground">Choose a game and start playing.</p>
      </div>

      <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {GAMES.map((game) => (
          <div
            key={game.slug}
            className={`group flex flex-col bg-card p-6 transition-colors hover:bg-accent/50 ${!game.live ? "opacity-50" : ""}`}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-3xl">{game.emoji}</span>
              <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {game.tag}
              </span>
            </div>
            <h2 className="mb-1 text-[15px] font-semibold">{game.name}</h2>
            <p className="mb-5 flex-1 text-[13px] text-muted-foreground">{game.description}</p>
            {game.live ? (
              <Link
                href={`/games/${game.slug}`}
                className="inline-flex items-center gap-2 text-[13px] font-medium text-primary transition-colors hover:text-primary/80"
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
                Play Now
              </Link>
            ) : (
              <span className="text-[13px] text-muted-foreground">Coming Soon</span>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
