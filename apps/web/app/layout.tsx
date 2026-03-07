import type { Metadata } from "next";
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
      <body>{children}</body>
    </html>
  );
}
