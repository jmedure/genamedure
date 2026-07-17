"use client";

import {
  useEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { BrandLogo } from "@/lib/content";

const TICKER_BASE_H = 44;
const TICKER_ROW_H = 92;
/** Baseline gap on each side of a logo; `padX` offsets this per asset. */
const TICKER_BASE_PAD_X = 40;
/** How quickly fling velocity eases back to the base marquee speed. */
const VELOCITY_DECAY_MS = 900;
const MAX_FLING_MULTIPLIER = 8;

function Logo({ logo }: { logo: BrandLogo }) {
  const h = Math.round(TICKER_BASE_H * (logo.scale ?? 1));
  const w = Math.round((logo.width / logo.height) * h);
  const padLeft = Math.max(
    4,
    TICKER_BASE_PAD_X + (logo.padX ?? 0) + (logo.padLeft ?? 0),
  );
  const padRight = Math.max(
    4,
    TICKER_BASE_PAD_X + (logo.padX ?? 0) + (logo.padRight ?? 0),
  );

  return (
    <div
      className="relative flex shrink-0 items-center justify-center"
      style={{
        height: TICKER_ROW_H,
        width: w + padLeft + padRight,
        paddingLeft: padLeft,
        paddingRight: padRight,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo.src}
        alt={logo.name}
        width={w}
        height={h}
        className="pointer-events-none h-auto w-auto max-w-none object-contain"
        style={{ height: h, width: w }}
        draggable={false}
      />
    </div>
  );
}

function wrapOffset(offset: number, half: number) {
  if (half <= 0) return offset;
  let next = offset % half;
  if (next > 0) next -= half;
  return next;
}

function MarqueeRow({
  logos,
  direction,
  duration = 55,
}: {
  logos: BrandLogo[];
  direction: "left" | "right";
  duration?: number;
}) {
  const track = [...logos, ...logos];
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(direction === "right" ? -1 : 0);
  const velocityRef = useRef(0);
  const baseSpeedRef = useRef(0);
  const halfWidthRef = useRef(0);
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const lastTRef = useRef(0);
  const sampleVelRef = useRef(0);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = media.matches;
    const onChange = () => {
      reducedMotionRef.current = media.matches;
      if (media.matches) velocityRef.current = 0;
      else velocityRef.current = baseSpeedRef.current;
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const trackEl = trackRef.current;
    if (!trackEl) return;

    const measure = () => {
      const half = trackEl.scrollWidth / 2;
      halfWidthRef.current = half;
      if (half <= 0) return;

      // Left: negative speed. Right: positive speed. One loop = half width.
      const pxPerMs = half / (duration * 1000);
      const base = direction === "left" ? -pxPerMs : pxPerMs;
      baseSpeedRef.current = base;

      if (!draggingRef.current && !reducedMotionRef.current) {
        const boosted =
          Math.abs(velocityRef.current) >
          Math.abs(base) * (MAX_FLING_MULTIPLIER + 0.5);
        if (!boosted) velocityRef.current = base;
      }

      // Seed rightward marquees near -50% like the CSS keyframes.
      if (direction === "right" && offsetRef.current === -1) {
        offsetRef.current = -half;
      }
      offsetRef.current = wrapOffset(offsetRef.current, half);
      trackEl.style.transform = `translate3d(${offsetRef.current}px,0,0)`;
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(trackEl);
    return () => ro.disconnect();
  }, [direction, duration, logos]);

  useEffect(() => {
    let last = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const dt = Math.min(40, now - last);
      last = now;
      const half = halfWidthRef.current;
      const trackEl = trackRef.current;

      if (trackEl && half > 0 && !draggingRef.current) {
        if (!reducedMotionRef.current) {
          const base = baseSpeedRef.current;
          const v = velocityRef.current;
          const alpha = 1 - Math.exp(-dt / VELOCITY_DECAY_MS);
          velocityRef.current = v + (base - v) * alpha;
          offsetRef.current += velocityRef.current * dt;
          offsetRef.current = wrapOffset(offsetRef.current, half);
        }
        trackEl.style.transform = `translate3d(${offsetRef.current}px,0,0)`;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    draggingRef.current = true;
    lastXRef.current = e.clientX;
    lastTRef.current = performance.now();
    sampleVelRef.current = 0;
    velocityRef.current = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.style.cursor = "grabbing";
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const now = performance.now();
    const dx = e.clientX - lastXRef.current;
    const dt = Math.max(1, now - lastTRef.current);
    lastXRef.current = e.clientX;
    lastTRef.current = now;

    // Blend recent samples so release velocity isn't a single noisy frame.
    const instant = dx / dt;
    sampleVelRef.current = sampleVelRef.current * 0.65 + instant * 0.35;

    const half = halfWidthRef.current;
    offsetRef.current = wrapOffset(offsetRef.current + dx, half);
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${offsetRef.current}px,0,0)`;
    }
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    e.currentTarget.style.cursor = "grab";

    if (reducedMotionRef.current) {
      velocityRef.current = 0;
      return;
    }

    const base = baseSpeedRef.current;
    const fling = sampleVelRef.current;
    const max = Math.abs(base) * MAX_FLING_MULTIPLIER;
    // Keep auto direction as a floor; swipe adds / subtracts on top.
    let next = fling;
    if (Math.abs(next) < Math.abs(base) * 0.35) {
      next = base;
    } else {
      next = Math.max(-max, Math.min(max, next));
      // If the fling is weak opposite the base, still resume base shortly via decay.
      if (Math.sign(next) === Math.sign(base) || next === 0) {
        // Boost in travel direction — ensure at least base speed.
        if (Math.abs(next) < Math.abs(base)) next = base;
      }
    }
    velocityRef.current = next;
  };

  return (
    <div
      ref={viewportRef}
      className="w-full cursor-grab touch-pan-y overflow-hidden"
      aria-hidden
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div ref={trackRef} className="marquee-track">
        {track.map((logo, i) => (
          <Logo key={`${logo.name}-${i}`} logo={logo} />
        ))}
      </div>
    </div>
  );
}

type BrandTickerProps = {
  logos: BrandLogo[];
};

export function BrandTicker({ logos }: BrandTickerProps) {
  const mid = Math.ceil(logos.length / 2);
  const rowA = logos.slice(0, mid);
  const rowB = logos.slice(mid);

  return (
    <section className="w-full py-2" aria-label="Brands worked with">
      <div className="flex flex-col gap-6 md:hidden">
        <MarqueeRow logos={rowA} direction="left" duration={50} />
        <MarqueeRow
          logos={rowB.length ? rowB : rowA}
          direction="right"
          duration={55}
        />
      </div>

      <div className="hidden md:block">
        <MarqueeRow logos={logos} direction="left" duration={70} />
      </div>
    </section>
  );
}
