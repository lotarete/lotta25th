import Hero from "../hero";

// English invitation (the artwork reads "THE PARTY STARTS AT 8PM" = 20:00),
// pointed at a general sign-up RSVP link instead of the personalised one.
// TODO: replace with the real general sign-up URL.
const GENERAL_RSVP_URL = "https://www.darcyplans.com/rsvp/lottas-25";

export default function General() {
  return (
    <main>
      <Hero rsvpHref={GENERAL_RSVP_URL} />
    </main>
  );
}
