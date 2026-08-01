export default function Home() {
  return (
    <main>
      <div className="hero">
        {/* Stage 2 — invitation content sits behind the artwork and shows
            through its transparent areas. Copy still to come. */}
        <div className="invitation" />

        <picture>
          <source
            media="(min-aspect-ratio: 1/1)"
            srcSet="/color_master-horizontal.webp"
            width={1537}
            height={1023}
          />
          <img
            className="artwork"
            src="/color_landing.webp"
            alt=""
            width={1023}
            height={1537}
            fetchPriority="high"
            decoding="async"
          />
        </picture>
      </div>
    </main>
  );
}
