import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const GAMES = [
  {
    slug: "snake",
    name: "Snake",
    description: "Eat, grow, don't crash. The arcade classic, reimagined.",
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
];

const CHIP_PACKAGES = [
  { chips: "500", price: "0.99", label: "Starter" },
  { chips: "2,000", price: "2.99", label: "Popular", featured: true },
  { chips: "5,500", price: "4.99", label: "Value" },
];

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Radial glow */}
        <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/[0.08] blur-[120px]" />

        <div className="mx-auto max-w-6xl px-6 pb-24 pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-6 border-primary/30 text-primary">
              Now in Early Access
            </Badge>
            <h1 className="mb-6 text-5xl font-black tracking-tight sm:text-7xl">
              Play.{" "}
              <span className="text-gradient">Win.</span>{" "}
              Repeat.
            </h1>
            <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Browser-based multiplayer games with a competitive chip economy.
              No downloads, no installs — just play.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="h-12 px-8 text-base glow-md">
                <Link href="/games">Browse Games</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base">
                <Link href="/shop">Get Chips</Link>
              </Button>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mx-auto mt-20 flex max-w-lg justify-center divide-x divide-white/10">
            {[
              { value: "1", label: "Game live" },
              { value: "5", label: "Coming soon" },
              { value: "Free", label: "To start" },
            ].map((stat) => (
              <div key={stat.label} className="flex-1 text-center">
                <p className="text-2xl font-black text-foreground">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Games */}
      <section className="border-t border-white/[0.06] bg-card/30">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-black">Featured Games</h2>
              <p className="mt-2 text-muted-foreground">Jump in and start playing.</p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/games">View all</Link>
            </Button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {GAMES.map((game) => (
              <Link
                key={game.slug}
                href={game.live ? `/games/${game.slug}` : "#"}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-6 transition-all duration-300 ${game.border} ${game.live ? "cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20" : "cursor-default opacity-60"}`}
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
                  <h3 className="mb-1 text-lg font-bold">{game.name}</h3>
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
        </div>
      </section>

      {/* Chip Economy */}
      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="mb-4 inline-block text-5xl">🪙</span>
            <h2 className="mb-3 text-3xl font-black">Virtual Chip Economy</h2>
            <p className="mb-12 text-muted-foreground">
              Buy chips, enter tournaments, unlock cosmetics.
              No cash-out — pure social gaming.
            </p>
          </div>

          <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-3">
            {CHIP_PACKAGES.map((pkg) => (
              <div
                key={pkg.label}
                className={`relative flex flex-col items-center rounded-2xl border p-6 text-center transition-all duration-300 ${
                  pkg.featured
                    ? "border-primary/40 bg-primary/[0.06] glow-sm hover:glow-md"
                    : "border-white/[0.06] bg-card hover:border-white/10"
                }`}
              >
                {pkg.featured && (
                  <Badge className="absolute -top-2.5 text-[10px] uppercase tracking-wider">
                    Most Popular
                  </Badge>
                )}
                <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  {pkg.label}
                </p>
                <p className="mb-1 text-3xl font-black">{pkg.chips}</p>
                <p className="mb-1 text-xs text-muted-foreground">chips</p>
                <p className="mt-3 text-xl font-bold text-primary">&euro;{pkg.price}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button asChild variant="outline" size="lg" className="h-12 px-8">
              <Link href="/shop">View All Packages</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
