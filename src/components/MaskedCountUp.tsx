"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;
const EXPAND_MS = 420;
const SPIN_MS = 900;
const STAGGER_MS = 85;

type MaskedCountUpProps = {
  value: string;
  className?: string;
};

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function PlaceShell({
  active,
  delayMs,
  children,
}: {
  active: boolean;
  delayMs: number;
  children: ReactNode;
}) {
  return (
    <span
      className="inline-grid h-[1em] overflow-hidden align-baseline"
      style={{
        gridTemplateColumns: active ? "1fr" : "0fr",
        transition: active
          ? `grid-template-columns ${EXPAND_MS}ms var(--ease-out) ${delayMs}ms`
          : "none",
      }}
      aria-hidden
    >
      <span className="min-w-0 overflow-hidden">{children}</span>
    </span>
  );
}

function DigitPlace({
  digit,
  active,
  delayMs,
}: {
  digit: number;
  active: boolean;
  delayMs: number;
}) {
  const offset = active ? digit : 0;

  return (
    <PlaceShell active={active} delayMs={delayMs}>
      <span className="relative inline-block h-[1em] leading-none">
        {/* Size to the final glyph so spacing matches static text */}
        <span className="invisible inline-block">{digit}</span>
        <span className="absolute inset-0 overflow-hidden">
          <span
            className="flex flex-col will-change-transform"
            style={{
              transform: `translate3d(0, ${-offset}em, 0)`,
              transition: active
                ? `transform ${SPIN_MS}ms var(--ease-out) ${delayMs}ms`
                : "none",
            }}
          >
            {DIGITS.map((d) => (
              <span
                key={d}
                className="flex h-[1em] shrink-0 items-center justify-center leading-none"
              >
                {d}
              </span>
            ))}
          </span>
        </span>
      </span>
    </PlaceShell>
  );
}

function SymbolPlace({
  char,
  active,
  delayMs,
}: {
  char: string;
  active: boolean;
  delayMs: number;
}) {
  return (
    <PlaceShell active={active} delayMs={delayMs}>
      <span className="inline-block leading-none">{char}</span>
    </PlaceShell>
  );
}

function StaticValue({ value }: { value: string }) {
  return (
    <>
      {Array.from(value).map((char, i) => (
        <span key={`${i}-${char}`} className="inline-block leading-none">
          {char}
        </span>
      ))}
    </>
  );
}

export function MaskedCountUp({ value, className }: MaskedCountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      setActive(true);
      return;
    }

    // Observe a full-size sizer — collapsed 0fr digits have ~0 area, so IO
    // with a non-zero threshold never fires and numbers stay invisible.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -5% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      className={`relative inline-flex h-[1em] items-baseline leading-none ${className ?? ""}`}
      aria-label={value}
    >
      <span className="invisible inline-flex" aria-hidden>
        <StaticValue value={value} />
      </span>
      <span className="absolute inset-0 inline-flex items-baseline overflow-hidden">
        {Array.from(value).map((char, i) => {
          const delayMs = i * STAGGER_MS;

          if (char >= "0" && char <= "9") {
            return (
              <DigitPlace
                key={`${i}-${char}`}
                digit={Number(char)}
                active={active}
                delayMs={delayMs}
              />
            );
          }

          return (
            <SymbolPlace
              key={`${i}-${char}`}
              char={char}
              active={active}
              delayMs={delayMs}
            />
          );
        })}
      </span>
    </span>
  );
}
