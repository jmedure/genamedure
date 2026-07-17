import Image from "next/image";

type AboutProps = {
  pronunciation: string;
  about: string;
};

export function About({ pronunciation, about }: AboutProps) {
  return (
    <section className="w-full bg-white px-3 py-0">
      <div className="relative flex flex-col gap-12">
        <div className="relative inline-block w-fit">
          <h2 className="font-display text-[50px] leading-none text-ink">
            About
          </h2>
          <Image
            src="/images/scribbles/about.svg"
            alt=""
            width={38}
            height={34}
            className="pointer-events-none absolute -right-10 top-0 rotate-[11deg] md:-right-12"
            aria-hidden
          />
        </div>

        <p className="font-body text-2xl tracking-[-0.12px] text-ink md:text-[32px] md:tracking-[-0.16px]">
          {pronunciation}
        </p>

        <p className="max-w-[367px] font-body text-2xl tracking-[-0.12px] text-ink md:max-w-[592px] md:text-[32px] md:tracking-[-0.16px]">
          {about}
        </p>
      </div>
    </section>
  );
}
