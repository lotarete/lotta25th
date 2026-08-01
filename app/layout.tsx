import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

/* Self-hosted at build time, so no runtime request to Google.
   latin-ext carries the Estonian õ alongside ä/ö/ü. */
const details = Nunito({
  subsets: ["latin", "latin-ext"],
  weight: ["300"],
  variable: "--font-details",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lotta 25",
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
