import type { Metadata } from "next";
import Hero from "../hero";

const description = "Lotta-Lorette saab 25 — kohtume Botikus kell 17:00.";

export const metadata: Metadata = {
  description,
  openGraph: {
    description,
    images: [{ url: "/og/est17.jpg", width: 1200, height: 675, alt: "Lotta-Lorette 25 kutse" }],
  },
  twitter: { description, images: ["/og/est17.jpg"] },
};

export default function Est17() {
  return (
    <main>
      <Hero
        invitationSrc="/invitation_orange_est_17.webp"
        invitationAlt="Lotta-Lorette 25 — Kohtume Botikus, Marati tn 5, 11712 Tallinn. Oled oodatud kell 17:00. Dress code: something colorful!"
        rsvpNote="Anna teada, et tuled, baaris ootab sind juba jook."
      />
    </main>
  );
}
