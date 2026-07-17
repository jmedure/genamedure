import {
  BRAND_LOGOS,
  BRAND_NAMES,
  GALLERY_VIDEOS,
  HERO_IMAGES,
  SITE,
  STATS,
  type BrandLogo,
} from "@/lib/content";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { MEDIA_KIT_QUERY } from "@/sanity/queries";

export type HeroImage = { src: string; alt: string };

export type GalleryVideo = {
  id: string;
  poster: string;
  src: string;
  alt: string;
};

export type StatMetric = { label: string; value: string };

export type MediaKitContent = {
  site: {
    name: string;
    email: string;
    tiktokHandle: string;
    tiktokUrl: string;
    pronunciation: string;
    about: string;
    aboutDesktop: string;
  };
  heroImages: HeroImage[];
  brandLogos: BrandLogo[];
  stats: {
    lastUpdated: string;
    followers: string;
    periodLabel: string;
    metrics: StatMetric[];
  };
  galleryVideos: GalleryVideo[];
  brandNames: string[];
};

const defaults: MediaKitContent = {
  site: {
    name: SITE.name,
    email: SITE.email,
    tiktokHandle: SITE.tiktokHandle,
    tiktokUrl: SITE.tiktokUrl,
    pronunciation: SITE.pronunciation,
    about: SITE.about,
    aboutDesktop: SITE.aboutDesktop,
  },
  heroImages: HERO_IMAGES.map((img) => ({ ...img })),
  brandLogos: BRAND_LOGOS.map((logo) => ({ ...logo })),
  stats: {
    lastUpdated: STATS.lastUpdated,
    followers: STATS.followers,
    periodLabel: STATS.periodLabel,
    metrics: STATS.metrics.map((m) => ({ ...m })),
  },
  galleryVideos: GALLERY_VIDEOS.map((v) => ({ ...v })),
  brandNames: [...BRAND_NAMES],
};

type SanityMediaKit = {
  name?: string | null;
  email?: string | null;
  tiktokHandle?: string | null;
  tiktokUrl?: string | null;
  pronunciation?: string | null;
  about?: string | null;
  aboutDesktop?: string | null;
  statsLastUpdated?: string | null;
  followers?: string | null;
  periodLabel?: string | null;
  metrics?: Array<{
    _key?: string;
    label?: string | null;
    value?: string | null;
  }> | null;
  heroImages?: Array<{
    _key?: string;
    alt?: string | null;
    asset?: { _id?: string; url?: string | null } | null;
  }> | null;
  brandLogos?: Array<{
    _key?: string;
    name?: string | null;
    width?: number | null;
    height?: number | null;
    logo?: {
      asset?: { _id?: string; url?: string | null } | null;
    } | null;
  }> | null;
  galleryVideos?: Array<{
    _key?: string;
    alt?: string | null;
    poster?: {
      asset?: { _id?: string; url?: string | null } | null;
    } | null;
    videoUrl?: string | null;
  }> | null;
  brandNames?: Array<string | null> | null;
};

function imageUrl(
  source: { asset?: { _id?: string; url?: string | null } | null } | null | undefined,
  width: number,
): string | null {
  if (!source?.asset) return null;
  if (source.asset._id) {
    try {
      return urlFor({ asset: { _ref: source.asset._id } })
        .width(width)
        .auto("format")
        .url();
    } catch {
      // fall through to raw asset url
    }
  }
  return source.asset.url ?? null;
}

function mergeMediaKit(data: SanityMediaKit | null): MediaKitContent {
  if (!data) return defaults;

  const heroImages =
    data.heroImages
      ?.map((img) => {
        const src = imageUrl(img, 1200);
        if (!src) return null;
        return { src, alt: img.alt?.trim() || "Gena Medure" };
      })
      .filter((img): img is HeroImage => Boolean(img)) ?? [];

  const brandLogos =
    data.brandLogos
      ?.map((logo) => {
        const src = imageUrl(logo.logo, 480);
        if (!src || !logo.name) return null;
        return {
          name: logo.name,
          src,
          width: logo.width || 240,
          height: logo.height || 60,
        };
      })
      .filter((logo): logo is BrandLogo => Boolean(logo)) ?? [];

  const galleryVideos =
    data.galleryVideos
      ?.map((clip, i) => {
        const poster = imageUrl(clip.poster, 800);
        if (!poster) return null;
        return {
          id: clip._key || String(i + 1),
          poster,
          src: clip.videoUrl?.trim() || "",
          alt: clip.alt?.trim() || `Gallery clip ${i + 1}`,
        };
      })
      .filter((clip): clip is GalleryVideo => Boolean(clip)) ?? [];

  const metrics =
    data.metrics
      ?.map((m) =>
        m?.label && m?.value
          ? { label: m.label, value: m.value }
          : null,
      )
      .filter((m): m is StatMetric => Boolean(m)) ?? [];

  const brandNames =
    data.brandNames?.filter((name): name is string => Boolean(name?.trim())) ??
    [];

  return {
    site: {
      name: data.name?.trim() || defaults.site.name,
      email: data.email?.trim() || defaults.site.email,
      tiktokHandle: data.tiktokHandle?.trim() || defaults.site.tiktokHandle,
      tiktokUrl: data.tiktokUrl?.trim() || defaults.site.tiktokUrl,
      pronunciation: data.pronunciation?.trim() || defaults.site.pronunciation,
      about: data.about?.trim() || defaults.site.about,
      aboutDesktop:
        data.aboutDesktop?.trim() ||
        data.about?.trim() ||
        defaults.site.aboutDesktop,
    },
    heroImages: heroImages.length ? heroImages : defaults.heroImages,
    brandLogos: brandLogos.length ? brandLogos : defaults.brandLogos,
    stats: {
      lastUpdated:
        data.statsLastUpdated?.trim() || defaults.stats.lastUpdated,
      followers: data.followers?.trim() || defaults.stats.followers,
      periodLabel: data.periodLabel?.trim() || defaults.stats.periodLabel,
      metrics: metrics.length ? metrics : defaults.stats.metrics,
    },
    galleryVideos: galleryVideos.length
      ? galleryVideos
      : defaults.galleryVideos,
    brandNames: brandNames.length ? brandNames : defaults.brandNames,
  };
}

export async function getMediaKit(): Promise<MediaKitContent> {
  if (
    !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
    !process.env.NEXT_PUBLIC_SANITY_DATASET
  ) {
    return defaults;
  }

  try {
    const data = await client.fetch<SanityMediaKit | null>(
      MEDIA_KIT_QUERY,
      {},
      { next: { revalidate: 30 } },
    );
    return mergeMediaKit(data);
  } catch {
    return defaults;
  }
}
