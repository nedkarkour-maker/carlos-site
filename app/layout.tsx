import type { Metadata } from "next";
import { Archivo, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "../styles/tokens.css";
import "./globals.css";
import MotionProvider from "@/components/motion/MotionProvider";
import ScrollProgress from "@/components/motion/ScrollProgress";
import { site } from "@/config/content";

// Configure Archivo (Headings)
const archivo = Archivo({ 
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

// Configure IBM Plex Sans (Body)
const plexSans = IBM_Plex_Sans({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-plex-sans",
  display: "swap",
});

// Configure IBM Plex Mono (Numbers/Telemetry)
const plexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "swap",
});

const title = `${site.name} — ${site.role}`;

export const metadata: Metadata = {
  // Base for every relative URL in metadata (OG image, per-post covers, …).
  metadataBase: new URL(site.url),
  title,
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_CA",
    url: "/",
    title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable} font-sans antialiased bg-[var(--sail)] text-[var(--ink)]`}>
        <MotionProvider />
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}