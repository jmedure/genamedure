import type { BrandLogo } from "@/lib/content";

function Logo({ logo }: { logo: BrandLogo }) {
  const h = 44;
  const w = Math.round((logo.width / logo.height) * h);

  return (
    <div
      className="relative flex shrink-0 items-center justify-center px-10"
      style={{ height: Math.max(h, 48), width: w + 80 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo.src}
        alt={logo.name}
        width={w}
        height={h}
        className="h-auto max-h-11 w-auto max-w-none object-contain"
        draggable={false}
      />
    </div>
  );
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
  const animClass = direction === "left" ? "marquee-left" : "marquee-right";

  return (
    <div className="w-full overflow-hidden" aria-hidden>
      <div
        className={`marquee-track ${animClass}`}
        style={{ animationDuration: `${duration}s` }}
      >
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
