import {defineArrayMember, defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons/Document'
import {AutoAltImageInput} from '../components/AutoAltImageInput'
import {GalleryClipInput} from '../components/GalleryClipInput'

export const mediaKit = defineType({
  name: 'mediaKit',
  title: 'Media Kit',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {name: 'hero', title: 'Hero'},
    {name: 'about', title: 'About'},
    {name: 'stats', title: 'Stats'},
    {name: 'gallery', title: 'Gallery'},
    {name: 'brands', title: 'Brands'},
  ],
  fields: [
    defineField({
      name: 'heroImages',
      title: 'Hero images',
      type: 'array',
      group: 'hero',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          components: {input: AutoAltImageInput},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              description: 'Auto-filled from the image — edit anytime',
              validation: (rule) =>
                rule.required().warning('Alt text helps accessibility'),
            }),
            defineField({
              name: 'altSourceAssetId',
              title: 'Alt source asset',
              type: 'string',
              hidden: true,
              readOnly: true,
            }),
          ],
        }),
      ],
      validation: (rule) => rule.min(1),
    }),

    defineField({
      name: 'pronunciation',
      title: 'Pronunciation',
      type: 'string',
      group: 'about',
    }),
    defineField({
      name: 'about',
      title: 'About',
      type: 'text',
      rows: 4,
      group: 'about',
      description: 'Also used as the site meta description',
    }),

    defineField({
      name: 'followers',
      title: 'Followers',
      type: 'string',
      group: 'stats',
      description: 'Display value (e.g. 20.6k)',
    }),
    defineField({
      name: 'periodLabel',
      title: 'Period label',
      type: 'string',
      group: 'stats',
      description: 'e.g. Last 60 Days',
    }),
    defineField({
      name: 'postViews',
      title: 'Post views',
      type: 'string',
      group: 'stats',
      description: 'Display value (e.g. 5.2M)',
    }),
    defineField({
      name: 'profileViews',
      title: 'Profile views',
      type: 'string',
      group: 'stats',
      description: 'Display value (e.g. 236k)',
    }),
    defineField({
      name: 'likes',
      title: 'Likes',
      type: 'string',
      group: 'stats',
      description: 'Display value (e.g. 872k)',
    }),
    defineField({
      name: 'comments',
      title: 'Comments',
      type: 'string',
      group: 'stats',
      description: 'Display value (e.g. 867)',
    }),
    defineField({
      name: 'shares',
      title: 'Shares',
      type: 'string',
      group: 'stats',
      description: 'Display value (e.g. 7.5k)',
    }),

    defineField({
      name: 'galleryVideos',
      title: 'Gallery videos',
      type: 'array',
      group: 'gallery',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'galleryClip',
          title: 'Gallery clip',
          components: {input: GalleryClipInput},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              description:
                'Auto-filled from the video thumbnail — edit anytime',
              validation: (rule) =>
                rule.required().warning('Generated after video upload'),
            }),
            defineField({
              name: 'video',
              title: 'Video',
              type: 'file',
              options: {accept: 'video/*'},
              description:
                'Upload an MP4 when possible (best browser support). Thumbnail and alt text are generated automatically.',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'poster',
              title: 'Poster',
              type: 'image',
              options: {hotspot: true},
              hidden: true,
              readOnly: true,
            }),
            defineField({
              name: 'posterSourceVideoId',
              title: 'Poster source video',
              type: 'string',
              hidden: true,
              readOnly: true,
            }),
          ],
          preview: {
            select: {title: 'alt', media: 'poster'},
            prepare: ({title, media}) => ({
              title: title || 'Gallery clip',
              subtitle: media ? 'Thumbnail ready' : 'Generating thumbnail…',
              media,
            }),
          },
        }),
      ],
    }),

    defineField({
      name: 'brandNames',
      title: 'Brand names (list)',
      type: 'array',
      group: 'brands',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'list'},
    }),
  ],
  preview: {
    prepare: () => ({
      title: 'Media Kit',
      subtitle: 'Site content',
    }),
  },
})
