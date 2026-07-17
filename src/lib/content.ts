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
  aboutDesktop:
    "hi! I’m a lifestyle and home tiktok creator based in Ventura, CA. My content centers around personal style, intentional living and navigating motherhood with a strong sense of self.",
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
};

export const BRAND_LOGOS: BrandLogo[] = [
  { name: "Teva", src: "/images/brands/teva.svg", width: 198, height: 60 },
  {
    name: "Free People",
    src: "/images/brands/free-people.svg",
    width: 240,
    height: 24,
  },
  { name: "Quince", src: "/images/brands/quince.svg", width: 164, height: 48 },
  { name: "Nuuly", src: "/images/brands/nuuly.svg", width: 194, height: 47 },
  {
    name: "Daydreamer LA",
    src: "/images/brands/daydreamer.svg",
    width: 92,
    height: 92,
  },
  { name: "Wool&", src: "/images/brands/wool.svg", width: 210, height: 52 },
  {
    name: "Algae Cooking Club",
    src: "/images/brands/algae.svg",
    width: 129,
    height: 120,
  },
  { name: "Sézane", src: "/images/brands/sezane.svg", width: 240, height: 78 },
  {
    name: "Living Proof",
    src: "/images/brands/living-proof.svg",
    width: 240,
    height: 45,
  },
  {
    name: "Anthropologie",
    src: "/images/brands/anthropologie.svg",
    width: 240,
    height: 15,
  },
  {
    name: "Sønderhaus",
    src: "/images/brands/sonderhaus.png",
    width: 240,
    height: 68,
  },
  {
    name: "Rat Boi",
    src: "/images/brands/rat-boi.png",
    width: 240,
    height: 120,
  },
  {
    name: "Sproos",
    src: "/images/brands/sproos.svg",
    width: 126,
    height: 120,
  },
];

export const STATS = {
  lastUpdated: "8:45 AM PDT",
  followers: "20.6k",
  periodLabel: "Last 60 days",
  metrics: [
    { label: "post views", value: "5.2M" },
    { label: "profile views", value: "236k" },
    { label: "likes", value: "872k" },
    { label: "comments", value: "867" },
    { label: "shares", value: "7.5k" },
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
