import Image from "next/image";
import { MaskedCountUp } from "@/components/MaskedCountUp";
import type { StatMetric } from "@/lib/getMediaKit";

type StatsProps = {
  lastUpdated: string;
  followers: string;
  periodLabel: string;
  metrics: StatMetric[];
};

export function Stats({
  lastUpdated,
  followers,
  periodLabel,
  metrics,
}: StatsProps) {
  return (
    <section className="w-full px-2.5">
      <div className="flex flex-col gap-12">
        <div className="relative flex flex-col gap-2 md:gap-2">
          <div className="relative inline-block w-fit">
            <h2 className="font-display text-[50px] leading-none text-black">
              Stats
            </h2>
            <Image
              src="/images/scribbles/stats.svg"
              alt=""
              width={20}
              height={36}
              className="pointer-events-none absolute -right-7 top-3"
              aria-hidden
            />
          </div>
          <div className="flex gap-2 font-body text-base tracking-[-0.08px] text-black">
            <span className="opacity-50">Last updated:</span>
            <span>{lastUpdated}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <p className="font-body text-2xl capitalize tracking-[-0.12px] text-ink md:normal-case md:tracking-[-0.24px]">
            followers
          </p>
          <MaskedCountUp
            value={followers}
            className="font-display text-[120px] text-black"
          />
        </div>

        <div className="flex flex-col gap-12">
          <p className="font-body text-[32px] text-black opacity-50 md:tracking-[-0.16px]">
            {periodLabel}
          </p>

          <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:flex md:flex-wrap md:justify-between md:gap-y-12">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="flex w-full max-w-[175px] flex-col gap-1"
              >
                <p className="font-body text-2xl capitalize tracking-[-0.12px] text-ink md:normal-case">
                  {m.label}
                </p>
                <MaskedCountUp
                  value={m.value}
                  className="font-display text-[60px] text-black md:text-[80px]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
