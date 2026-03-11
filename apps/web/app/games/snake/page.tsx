import type { Metadata } from "next";
import Link from "next/link";
import { SnakeGame } from "./snake-game";

export const metadata: Metadata = { title: "Snake" };

export default function SnakePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/games" className="transition-colors hover:text-foreground">
          Games
        </Link>
        <span className="text-white/20">/</span>
        <span className="text-foreground">Snake</span>
      </nav>

      <div className="mb-10 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 text-3xl ring-1 ring-green-500/20">
          🐍
        </div>
        <div>
          <h1 className="text-3xl font-black">Snake</h1>
          <p className="text-sm text-muted-foreground">
            Eat the food, grow longer, don&apos;t crash!
          </p>
        </div>
      </div>

      <SnakeGame />
    </main>
  );
}
