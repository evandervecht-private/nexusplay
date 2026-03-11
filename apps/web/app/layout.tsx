import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
        <nav className="sticky top-0 z-30 border-b border-border/60 bg-background/90 backdrop-blur-sm">
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
              <Button asChild size="sm">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
