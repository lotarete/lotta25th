"use client";

import { useEffect, useRef, useState } from "react";

/* Each source with the total run time summed from its ANMF frame durations.
   Both files loop once and stop on their final frame, which is the artwork at
   full coverage — we cut that away to end on an empty page. */
const LANDSCAPE = { src: "/color_master-horizontal.webp", durationMs: 2230 };
const PORTRAIT = { src: "/color_landing.webp", durationMs: 2930 };

/* Watercolour bubbles that pop out of the centre one by one during the intro,
   drift toward their spot and fade — as if bubbling up and bursting. Each has
   a direction it travels (tx/ty, in vmin from centre), a size, and a start
   delay so they cascade at different times. Delays keep the whole run under
   the landscape animation's 2230ms so the bubbles are gone before the reveal. */
const BUBBLES = [
  { n: 4, tx: "2vmin", ty: "-30vmin", size: "15vmin", delay: "0s" },
  { n: 1, tx: "31vmin", ty: "-19vmin", size: "20vmin", delay: "0.18s" },
  { n: 6, tx: "-30vmin", ty: "-14vmin", size: "17vmin", delay: "0.32s" },
  { n: 2, tx: "38vmin", ty: "9vmin", size: "13vmin", delay: "0.5s" },
  { n: 8, tx: "-38vmin", ty: "13vmin", size: "16vmin", delay: "0.64s" },
  { n: 5, tx: "20vmin", ty: "29vmin", size: "19vmin", delay: "0.8s" },
  { n: 3, tx: "-15vmin", ty: "31vmin", size: "14vmin", delay: "0.96s" },
  { n: 7, tx: "-4vmin", ty: "20vmin", size: "12vmin", delay: "1.1s" },
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
            src="/invitation.png"
            alt="Lotta-Lorette 25 — Tallinn, 29 August"
          />

          <div className="invitation-details">
            <p>
              Oled oodatud kell 20:00. Kohtume{" "}
              <a
                href="https://botikaed.ee/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Botikus
              </a>
              !
            </p>
            <p>Marati tn 5, 11712 Tallinn</p>
            <p>PANE SELGA: midagi värvilist:)</p>
          </div>
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

      {/* Once the collage clears, bubbles pop from the centre over the navy
          invitation — where they actually read — one by one, then vanish. */}
      {finished && (
        <div className="bubbles" aria-hidden="true">
          {BUBBLES.map((b) => (
            <img
              key={b.n}
              className="bubble"
              src={`/bubbles/${b.n}.webp`}
              alt=""
              style={
                {
                  "--tx": b.tx,
                  "--ty": b.ty,
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
