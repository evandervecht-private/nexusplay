import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

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
    <html lang="en" className={cn("dark font-sans", geist.variable)}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {/* Ambient glow behind nav */}
        <div className="pointer-events-none fixed inset-x-0 top-0 z-40 h-32 bg-hero-glow opacity-60" />

        <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
            <Link href="/" className="flex items-center gap-2 text-xl font-black tracking-tight">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary glow-sm">
                <span className="text-sm font-black text-white">N</span>
              </div>
              <span>
                Nexus<span className="text-gradient">Play</span>
              </span>
            </Link>
            <div className="flex items-center gap-1">
              <Link
                href="/games"
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
              >
                Games
              </Link>
              <Link
                href="/shop"
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
              >
                Shop
              </Link>
              <Link
                href="/leaderboard"
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
              >
                Leaderboard
              </Link>
              <div className="ml-3 h-5 w-px bg-white/10" />
              <Button asChild size="sm" className="ml-3 glow-sm">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </nav>

        {children}

        <footer className="mt-auto border-t border-white/[0.06] py-8">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 text-xs text-muted-foreground">
            <p>&copy; 2026 NexusPlay. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/terms" className="hover:text-foreground">Terms</Link>
              <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
