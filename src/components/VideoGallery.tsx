"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryVideo } from "@/lib/getMediaKit";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function nearestSlideIndex(scroller: HTMLDivElement) {
  const slides = Array.from(scroller.children) as HTMLElement[];
  let best = 0;
  let bestDist = Infinity;
  const left = scroller.scrollLeft;
  slides.forEach((slide, i) => {
    const dist = Math.abs(slide.offsetLeft - left);
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  });
  return best;
}

function isTouchDevice() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}

type VideoGalleryProps = {
  videos: GalleryVideo[];
};

export function VideoGallery({ videos }: VideoGalleryProps) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(index);
  const programmaticScrollRef = useRef(false);
  const playTokenRef = useRef(0);
  const touchModeRef = useRef(false);

  indexRef.current = index;

  const canPrev = index > 0;
  const canNext = index < videos.length - 1;
  const active = videos[index];
  const hasVideo = Boolean(active?.src);

  const stopAllExcept = useCallback((keep: number) => {
    videoRefs.current.forEach((v, i) => {
      if (!v || i === keep) return;
      v.pause();
      v.currentTime = 0;
    });
  }, []);

  const playActive = useCallback(async () => {
    const activeIndex = indexRef.current;
    const token = ++playTokenRef.current;
    const v = videoRefs.current[activeIndex];
    if (!v || !videos[activeIndex]?.src) {
      setPlaying(false);
      return;
    }

    stopAllExcept(activeIndex);
    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;

    const attempt = async () => {
      if (token !== playTokenRef.current) return;
      try {
        await v.play();
        if (token !== playTokenRef.current) return;
        setPlaying(true);
      } catch {
        if (token !== playTokenRef.current) return;
        setPlaying(false);
      }
    };

    if (v.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      await attempt();
      return;
    }

    const onReady = () => {
      v.removeEventListener("loadeddata", onReady);
      v.removeEventListener("canplay", onReady);
      void attempt();
    };
    v.addEventListener("loadeddata", onReady);
    v.addEventListener("canplay", onReady);
    if (v.readyState === HTMLMediaElement.HAVE_NOTHING) v.load();
    void attempt();
  }, [stopAllExcept, videos]);

  const selectIndex = useCallback(
    (next: number) => {
      if (next < 0 || next >= videos.length || next === indexRef.current) return;
      setProgress(0);
      setDuration(0);
      setIndex(next);
    },
    [videos.length],
  );

  // Keep the first slide fully visible inside the centered page column.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollLeft = 0;
  }, []);

  useEffect(() => {
    touchModeRef.current = isTouchDevice();
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const slide = el.children[index] as HTMLElement | undefined;
    if (!slide) return;
    const target = slide.offsetLeft;
    if (Math.abs(el.scrollLeft - target) < 2) return;
    programmaticScrollRef.current = true;
    el.scrollTo({ left: target, behavior: "smooth" });
  }, [index]);

  // Touch only: sync active slide + autoplay after a finger swipe.
  // Desktop uses Prev/Next / click — native drag-scroll won't rewire playback.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const settle = () => {
      if (!touchModeRef.current) {
        programmaticScrollRef.current = false;
        return;
      }

      if (programmaticScrollRef.current) {
        const slide = el.children[indexRef.current] as HTMLElement | undefined;
        if (slide && Math.abs(el.scrollLeft - slide.offsetLeft) < 4) {
          programmaticScrollRef.current = false;
        }
        return;
      }

      selectIndex(nearestSlideIndex(el));
    };

    let scrollTimeout = 0;
    const onScroll = () => {
      if (!touchModeRef.current) return;
      window.clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(settle, 90);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("scrollend", settle);
    return () => {
      window.clearTimeout(scrollTimeout);
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("scrollend", settle);
    };
  }, [selectIndex]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void playActive();
    }, 40);
    return () => {
      window.clearTimeout(timer);
      playTokenRef.current += 1;
    };
  }, [index, playActive]);

  const goPrev = () => {
    if (!canPrev) return;
    selectIndex(index - 1);
  };

  const goNext = () => {
    if (!canNext) return;
    selectIndex(index + 1);
  };

  const togglePlay = async () => {
    const v = videoRefs.current[index];
    if (!v || !hasVideo) return;
    if (v.paused) {
      try {
        await v.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const onTimeUpdate = (i: number) => {
    if (i !== index) return;
    const v = videoRefs.current[i];
    if (!v || !v.duration) return;
    setProgress(v.currentTime);
    setDuration(v.duration);
  };

  const onSeek = (value: number) => {
    const v = videoRefs.current[index];
    if (!v || !hasVideo) return;
    v.currentTime = value;
    setProgress(value);
  };

  return (
    <section className="w-full min-w-0 max-w-full px-2.5">
      <div className="mb-2.5 flex w-full items-end justify-between">
        <div className="relative">
          <h2 className="font-display text-[50px] leading-none text-black">
            Gallery
          </h2>
          <Image
            src="/images/scribbles/gallery.svg"
            alt=""
            width={51}
            height={46}
            className="pointer-events-none absolute -right-14 -top-4 -rotate-[10deg]"
            aria-hidden
          />
        </div>

        <div className="flex gap-4 font-body text-2xl text-black">
          <button
            type="button"
            onClick={goPrev}
            disabled={!canPrev}
            className={`transition-opacity duration-200 ${
              canPrev ? "opacity-100 hover:opacity-60" : "cursor-default opacity-50"
            }`}
            aria-label="Previous video"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={!canNext}
            className={`transition-opacity duration-200 ${
              canNext ? "opacity-100 hover:opacity-60" : "cursor-default opacity-50"
            }`}
            aria-label="Next video"
          >
            Next
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex w-full min-w-0 snap-x snap-mandatory gap-2.5 overflow-x-auto overscroll-x-contain scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {videos.map((item, i) => {
          const isActive = i === index;
          return (
            <div
              key={item.id}
              className="gallery-slide relative aspect-[381/677] w-[min(100%,381px)] max-w-full shrink-0 snap-start overflow-hidden bg-neutral-100"
              onClick={() => {
                if (i !== index) selectIndex(i);
              }}
            >
              {item.src ? (
                <video
                  ref={(el) => {
                    videoRefs.current[i] = el;
                  }}
                  src={item.src}
                  poster={item.poster}
                  muted
                  playsInline
                  loop
                  preload={isActive ? "auto" : "metadata"}
                  className="h-full w-full object-cover"
                  onTimeUpdate={() => onTimeUpdate(i)}
                  onPlay={() => {
                    if (i === indexRef.current) setPlaying(true);
                  }}
                  onPause={() => {
                    if (i === indexRef.current) setPlaying(false);
                  }}
                  onLoadedData={() => {
                    if (i === indexRef.current) void playActive();
                  }}
                  onLoadedMetadata={() => {
                    const v = videoRefs.current[i];
                    if (v && i === index) setDuration(v.duration);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isActive) {
                      void togglePlay();
                      return;
                    }
                    selectIndex(i);
                  }}
                />
              ) : (
                <Image
                  src={item.poster}
                  alt={item.alt}
                  fill
                  sizes="381px"
                  className="object-cover"
                  priority={i === 0}
                />
              )}

              {isActive && item.src && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-3 pb-3 pt-10">
                  <div className="mb-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        void togglePlay();
                      }}
                      className="font-body text-sm tracking-[-0.08px] text-white"
                      aria-label={playing ? "Pause" : "Play"}
                    >
                      {playing ? "Pause" : "Play"}
                    </button>
                    <span className="font-body text-xs tabular-nums text-white/80">
                      {formatTime(progress)} / {formatTime(duration)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    step={0.05}
                    value={progress}
                    onChange={(e) => onSeek(Number(e.target.value))}
                    onClick={(e) => e.stopPropagation()}
                    className="scrubber"
                    aria-label="Seek"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
