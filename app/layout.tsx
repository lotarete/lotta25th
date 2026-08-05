import type { Metadata, Viewport } from "next";
import { Allura } from "next/font/google";
import "./globals.css";

/* Self-hosted at build time, so no runtime request to Google.
   latin-ext carries the Estonian õ alongside ä/ö/ü. */
const details = Allura({
  subsets: ["latin", "latin-ext"],
  weight: ["400"],
  variable: "--font-details",
  display: "swap",
});

/* Absolute base for share-card image URLs. Resolves to the Vercel deployment
   in production/preview and localhost in dev. Set NEXT_PUBLIC_SITE_URL to pin a
   custom domain. */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Lotta-Lorette 25",
  description: "Lotta-Lorette turns 25 — come celebrate at Botik, Tallinn.",
  openGraph: {
    title: "Lotta-Lorette 25",
    description: "Lotta-Lorette turns 25 — come celebrate at Botik, Tallinn.",
    type: "website",
    images: [{ url: "/og/share.jpg", width: 1200, height: 675, alt: "Lotta-Lorette 25 invitation" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lotta-Lorette 25",
    description: "Lotta-Lorette turns 25 — come celebrate at Botik, Tallinn.",
    images: ["/og/share.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="et" className={details.variable}>
      <body>{children}</body>
    </html>
  );
}
