import type { Metadata } from "next";
import Link from "next/link";
import { SnakeGame } from "./snake-game";

export const metadata: Metadata = { title: "Snake" };

export default function SnakePage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-2 flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/games" className="transition-colors hover:text-white">
          Games
        </Link>
        <span>/</span>
        <span className="text-zinc-300">Snake</span>
      </div>

      <div className="mb-8 flex items-center gap-3">
        <span className="text-4xl">🐍</span>
        <div>
          <h1 className="text-3xl font-black text-white">Snake</h1>
          <p className="text-sm text-zinc-400">Eat the food, grow longer, don&apos;t crash!</p>
        </div>
      </div>

      <SnakeGame />
    </main>
  );
}
