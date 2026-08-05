import Hero from "../hero";

// English invitation (the artwork reads "THE PARTY STARTS AT 8PM" = 20:00),
// pointed at the general sign-up RSVP link instead of the personalised one.
const GENERAL_RSVP_URL =
  "https://www.darcyplans.com/rsvp/lotta-join-n2ytjrxk5824";

export default function General() {
  return (
    <main>
      <Hero rsvpHref={GENERAL_RSVP_URL} />
    </main>
  );
}
