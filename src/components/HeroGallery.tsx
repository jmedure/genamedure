"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { HeroImage } from "@/lib/getMediaKit";

const AUTO_MS = 4200;
const CLONES = 3;

type HeroGalleryProps = {
  images: HeroImage[];
};

export function HeroGallery({ images }: HeroGalleryProps) {
  const count = images.length || 1;
  const renderCount = count * CLONES;

  // Monotonic index — always advances forward for endless rightward motion
  const [pos, setPos] = useState(0);
  const [animate, setAnimate] = useState(true);
  const touchStartX = useRef<number | null>(null);
  const didSwipe = useRef(false);
  const reducedMotion = useRef(false);

  const activeDot = ((pos % count) + count) % count;

  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  const goNext = useCallback(() => {
    setAnimate(true);
    setPos((p) => p + 1);
  }, []);

  const goToDot = useCallback(
    (dot: number) => {
      const current = ((pos % count) + count) % count;
      let delta = dot - current;
      if (delta < 0) delta += count;
      setAnimate(true);
      setPos((p) => p + delta);
    },
    [pos, count],
  );

  useEffect(() => {
    if (reducedMotion.current || count < 2) return;
    const id = window.setInterval(goNext, AUTO_MS);
    return () => window.clearInterval(id);
  }, [goNext, pos, count]);

  // After advancing far, quietly rewind the track so transform stays bounded
  useEffect(() => {
    if (pos < count * 2) return;
    const id = window.setTimeout(() => {
      setAnimate(false);
      setPos((p) => p - count);
    }, 520);
    return () => window.clearTimeout(id);
  }, [pos, count]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
    didSwipe.current = false;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 40) return;
    didSwipe.current = true;
    if (dx < 0) goNext();
    else {
      setAnimate(true);
      setPos((p) => Math.max(0, p - 1));
    }
  };

  const onClick = () => {
    if (didSwipe.current) {
      didSwipe.current = false;
      return;
    }
    goNext();
  };

  const slides = useMemo(
    () =>
      Array.from({ length: renderCount }, (_, i) => {
        const img = images[i % count];
        return { ...img, key: `${img.src}-${i}` };
      }),
    [images, count, renderCount],
  );

  // Track is RENDER_COUNT * 100% of viewport; each step moves 100/RENDER_COUNT of track (= 1 viewport)
  const stepPct = 100 / renderCount;

  return (
    <>
      <section
        className="relative aspect-[401/682] w-full cursor-pointer overflow-hidden md:hidden"
        aria-roledescription="carousel"
        aria-label="Featured photos"
        onClick={onClick}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="hero-slide absolute inset-y-0 left-0 flex h-full"
          style={{
            width: `${renderCount * 100}%`,
            transform: `translate3d(-${pos * stepPct}%, 0, 0)`,
            transition: animate
              ? "transform 500ms cubic-bezier(0.23, 1, 0.32, 1)"
              : "none",
          }}
        >
          {slides.map((img) => (
            <div
              key={img.key}
              className="relative h-full shrink-0"
              style={{ width: `${stepPct}%` }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div className="absolute bottom-[30px] left-1/2 flex -translate-x-1/2 gap-2.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === activeDot}
              onClick={(e) => {
                e.stopPropagation();
                goToDot(i);
              }}
              className={`h-3 w-3 rounded-full transition-opacity duration-200 ${
                i === activeDot
                  ? "bg-white opacity-100"
                  : "bg-white opacity-40"
              }`}
            />
          ))}
        </div>
      </section>

      <section
        className="mx-auto hidden w-full max-w-[1728px] items-center justify-center gap-2.5 md:flex"
        aria-label="Featured photos"
      >
        {images.map((img) => (
          <div
            key={img.src}
            className="relative aspect-[401/682] w-full max-w-[401px] flex-1"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              priority
              sizes="401px"
              className="object-cover"
            />
          </div>
        ))}
      </section>
    </>
  );
}
