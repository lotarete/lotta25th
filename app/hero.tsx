"use client";

import { useEffect, useRef, useState } from "react";

/* Each source with the total run time summed from its ANMF frame durations.
   Both files loop once and stop on their final frame, which is the artwork at
   full coverage — we cut that away to end on an empty page. */
const LANDSCAPE = { src: "/color_master-horizontal.webp", durationMs: 2230 };
const PORTRAIT = { src: "/color_landing.webp", durationMs: 2930 };

/* Watercolour bubbles that pop one by one in the very centre, each swelling
   then bursting. The run starts during the collage intro — they show through
   the opening hole in the middle — and continues over the invitation after the
   reveal. Positions (x/y as a % of the viewport), sizes and delays are
   deliberately off-grid so it feels random rather than mechanical. */
const BUBBLES = [
  { n: 2, x: "50%", y: "49%", size: "12vmin", delay: "0.3s" },
  { n: 5, x: "43%", y: "54%", size: "16vmin", delay: "0.55s" },
  { n: 8, x: "57%", y: "44%", size: "10vmin", delay: "0.8s" },
  { n: 1, x: "47%", y: "41%", size: "15vmin", delay: "1.05s" },
  { n: 4, x: "55%", y: "57%", size: "12vmin", delay: "1.35s" },
  { n: 6, x: "40%", y: "46%", size: "14vmin", delay: "1.65s" },
  { n: 3, x: "60%", y: "51%", size: "13vmin", delay: "1.95s" },
  { n: 7, x: "50%", y: "59%", size: "11vmin", delay: "2.3s" },
] as const;

export default function Hero() {
  const [src, setSrc] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const durationRef = useRef(PORTRAIT.durationMs);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const choice = window.matchMedia("(min-aspect-ratio: 1/1)").matches
      ? LANDSCAPE
      : PORTRAIT;
    durationRef.current = choice.durationMs;

    const controller = new AbortController();
    let objectUrl: string | null = null;
    let cancelled = false;

    /* A single-loop animated WebP does not replay when the browser already has
       it decoded — it just shows the last frame. Handing the <img> a fresh blob
       URL on every load forces a new decode so the animation always starts at
       frame one. The fetch still hits the HTTP cache, so this costs no extra
       download. */
    fetch(choice.src, { signal: controller.signal })
      .then((res) => res.blob())
      .then((blob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setSrc(objectUrl);
      })
      .catch(() => {
        if (!cancelled) setSrc(choice.src);
      });

    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(timerRef.current);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  return (
    <div className={finished ? "hero is-finished" : "hero"}>
      {/* Stage 2 — revealed through the artwork's opening, then left on screen
          once the artwork cuts away. */}
      <div className="invitation">
        <div className="invitation-frame">
          <img
            src="/invitation_orange.png"
            alt="Lotta-Lorette 25 — Meet you at Botik, Marati tn 5, 11712 Tallinn. The party starts at 8PM. Dress code: something colorful!"
          />

          {/* The invitation text is baked into the image; this transparent
              hotspot sits over the "Botik" word so it stays clickable. */}
          <a
            className="botik-link"
            href="https://botikaed.ee/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Botik — venue website"
          />
        </div>
      </div>

      {src && !finished && (
        <img
          className="artwork"
          src={src}
          alt=""
          onLoad={() => {
            timerRef.current = setTimeout(
              () => setFinished(true),
              durationRef.current,
            );
          }}
        />
      )}

      {/* Bubbles pop one by one starting during the collage intro (first few
          in the middle) and scatter out to the edges through the reveal. */}
      {src && (
        <div className="bubbles" aria-hidden="true">
          {BUBBLES.map((b) => (
            <img
              key={b.n}
              className="bubble"
              src={`/bubbles/${b.n}.webp`}
              alt=""
              style={
                {
                  "--x": b.x,
                  "--y": b.y,
                  "--size": b.size,
                  "--delay": b.delay,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
