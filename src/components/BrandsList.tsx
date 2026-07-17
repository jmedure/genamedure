import Image from "next/image";

type BrandsListProps = {
  brandNames: string[];
};

export function BrandsList({ brandNames }: BrandsListProps) {
  return (
    <section className="w-full px-2.5">
      <div className="flex flex-col gap-[42px]">
        <div className="relative inline-block w-fit">
          <h2 className="font-display text-[50px] leading-none text-black">
            Brands
          </h2>
          <Image
            src="/images/scribbles/brands.svg"
            alt=""
            width={32}
            height={53}
            className="pointer-events-none absolute -right-12 -top-1 -rotate-[6deg]"
            aria-hidden
          />
        </div>

        <ul className="flex flex-col gap-1 font-body text-base text-black md:w-[143px]">
          {brandNames.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
