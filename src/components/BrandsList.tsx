import Image from "next/image";

type BrandsListProps = {
  brandNames: string[];
};

/** Column count that grows with the list; current ~13 brands → 2 cols. */
function brandColumnCount(count: number) {
  if (count <= 6) return 1;
  if (count <= 14) return 2;
  if (count <= 24) return 3;
  return 4;
}

function columnClass(cols: number) {
  switch (cols) {
    case 1:
      return "columns-1";
    case 2:
      return "columns-1 md:columns-2";
    case 3:
      return "columns-1 sm:columns-2 lg:columns-3";
    default:
      return "columns-1 sm:columns-2 lg:columns-3 xl:columns-4";
  }
}

export function BrandsList({ brandNames }: BrandsListProps) {
  const cols = brandColumnCount(brandNames.length);

  return (
    <section className="w-full min-w-0 px-2.5">
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

        <ul
          className={`max-w-3xl gap-x-16 font-body text-base text-black md:gap-x-24 ${columnClass(cols)}`}
        >
          {brandNames.map((name) => (
            <li key={name} className="break-inside-avoid mb-1">
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
