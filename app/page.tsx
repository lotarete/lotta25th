import Hero from "./hero";

// General sign-up RSVP link (same as /general).
const GENERAL_RSVP_URL =
  "https://www.darcyplans.com/rsvp/lotta-join-n2ytjrxk5824";

export default function Home() {
  return (
    <main>
      <Hero rsvpHref={GENERAL_RSVP_URL} />
    </main>
  );
}
