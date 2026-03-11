import type { Metadata } from "next";
import Link from "next/link";
import * as Separator from "@radix-ui/react-separator";

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
    description: "Multiplayer 3×3 strategy. First to three in a row wins.",
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
    name: "Texas Hold&apos;em",
    description: "6-player chip poker. No-limit hold&apos;em.",
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
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-1 text-4xl font-black">Games</h1>
      <p className="mb-8 text-zinc-400">Choose a game and start playing.</p>

      <Separator.Root className="mb-10 h-px bg-zinc-800" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GAMES.map((game) => (
          <div
            key={game.slug}
            className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 transition-colors hover:border-zinc-600 hover:bg-zinc-900"
          >
            <div className="mb-4 flex items-start justify-between">
              <span className="text-3xl">{game.emoji}</span>
              <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-xs text-zinc-500">
                {game.tag}
              </span>
            </div>
            <h2 className="mb-1 font-bold text-white">{game.name}</h2>
            <p className="mb-4 flex-1 text-sm text-zinc-400">{game.description}</p>
            {game.live ? (
              <Link
                href={`/games/${game.slug}`}
                className="block rounded-lg bg-brand-600 py-2 text-center text-sm font-bold text-white transition-colors hover:bg-brand-700"
              >
                Play
              </Link>
            ) : (
              <span className="block rounded-lg bg-zinc-800 py-2 text-center text-sm text-zinc-500">
                Coming Soon
              </span>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
