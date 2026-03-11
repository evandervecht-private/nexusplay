import Link from "next/link";
import { Button } from "@/components/ui/button";

const GAMES = [
  {
    slug: "snake",
    name: "Snake",
    description: "Eat, grow, don't crash. The arcade classic.",
    emoji: "🐍",
    tag: "Single Player",
    live: true,
  },
  {
    slug: "tic-tac-toe",
    name: "Tic-Tac-Toe",
    description: "Multiplayer 3x3 strategy.",
    emoji: "⭕",
    tag: "Multiplayer",
    live: false,
  },
  {
    slug: "blackjack",
    name: "Blackjack",
    description: "Beat the dealer to 21.",
    emoji: "🃏",
    tag: "Casino",
    live: false,
  },
];

/* ── tiny floating UI "component" blocks (decorative) ── */
function FloatingCard({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <div className={`pointer-events-none absolute hidden rounded-xl border border-border/60 bg-card/90 p-3 shadow-2xl shadow-black/30 backdrop-blur-sm lg:block ${className}`}>
      {children}
    </div>
  );
}

export default function HomePage() {
  return (
    <main>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border/50">
        {/* Subtle green glow */}
        <div className="absolute left-1/2 top-1/3 -z-10 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.04] blur-[100px]" />

        <div className="relative mx-auto max-w-6xl px-6 pb-28 pt-24">
          {/* Floating decorative components */}
          <FloatingCard className="animate-float -left-4 top-8 w-48 rotate-[-4deg]">
            <div className="mb-2 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-[11px] font-medium text-foreground">Live Game</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted">
              <div className="h-1.5 w-3/4 rounded-full bg-primary" />
            </div>
            <p className="mt-1.5 text-[10px] text-muted-foreground">74% Loading...</p>
          </FloatingCard>

          <FloatingCard className="animate-float-delayed -right-2 top-4 w-44 rotate-[3deg]">
            <p className="mb-1.5 text-[11px] font-medium">Select game</p>
            <div className="flex items-center justify-between rounded-md border border-border bg-muted/50 px-2 py-1">
              <span className="text-[11px] text-muted-foreground">Choose...</span>
              <svg width="10" height="10" viewBox="0 0 10 10" className="text-muted-foreground">
                <path d="M3 4l2 2 2-2" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            </div>
          </FloatingCard>

          <FloatingCard className="animate-float-slow -left-2 bottom-16 w-52 rotate-[2deg]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium">Remember me</span>
              <div className="h-4 w-7 rounded-full bg-primary p-0.5">
                <div className="h-3 w-3 translate-x-3 rounded-full bg-white shadow-sm" />
              </div>
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground">Save login for next time.</p>
          </FloatingCard>

          <FloatingCard className="animate-float-delayed right-0 bottom-20 w-48 rotate-[-2deg]">
            <p className="mb-2 text-[11px] font-medium">Are you sure?</p>
            <p className="mb-3 text-[10px] text-muted-foreground">This action cannot be undone.</p>
            <div className="flex gap-1.5">
              <div className="flex-1 rounded-md border border-border bg-muted/50 py-0.5 text-center text-[10px]">
                Cancel
              </div>
              <div className="flex-1 rounded-md bg-destructive/80 py-0.5 text-center text-[10px] text-white">
                Delete
              </div>
            </div>
          </FloatingCard>

          {/* Main heading */}
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-3 py-1 text-[12px] text-muted-foreground">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-primary">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" />
              </svg>
              nexusplay
            </div>

            <h1 className="mb-5 text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.05] tracking-tight">
              NexusPlay
            </h1>

            <p className="mx-auto mb-10 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              Unstyled, accessible browser games and a chip economy.
              Open source. Free to play.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="h-9 rounded-lg px-5 text-[13px] font-medium">
                <Link href="/games">Browse Games</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-9 rounded-lg px-5 text-[13px] font-medium">
                <Link href="/shop">Get Chips</Link>
              </Button>
            </div>

            {/* Nav links row like Radix */}
            <div className="mt-8 flex justify-center gap-6 text-[13px] text-muted-foreground">
              <Link href="/games" className="transition-colors hover:text-foreground">Games</Link>
              <Link href="/docs" className="transition-colors hover:text-foreground">Docs</Link>
              <a href="https://github.com" className="transition-colors hover:text-foreground" target="_blank" rel="noopener noreferrer">Source</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Games ── */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold">Featured Games</h2>
            <p className="mt-1 text-[13px] text-muted-foreground">Jump in and start playing.</p>
          </div>
          <Link href="/games" className="text-[13px] text-muted-foreground transition-colors hover:text-foreground">
            View all &rarr;
          </Link>
        </div>

        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
          {GAMES.map((game) => (
            <div key={game.slug} className="group flex flex-col bg-card p-6 transition-colors hover:bg-accent/50">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-3xl">{game.emoji}</span>
                <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {game.tag}
                </span>
              </div>
              <h3 className="mb-1 text-[15px] font-semibold">{game.name}</h3>
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
      </section>

      {/* ── Chip Economy ── */}
      <section className="border-t border-border/50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mx-auto max-w-lg text-center">
            <h2 className="mb-2 text-xl font-semibold">Chip Economy</h2>
            <p className="mb-12 text-[13px] text-muted-foreground">
              Buy chips, enter tournaments, unlock cosmetics. No cash-out — pure social gaming.
            </p>
          </div>

          <div className="mx-auto grid max-w-2xl gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
            {[
              { chips: "500", price: "0.99", label: "Starter" },
              { chips: "2,000", price: "2.99", label: "Popular" },
              { chips: "5,500", price: "4.99", label: "Value" },
            ].map((pkg) => (
              <div key={pkg.label} className="flex flex-col items-center bg-card px-4 py-6 text-center">
                <p className="mb-3 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                  {pkg.label}
                </p>
                <p className="text-2xl font-bold tabular-nums">{pkg.chips}</p>
                <p className="text-[11px] text-muted-foreground">chips</p>
                <p className="mt-3 text-sm font-semibold text-primary">&euro;{pkg.price}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button asChild variant="outline" className="h-9 rounded-lg px-5 text-[13px]">
              <Link href="/shop">View All Packages</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
