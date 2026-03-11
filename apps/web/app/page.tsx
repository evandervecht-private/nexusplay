import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

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
          Play.<span className="text-primary"> Win.</span> Repeat.
        </h1>
        <p className="mx-auto max-w-lg text-lg text-muted-foreground">
          Browser-based multiplayer games with a competitive chip economy. No downloads required.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/games">Browse Games</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/shop">Get Chips</Link>
          </Button>
        </div>
      </div>

      <Separator className="mb-16" />

      {/* Featured games */}
      <section>
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-2xl font-bold">Featured Games</h2>
          <Button asChild variant="link" size="sm">
            <Link href="/games">View all →</Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GAMES.map((game) => (
            <Card key={game.slug} className="flex flex-col transition-colors hover:border-primary/40">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <span className="text-4xl">{game.emoji}</span>
                  <Badge variant="secondary">{game.tag}</Badge>
                </div>
                <h3 className="text-base font-bold">{game.name}</h3>
              </CardHeader>
              <CardContent className="flex-1 text-sm text-muted-foreground">
                {game.description}
              </CardContent>
              <CardFooter>
                {game.live ? (
                  <Button asChild className="w-full">
                    <Link href={`/games/${game.slug}`}>Play Now</Link>
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
      </section>

      <Separator className="my-16" />

      {/* Chip economy callout */}
      <Card className="text-center">
        <CardHeader>
          <p className="text-3xl">🪙</p>
          <h2 className="text-xl font-bold">Virtual Chip Economy</h2>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Buy chips to enter tournaments, unlock premium rounds, and purchase cosmetics.
          No cash-out — pure social gaming.
        </CardContent>
        <CardFooter className="justify-center">
          <Button asChild variant="outline">
            <Link href="/shop">View Chip Packages</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
