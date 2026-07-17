import {defineArrayMember, defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons/Document'

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
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              validation: (rule) =>
                rule.required().warning('Alt text helps accessibility'),
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
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'poster',
              title: 'Poster image',
              type: 'image',
              options: {hotspot: true},
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'video',
              title: 'Video file',
              type: 'file',
              options: {accept: 'video/*'},
              description: 'Optional — poster shows until a video is uploaded',
            }),
          ],
          preview: {
            select: {title: 'alt', media: 'poster'},
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
