/**
 * Default / fallback content when Sanity is empty or unreachable.
 * Live edits happen in studio/ (Media Kit singleton).
 */
export const SITE = {
  name: "Gena Medure",
  email: "genawac@gmail.com",
  tiktokHandle: "@genamedure",
  tiktokUrl: "https://www.tiktok.com/@genamedure",
  pronunciation: "jen-uh muh-do-er",
  about:
    "hi! I’m a lifestyle and home creator based in Ventura, CA. My content centers around personal style, intentional living and navigating motherhood with a strong sense of self.",
} as const;

export const HERO_IMAGES = [
  { src: "/images/hero/1.png", alt: "Gena Medure in a patterned blazer" },
  { src: "/images/hero/2.png", alt: "Gena Medure in a red sweater" },
  { src: "/images/hero/3.png", alt: "Gena Medure in a yellow beanie" },
] as const;

export type BrandLogo = {
  name: string;
  src: string;
  width: number;
  height: number;
  /** Optical size vs ticker baseline (1 = default). */
  scale?: number;
  /**
   * Optical horizontal pad vs baseline (px). Negative tightens around
   * assets with baked-in empty space; positive adds air for flush wordmarks.
   */
  padX?: number;
  /** Extra left/right pad on top of `padX` (px). */
  padLeft?: number;
  padRight?: number;
};

export const BRAND_LOGOS: BrandLogo[] = [
  {
    name: "Teva",
    src: "/images/brands/teva.svg",
    width: 198,
    height: 60,
    scale: 0.92,
    padX: 0,
  },
  {
    name: "Free People",
    src: "/images/brands/free-people.svg",
    width: 240,
    height: 24,
    scale: 0.45,
    padX: -14,
  },
  {
    name: "Quince",
    src: "/images/brands/quince.svg",
    width: 164,
    height: 48,
    scale: 1,
    padX: 2,
  },
  {
    name: "Nuuly",
    src: "/images/brands/nuuly.svg",
    width: 194,
    height: 47,
    scale: 0.8,
    padX: 6,
  },
  {
    name: "Daydreamer LA",
    src: "/images/brands/daydreamer.svg",
    width: 92,
    height: 92,
    scale: 1.32,
    padX: -14,
  },
  {
    name: "Wool&",
    src: "/images/brands/wool.svg",
    width: 210,
    height: 52,
    scale: 0.88,
    padX: 0,
  },
  {
    name: "Algae Cooking Club",
    src: "/images/brands/algae.svg",
    width: 129,
    height: 120,
    scale: 1.58,
    padX: -16,
  },
  {
    name: "Sézane",
    src: "/images/brands/sezane.svg",
    width: 240,
    height: 78,
    scale: 1.14,
    padX: -8,
    padRight: -16,
  },
  {
    name: "Living Proof",
    src: "/images/brands/living-proof.svg",
    width: 240,
    height: 45,
    scale: 0.9,
    padX: 4,
    padLeft: -16,
  },
  {
    name: "Anthropologie",
    src: "/images/brands/anthropologie.svg",
    width: 240,
    height: 15,
    scale: 0.48,
    padX: -18,
  },
  {
    name: "Sønderhaus",
    src: "/images/brands/sonderhaus.png",
    width: 240,
    height: 68,
    scale: 1.48,
    padX: -12,
  },
  {
    name: "Rat Boi",
    src: "/images/brands/rat-boi.png",
    width: 240,
    height: 120,
    scale: 1.65,
    padX: -18,
    padRight: 22,
  },
  {
    name: "Sproos",
    src: "/images/brands/sproos.svg",
    width: 126,
    height: 120,
    scale: 2.05,
    padX: -24,
  },
];

export const STATS = {
  lastUpdated: "today",
  followers: "20.6K",
  periodLabel: "Last 60 Days",
  metrics: [
    { label: "Post Views", value: "5.2M" },
    { label: "Profile Views", value: "236K" },
    { label: "Likes", value: "872K" },
    { label: "Comments", value: "867" },
    { label: "Shares", value: "7.5K" },
  ],
} as const;

/** Video gallery items — swap `src` for real short-form clips when ready. */
export const GALLERY_VIDEOS = [
  {
    id: "1",
    poster: "/images/gallery/1.png",
    src: "",
    alt: "Gallery clip 1",
  },
  {
    id: "2",
    poster: "/images/gallery/2.png",
    src: "",
    alt: "Gallery clip 2",
  },
  {
    id: "3",
    poster: "/images/gallery/3.png",
    src: "",
    alt: "Gallery clip 3",
  },
  {
    id: "4",
    poster: "/images/gallery/4.png",
    src: "",
    alt: "Gallery clip 4",
  },
  {
    id: "5",
    poster: "/images/gallery/5.png",
    src: "",
    alt: "Gallery clip 5",
  },
  {
    id: "6",
    poster: "/images/gallery/6.png",
    src: "",
    alt: "Gallery clip 6",
  },
  {
    id: "7",
    poster: "/images/gallery/7.png",
    src: "",
    alt: "Gallery clip 7",
  },
  {
    id: "8",
    poster: "/images/gallery/8.png",
    src: "",
    alt: "Gallery clip 8",
  },
] as const;

export const BRAND_NAMES = [
  "Free People",
  "Anthropologie",
  "Nuuly",
  "Wool&",
  "Teva",
  "Sønderhaus",
  "Living Proof",
  "Quince",
  "Sproos",
  "Sézane",
  "Rat Boi",
  "Daydreamer LA",
  "Algae Cooking Club",
] as const;
