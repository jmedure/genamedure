import {defineArrayMember, defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons/Document'

export const mediaKit = defineType({
  name: 'mediaKit',
  title: 'Media Kit',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {name: 'chrome', title: 'Site'},
    {name: 'hero', title: 'Hero'},
    {name: 'about', title: 'About'},
    {name: 'stats', title: 'Stats'},
    {name: 'gallery', title: 'Gallery'},
    {name: 'brands', title: 'Brands'},
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      group: 'chrome',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      group: 'chrome',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'tiktokHandle',
      title: 'TikTok handle',
      type: 'string',
      description: 'Include the @ (e.g. @genamedure)',
      group: 'chrome',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tiktokUrl',
      title: 'TikTok URL',
      type: 'url',
      group: 'chrome',
      validation: (rule) =>
        rule.required().uri({scheme: ['http', 'https']}),
    }),

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
      name: 'brandLogos',
      title: 'Brand logos (ticker)',
      type: 'array',
      group: 'brands',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'brandLogo',
          title: 'Brand logo',
          fields: [
            defineField({
              name: 'name',
              title: 'Brand name',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'logo',
              title: 'Logo',
              type: 'image',
              options: {hotspot: true},
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'width',
              title: 'Width (optional)',
              type: 'number',
              description: 'Used for aspect ratio in the ticker',
            }),
            defineField({
              name: 'height',
              title: 'Height (optional)',
              type: 'number',
              description: 'Used for aspect ratio in the ticker',
            }),
          ],
          preview: {
            select: {title: 'name', media: 'logo'},
          },
        }),
      ],
    }),

    defineField({
      name: 'pronunciation',
      title: 'Pronunciation',
      type: 'string',
      group: 'about',
    }),
    defineField({
      name: 'about',
      title: 'About (mobile)',
      type: 'text',
      rows: 4,
      group: 'about',
    }),
    defineField({
      name: 'aboutDesktop',
      title: 'About (desktop)',
      type: 'text',
      rows: 4,
      group: 'about',
      description: 'Leave blank to reuse the mobile about text',
    }),

    defineField({
      name: 'statsLastUpdated',
      title: 'Stats last updated',
      type: 'string',
      group: 'stats',
      description: 'Shown as-is (e.g. 8:45 AM PDT)',
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
      description: 'e.g. Last 60 days',
    }),
    defineField({
      name: 'metrics',
      title: 'Metrics',
      type: 'array',
      group: 'stats',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'metric',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {title: 'label', subtitle: 'value'},
          },
        }),
      ],
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
    select: {title: 'name'},
    prepare: ({title}) => ({
      title: title || 'Media Kit',
      subtitle: 'Site content',
    }),
  },
})
