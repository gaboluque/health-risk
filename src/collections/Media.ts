import type { CollectionConfig } from 'payload'
import { basePolicy } from '@/lib/policies/basePolicy'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: basePolicy.onlyAdmin,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
