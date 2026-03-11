import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NexusPlay - Browser Multiplayer Games",
    template: "%s | NexusPlay",
  },
  description:
    "Play free browser games. Compete in real-time multiplayer, win chips, and climb the leaderboard.",
  metadataBase: new URL(
    process.env["NEXTAUTH_URL"] ?? "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    siteName: "NexusPlay",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0a0a0f] text-white antialiased">
        <nav className="sticky top-0 z-30 border-b border-zinc-800/60 bg-[#0a0a0f]/90 backdrop-blur-sm">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
            <Link href="/" className="text-xl font-black tracking-tight">
              Nexus<span className="text-brand-500">Play</span>
            </Link>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/games" className="text-zinc-400 transition-colors hover:text-white">
                Games
              </Link>
              <Link href="/shop" className="text-zinc-400 transition-colors hover:text-white">
                Shop
              </Link>
              <Link href="/leaderboard" className="text-zinc-400 transition-colors hover:text-white">
                Leaderboard
              </Link>
              <Link
                href="/login"
                className="rounded-lg bg-brand-600 px-4 py-1.5 font-semibold text-white transition-colors hover:bg-brand-700"
              >
                Sign In
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
