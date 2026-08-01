"use client";

import { useEffect, useRef, useState } from "react";

/* Each source with the total run time summed from its ANMF frame durations.
   Both files loop once and stop on their final frame, which is the artwork at
   full coverage — we cut that away to end on an empty page. */
const LANDSCAPE = { src: "/color_master-horizontal.webp", durationMs: 2230 };
const PORTRAIT = { src: "/color_landing.webp", durationMs: 2930 };

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
            src="/invitation-crisp.png"
            alt="Lotta-Lorette 25 — Tallinn, 29 August"
          />

          <div className="invitation-details">
            <p>
              Oled oodatud kell 20. Kohtume{" "}
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

      {src && (
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
    </div>
  );
}
