"use client";

import { useEffect, useRef, useState } from "react";

/* Total run time of each animated WebP, summed from its ANMF frame durations.
   Both files are set to loop once, so they stop on the final frame — which is
   the artwork at full coverage. We fade that away to end on an empty page. */
const DURATION_MS: Record<string, number> = {
  "color_master-horizontal.webp": 2230,
  "color_landing.webp": 2930,
};

export default function Hero() {
  const imgRef = useRef<HTMLImageElement>(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    let timer: ReturnType<typeof setTimeout>;

    // Which of the two sources <picture> settled on decides how long to wait.
    const start = () => {
      const file = img.currentSrc.split("/").pop() ?? "";
      timer = setTimeout(() => setFinished(true), DURATION_MS[file] ?? 3000);
    };

    if (img.complete) start();
    else img.addEventListener("load", start, { once: true });

    return () => {
      clearTimeout(timer);
      img.removeEventListener("load", start);
    };
  }, []);

  return (
    <div className={finished ? "hero is-finished" : "hero"}>
      {/* Stage 2 — invitation content, still to come. */}
      <div className="invitation" />

      <picture>
        <source
          media="(min-aspect-ratio: 1/1)"
          srcSet="/color_master-horizontal.webp"
          width={1537}
          height={1023}
        />
        <img
          ref={imgRef}
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
  );
}
