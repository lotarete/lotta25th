"use client";

import { useEffect, useRef, useState } from "react";

const ARTWORK = {
  src: "/color_master.png",
  width: 1023,
  height: 1537,
};

/* Centres and approximate radii of the painted bubbles in color_master.png.
   The order is shuffled on every visit, so the reveal feels spontaneous while
   every cut-out still follows a real feature in the artwork. */
const BUBBLES = [
  { x: 72, y: 62, radius: 105, seed: 1 },
  { x: 292, y: 72, radius: 104, seed: 2 },
  { x: 421, y: 132, radius: 128, seed: 3 },
  { x: 523, y: 28, radius: 92, seed: 4 },
  { x: 692, y: 116, radius: 162, seed: 5 },
  { x: 858, y: 102, radius: 122, seed: 6 },
  { x: 986, y: 48, radius: 100, seed: 7 },
  { x: 58, y: 275, radius: 118, seed: 8 },
  { x: 183, y: 315, radius: 88, seed: 9 },
  { x: 334, y: 292, radius: 148, seed: 10 },
  { x: 498, y: 367, radius: 158, seed: 11 },
  { x: 659, y: 321, radius: 118, seed: 12 },
  { x: 854, y: 472, radius: 178, seed: 13 },
  { x: 1002, y: 395, radius: 105, seed: 14 },
  { x: 54, y: 533, radius: 133, seed: 15 },
  { x: 282, y: 520, radius: 68, seed: 16 },
  { x: 361, y: 611, radius: 72, seed: 17 },
  { x: 500, y: 641, radius: 94, seed: 18 },
  { x: 620, y: 585, radius: 88, seed: 19 },
  { x: 699, y: 721, radius: 83, seed: 20 },
  { x: 974, y: 628, radius: 124, seed: 21 },
  { x: 278, y: 827, radius: 148, seed: 22 },
  { x: 404, y: 954, radius: 134, seed: 23 },
  { x: 532, y: 902, radius: 78, seed: 24 },
  { x: 651, y: 921, radius: 148, seed: 25 },
  { x: 852, y: 891, radius: 178, seed: 26 },
  { x: 1002, y: 852, radius: 114, seed: 27 },
  { x: 90, y: 1052, radius: 154, seed: 28 },
  { x: 292, y: 1244, radius: 163, seed: 29 },
  { x: 602, y: 1242, radius: 168, seed: 30 },
  { x: 820, y: 1242, radius: 114, seed: 31 },
  { x: 982, y: 1238, radius: 119, seed: 32 },
  { x: 4, y: 1394, radius: 175, seed: 33 },
  { x: 180, y: 1482, radius: 134, seed: 34 },
  { x: 420, y: 1480, radius: 154, seed: 35 },
  { x: 682, y: 1453, radius: 164, seed: 36 },
  { x: 902, y: 1490, radius: 178, seed: 37 },
  { x: 0, y: 792, radius: 150, seed: 38 },
  { x: 1020, y: 216, radius: 150, seed: 39 },
  { x: 1020, y: 1056, radius: 150, seed: 40 },
  { x: 216, y: 636, radius: 150, seed: 41 },
  { x: 756, y: 1092, radius: 150, seed: 42 },
  { x: 468, y: 780, radius: 150, seed: 43 },
  { x: 180, y: 168, radius: 150, seed: 44 },
  { x: 204, y: 444, radius: 150, seed: 45 },
  { x: 816, y: 684, radius: 150, seed: 46 },
  { x: 828, y: 264, radius: 150, seed: 47 },
  { x: 444, y: 1116, radius: 150, seed: 48 },
  { x: 276, y: 1056, radius: 150, seed: 49 },
  { x: 432, y: 540, radius: 150, seed: 50 },
  { x: 648, y: 468, radius: 150, seed: 51 },
  { x: 0, y: 1200, radius: 150, seed: 52 },
  { x: 180, y: 0, radius: 150, seed: 53 },
  { x: 600, y: 696, radius: 150, seed: 54 },
  { x: 0, y: 396, radius: 150, seed: 55 },
  { x: 120, y: 888, radius: 150, seed: 56 },
  { x: 0, y: 156, radius: 150, seed: 57 },
  { x: 540, y: 204, radius: 150, seed: 58 },
  { x: 384, y: 0, radius: 150, seed: 59 },
  { x: 444, y: 1320, radius: 150, seed: 60 },
  { x: 588, y: 1068, radius: 150, seed: 61 },
  { x: 900, y: 1140, radius: 150, seed: 62 },
  { x: 1020, y: 1356, radius: 150, seed: 63 },
  { x: 348, y: 696, radius: 150, seed: 64 },
  { x: 132, y: 1272, radius: 150, seed: 65 },
  { x: 288, y: 1404, radius: 150, seed: 66 },
  { x: 72, y: 672, radius: 150, seed: 67 },
  { x: 1020, y: 516, radius: 150, seed: 68 },
  { x: 708, y: 600, radius: 150, seed: 69 },
  { x: 1020, y: 744, radius: 150, seed: 70 },
  { x: 348, y: 432, radius: 150, seed: 71 },
  { x: 792, y: 0, radius: 150, seed: 72 },
  { x: 804, y: 1353, radius: 100, seed: 73 },
  { x: 552, y: 1536, radius: 100, seed: 74 },
  { x: 714, y: 798, radius: 100, seed: 75 },
  { x: 0, y: 0, radius: 100, seed: 76 },
  { x: 888, y: 1320, radius: 100, seed: 77 },
  { x: 603, y: 0, radius: 100, seed: 78 },
  { x: 72, y: 1536, radius: 100, seed: 79 },
  { x: 0, y: 948, radius: 100, seed: 80 },
  { x: 540, y: 1413, radius: 100, seed: 81 },
] as const;

const START_DELAY_MS = 300;
const BUBBLE_INTERVAL_MS = 52;

type Bubble = (typeof BUBBLES)[number];

function shuffledBubbles() {
  const result: Bubble[] = [...BUBBLES];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }

  return result;
}

function bubbleOnScreen(bubble: Bubble, width: number, height: number) {
  const landscape = width >= height;
  const sourceWidth = landscape ? ARTWORK.height : ARTWORK.width;
  const sourceHeight = landscape ? ARTWORK.width : ARTWORK.height;
  const scale = Math.max(width / sourceWidth, height / sourceHeight);

  if (landscape) {
    return {
      x: width / 2 - (bubble.y - ARTWORK.height / 2) * scale,
      y: height / 2 + (bubble.x - ARTWORK.width / 2) * scale,
      radius: bubble.radius * scale,
    };
  }

  return {
    x: width / 2 + (bubble.x - ARTWORK.width / 2) * scale,
    y: height / 2 + (bubble.y - ARTWORK.height / 2) * scale,
    radius: bubble.radius * scale,
  };
}

function cutOutBubble(
  context: CanvasRenderingContext2D,
  bubble: Bubble,
  width: number,
  height: number,
) {
  const spot = bubbleOnScreen(bubble, width, height);
  const points = 28;

  context.save();
  context.globalCompositeOperation = "destination-out";
  context.beginPath();

  for (let index = 0; index < points; index += 1) {
    const angle = (index / points) * Math.PI * 2;
    const wobble =
      1 +
      Math.sin(angle * 3 + bubble.seed) * 0.035 +
      Math.sin(angle * 5 + bubble.seed * 0.7) * 0.025;
    const radius = spot.radius * wobble;
    const x = spot.x + Math.cos(angle) * radius;
    const y = spot.y + Math.sin(angle) * radius;

    if (index === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  }

  context.closePath();
  context.fill();
  context.restore();
}

type HeroProps = {
  invitationSrc?: string;
  invitationAlt?: string;
  rsvpNote?: string;
  rsvpHref?: string;
};

export default function Hero({
  invitationSrc = "/invitation_orange_pdf.webp",
  invitationAlt = "Lotta-Lorette 25 — Meet you at Botik, Marati tn 5, 11712 Tallinn. The party starts at 8PM. Dress code: something colorful!",
  rsvpNote = "Let me know you're coming and I'll have a drink waiting for you at the bar.",
  rsvpHref = "https://www.darcyplans.com/rsvp/lottas-25",
}: HeroProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const image = new Image();
    const order = shuffledBubbles();
    const timers: number[] = [];
    let clearedCount = 0;
    let cancelled = false;

    const drawArtwork = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 3);

      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.clearRect(0, 0, width, height);

      const landscape = width >= height;
      const sourceWidth = landscape ? ARTWORK.height : ARTWORK.width;
      const sourceHeight = landscape ? ARTWORK.width : ARTWORK.height;
      const scale = Math.max(width / sourceWidth, height / sourceHeight);

      context.save();
      context.translate(width / 2, height / 2);
      if (landscape) context.rotate(Math.PI / 2);
      context.drawImage(
        image,
        (-ARTWORK.width * scale) / 2,
        (-ARTWORK.height * scale) / 2,
        ARTWORK.width * scale,
        ARTWORK.height * scale,
      );
      context.restore();

      for (let index = 0; index < clearedCount; index += 1) {
        cutOutBubble(context, order[index], width, height);
      }
    };

    const start = () => {
      if (cancelled) return;

      drawArtwork();
      setReady(true);
      window.addEventListener("resize", drawArtwork);

      order.forEach((bubble, index) => {
        timers.push(
          window.setTimeout(() => {
            if (cancelled) return;
            clearedCount = index + 1;
            cutOutBubble(
              context,
              bubble,
              canvas.clientWidth,
              canvas.clientHeight,
            );
          }, START_DELAY_MS + index * BUBBLE_INTERVAL_MS),
        );
      });

      timers.push(
        window.setTimeout(
          () => {
            if (!cancelled) setFinished(true);
          },
          START_DELAY_MS + order.length * BUBBLE_INTERVAL_MS + 80,
        ),
      );
    };

    image.onload = start;
    image.src = ARTWORK.src;

    return () => {
      cancelled = true;
      image.onload = null;
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("resize", drawArtwork);
    };
  }, []);

  return (
    <div className={finished ? "hero is-finished" : "hero"}>
      <div className="invitation">
        <div className="invitation-frame">
          <img src={invitationSrc} alt={invitationAlt} />

          <a
            className="botik-link"
            href="https://botikaed.ee/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Botik — venue website"
          />

          {/* RSVP button under "THE PARTY STARTS AT 8PM." */}
          <a
            className="rsvp-button"
            href={rsvpHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            RSVP
          </a>

          <p className="rsvp-note">{rsvpNote}</p>
        </div>
      </div>

      {!finished && !ready && (
        <img className="artwork-poster" src={ARTWORK.src} alt="" />
      )}

      {!finished && (
        <canvas
          ref={canvasRef}
          className={ready ? "artwork is-ready" : "artwork"}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
