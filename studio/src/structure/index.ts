import type {StructureResolver} from 'sanity/structure'
import {DocumentIcon} from '@sanity/icons/Document'

const SINGLETONS = ['mediaKit']

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Media Kit')
        .icon(DocumentIcon)
        .child(
          S.document()
            .schemaType('mediaKit')
            .documentId('mediaKit')
            .title('Media Kit'),
        ),
      ...S.documentTypeListItems().filter(
        (listItem) => !SINGLETONS.includes(listItem.getId() as string),
      ),
    ])
