import Link from "next/link";
import * as Separator from "@radix-ui/react-separator";

const GAMES = [
  {
    slug: "snake",
    name: "Snake",
    description: "Eat, grow, don't crash. Classic arcade.",
    emoji: "🐍",
    tag: "Single Player",
    live: true,
  },
  {
    slug: "tic-tac-toe",
    name: "Tic-Tac-Toe",
    description: "Multiplayer 3×3 strategy.",
    emoji: "⭕",
    tag: "Multiplayer",
    live: false,
  },
  {
    slug: "blackjack",
    name: "Blackjack",
    description: "Beat the dealer. Card game classic.",
    emoji: "🃏",
    tag: "Casino",
    live: false,
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      {/* Hero */}
      <div className="mb-16 text-center">
        <h1 className="mb-4 text-6xl font-black tracking-tight">
          Play.<span className="text-brand-500"> Win.</span> Repeat.
        </h1>
        <p className="mx-auto max-w-lg text-lg text-zinc-400">
          Browser-based multiplayer games with a competitive chip economy. No downloads required.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/games"
            className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
          >
            Browse Games
          </Link>
          <Link
            href="/shop"
            className="rounded-xl bg-zinc-800 px-6 py-3 font-semibold text-white transition-colors hover:bg-zinc-700"
          >
            Get Chips
          </Link>
        </div>
      </div>

      <Separator.Root className="mb-16 h-px bg-zinc-800" />

      {/* Games */}
      <section>
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-2xl font-bold">Featured Games</h2>
          <Link href="/games" className="text-sm text-brand-500 hover:text-brand-400">
            View all →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GAMES.map((game) => (
            <div
              key={game.slug}
              className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-colors hover:border-zinc-600"
            >
              <div className="mb-4 flex items-start justify-between">
                <span className="text-4xl">{game.emoji}</span>
                <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-xs text-zinc-500">
                  {game.tag}
                </span>
              </div>
              <h3 className="mb-1 font-bold text-white">{game.name}</h3>
              <p className="mb-4 text-sm text-zinc-400">{game.description}</p>
              {game.live ? (
                <Link
                  href={`/games/${game.slug}`}
                  className="inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                >
                  Play Now
                </Link>
              ) : (
                <span className="inline-block rounded-lg bg-zinc-800 px-4 py-2 text-sm text-zinc-500">
                  Coming Soon
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      <Separator.Root className="my-16 h-px bg-zinc-800" />

      {/* Chip economy callout */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 text-center">
        <p className="mb-2 text-3xl">🪙</p>
        <h2 className="mb-2 text-xl font-bold">Virtual Chip Economy</h2>
        <p className="mx-auto max-w-md text-sm text-zinc-400">
          Buy chips to enter tournaments, unlock premium rounds, and purchase cosmetics.
          No cash-out — pure social gaming.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-xl bg-yellow-500/10 px-6 py-3 text-sm font-semibold text-yellow-400 ring-1 ring-yellow-500/30 transition-colors hover:bg-yellow-500/20"
        >
          View Chip Packages
        </Link>
      </section>
    </main>
  );
}
