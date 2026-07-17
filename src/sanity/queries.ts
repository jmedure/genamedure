import { defineQuery } from "next-sanity";

export const MEDIA_KIT_QUERY = defineQuery(`
  *[_id == "mediaKit"][0]{
    _updatedAt,
    pronunciation,
    about,
    followers,
    periodLabel,
    postViews,
    profileViews,
    likes,
    comments,
    shares,
    heroImages[]{
      _key,
      alt,
      asset->{_id, url}
    },
    galleryVideos[]{
      _key,
      alt,
      poster{
        asset->{
          _id,
          url,
          metadata{ lqip }
        }
      },
      "videoUrl": video.asset->url
    },
    brandNames
  }
`);
