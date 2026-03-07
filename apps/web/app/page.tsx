export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tight text-white">
          Nexus<span className="text-purple-400">Play</span>
        </h1>
        <p className="mt-3 text-lg text-gray-400">
          Browser multiplayer games. Win chips. Dominate the leaderboard.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <a
          href="/games"
          className="rounded-xl border border-purple-800 bg-purple-950/50 p-6 text-center hover:border-purple-600 hover:bg-purple-900/50 transition-all"
        >
          <div className="text-3xl mb-2">🎮</div>
          <h2 className="font-semibold text-white">Play Games</h2>
          <p className="text-sm text-gray-400 mt-1">Browse all games</p>
        </a>
        <a
          href="/shop"
          className="rounded-xl border border-yellow-800 bg-yellow-950/50 p-6 text-center hover:border-yellow-600 transition-all"
        >
          <div className="text-3xl mb-2">🪙</div>
          <h2 className="font-semibold text-white">Get Chips</h2>
          <p className="text-sm text-gray-400 mt-1">Buy chips to play</p>
        </a>
        <a
          href="/leaderboard"
          className="rounded-xl border border-blue-800 bg-blue-950/50 p-6 text-center hover:border-blue-600 transition-all"
        >
          <div className="text-3xl mb-2">🏆</div>
          <h2 className="font-semibold text-white">Leaderboard</h2>
          <p className="text-sm text-gray-400 mt-1">Top players</p>
        </a>
      </div>

      <p className="text-xs text-gray-600">
        Local dev: admin@nexusplay.local / dev1234
      </p>
    </main>
  );
}
