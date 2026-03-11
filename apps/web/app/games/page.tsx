import type { Metadata } from "next";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

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
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-1 text-4xl font-black">Games</h1>
      <p className="mb-8 text-muted-foreground">Choose a game and start playing.</p>

      <Separator className="mb-10" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GAMES.map((game) => (
          <Card
            key={game.slug}
            className="flex flex-col transition-colors hover:border-primary/40"
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <span className="text-3xl">{game.emoji}</span>
                <Badge variant="secondary">{game.tag}</Badge>
              </div>
              <h2 className="font-bold">{game.name}</h2>
            </CardHeader>
            <CardContent className="flex-1 text-sm text-muted-foreground">
              {game.description}
            </CardContent>
            <CardFooter>
              {game.live ? (
                <Button asChild className="w-full">
                  <Link href={`/games/${game.slug}`}>Play</Link>
                </Button>
              ) : (
                <Button variant="secondary" className="w-full" disabled>
                  Coming Soon
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
