import {defineField, defineType} from 'sanity'
import {LinkIcon} from '@sanity/icons/Link'

/** Private token store — hidden from Studio structure; written by the site API. */
export const tiktokConnection = defineType({
  name: 'tiktokConnection',
  title: 'TikTok Connection',
  type: 'document',
  icon: LinkIcon,
  fields: [
    defineField({name: 'username', type: 'string', readOnly: true}),
    defineField({name: 'openId', type: 'string', readOnly: true}),
    defineField({name: 'scope', type: 'string', readOnly: true}),
    defineField({name: 'accessToken', type: 'text', readOnly: true}),
    defineField({name: 'refreshToken', type: 'text', readOnly: true}),
    defineField({name: 'expiresAt', type: 'datetime', readOnly: true}),
    defineField({name: 'refreshExpiresAt', type: 'datetime', readOnly: true}),
    defineField({name: 'connectedAt', type: 'datetime', readOnly: true}),
    defineField({name: 'updatedAt', type: 'datetime', readOnly: true}),
  ],
  preview: {
    select: {title: 'username'},
    prepare: ({title}) => ({title: title ? `@${title}` : 'TikTok connection'}),
  },
})
