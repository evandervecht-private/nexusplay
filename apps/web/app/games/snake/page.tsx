import type { Metadata } from "next";
import Link from "next/link";
import { SnakeGame } from "./snake-game";

export const metadata: Metadata = { title: "Snake" };

export default function SnakePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-[13px] text-muted-foreground">
        <Link href="/games" className="transition-colors hover:text-foreground">
          Games
        </Link>
        <span className="text-border">/</span>
        <span className="text-foreground">Snake</span>
      </nav>

      <div className="mb-8 flex items-center gap-3">
        <span className="text-3xl">🐍</span>
        <div>
          <h1 className="text-xl font-semibold">Snake</h1>
          <p className="text-[13px] text-muted-foreground">
            Eat the food, grow longer, don&apos;t crash!
          </p>
        </div>
      </div>

      <SnakeGame />
    </main>
  );
}
