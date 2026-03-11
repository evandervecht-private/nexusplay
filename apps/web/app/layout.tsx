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
        <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
            <Link href="/" className="flex items-center gap-2.5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-primary">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" opacity="0.9" />
                <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
                <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
              </svg>
              <span className="text-[15px] font-semibold tracking-tight">
                NexusPlay
              </span>
            </Link>
            <div className="flex items-center gap-1 text-[13px]">
              <Link
                href="/games"
                className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                Games
              </Link>
              <Link
                href="/shop"
                className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                Shop
              </Link>
              <Link
                href="/leaderboard"
                className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                Leaderboard
              </Link>
              <div className="ml-2 mr-2 h-4 w-px bg-border" />
              <Button asChild size="sm" className="h-7 rounded-md px-3 text-[13px]">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </nav>

        {children}

        <footer className="border-t border-border/50 py-6">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 text-xs text-muted-foreground">
            <p>NexusPlay</p>
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
