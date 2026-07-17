import { defineQuery } from "next-sanity";

export const MEDIA_KIT_QUERY = defineQuery(`
  *[_id == "mediaKit"][0]{
    name,
    email,
    tiktokHandle,
    tiktokUrl,
    pronunciation,
    about,
    aboutDesktop,
    statsLastUpdated,
    followers,
    periodLabel,
    metrics[]{
      _key,
      label,
      value
    },
    heroImages[]{
      _key,
      alt,
      asset->{_id, url}
    },
    brandLogos[]{
      _key,
      name,
      width,
      height,
      logo{
        asset->{_id, url}
      }
    },
    galleryVideos[]{
      _key,
      alt,
      poster{
        asset->{_id, url}
      },
      "videoUrl": video.asset->url
    },
    brandNames
  }
`);
