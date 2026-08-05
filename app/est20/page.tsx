import type { Metadata } from "next";
import Hero from "../hero";

const description = "Lotta-Lorette saab 25 — kohtume Botikus kell 20:00.";

export const metadata: Metadata = {
  description,
  openGraph: {
    description,
    images: [{ url: "/og/est20.jpg", width: 1200, height: 675, alt: "Lotta-Lorette 25 kutse" }],
  },
  twitter: { description, images: ["/og/est20.jpg"] },
};

export default function Est20() {
  return (
    <main>
      <Hero
        invitationSrc="/invitation_orange_est_20.webp"
        invitationAlt="Lotta-Lorette 25 — Kohtume Botikus, Marati tn 5, 11712 Tallinn. Oled oodatud kell 20:00. Pane selga: midagi värvilist!"
        rsvpNote="Anna oma tulekust teada siin"
      />
    </main>
  );
}
