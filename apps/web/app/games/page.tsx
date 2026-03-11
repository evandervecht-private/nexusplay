import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Games" };

const GAMES = [
  {
    slug: "snake",
    name: "Snake",
    description: "Eat, grow, don't crash. Classic single-player arcade.",
    emoji: "🐍",
    tag: "Single Player",
    live: true,
    color: "from-green-500/20 to-emerald-500/5",
    border: "hover:border-green-500/30",
  },
  {
    slug: "tic-tac-toe",
    name: "Tic-Tac-Toe",
    description: "Multiplayer 3x3 strategy. First to three in a row wins.",
    emoji: "⭕",
    tag: "Multiplayer",
    live: false,
    color: "from-blue-500/20 to-cyan-500/5",
    border: "hover:border-blue-500/30",
  },
  {
    slug: "blackjack",
    name: "Blackjack",
    description: "Beat the dealer to 21. Standard casino rules.",
    emoji: "🃏",
    tag: "Casino",
    live: false,
    color: "from-amber-500/20 to-yellow-500/5",
    border: "hover:border-amber-500/30",
  },
  {
    slug: "chess",
    name: "Chess",
    description: "Online 1v1 chess with ELO ranking.",
    emoji: "♟️",
    tag: "Multiplayer",
    live: false,
    color: "from-slate-400/20 to-zinc-500/5",
    border: "hover:border-slate-400/30",
  },
  {
    slug: "poker",
    name: "Texas Hold'em",
    description: "6-player chip poker. No-limit hold'em.",
    emoji: "🂡",
    tag: "Multiplayer",
    live: false,
    color: "from-red-500/20 to-orange-500/5",
    border: "hover:border-red-500/30",
  },
  {
    slug: "battleship",
    name: "Battleship",
    description: "Classic naval grid strategy vs a real opponent.",
    emoji: "🚢",
    tag: "Multiplayer",
    live: false,
    color: "from-sky-500/20 to-blue-500/5",
    border: "hover:border-sky-500/30",
  },
] as const;

export default function GamesPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-12">
        <h1 className="mb-2 text-4xl font-black">Games</h1>
        <p className="text-muted-foreground">Choose a game and start playing.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {GAMES.map((game) => (
          <Link
            key={game.slug}
            href={game.live ? `/games/${game.slug}` : "#"}
            className={`group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-6 transition-all duration-300 ${game.border} ${game.live ? "cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20" : "cursor-default opacity-50"}`}
          >
            {/* Gradient bg */}
            <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-0 transition-opacity group-hover:opacity-100`} />

            <div className="relative">
              <div className="mb-4 flex items-start justify-between">
                <span className="text-4xl drop-shadow-lg">{game.emoji}</span>
                <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                  {game.tag}
                </Badge>
              </div>
              <h2 className="mb-1 text-lg font-bold">{game.name}</h2>
              <p className="mb-6 text-sm text-muted-foreground">{game.description}</p>
              <div className="mt-auto">
                {game.live ? (
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                    </span>
                    Play Now
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">Coming Soon</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
