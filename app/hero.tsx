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
] as const;

const START_DELAY_MS = 300;
const BUBBLE_INTERVAL_MS = 78;

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

export default function Hero() {
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
      if (landscape) context.rotate(-Math.PI / 2);
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
          START_DELAY_MS + order.length * BUBBLE_INTERVAL_MS + 120,
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
          <img
            src="/invitation_orange.png"
            alt="Lotta-Lorette 25 — Meet you at Botik, Marati tn 5, 11712 Tallinn. The party starts at 8PM. Dress code: something colorful!"
          />

          <a
            className="botik-link"
            href="https://botikaed.ee/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Botik — venue website"
          />
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
