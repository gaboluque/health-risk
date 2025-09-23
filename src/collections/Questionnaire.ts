import type { CollectionConfig } from 'payload'
import { basePolicy } from '@/lib/policies/basePolicy'

export const Questionnaire: CollectionConfig = {
  slug: 'questionnaires',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: basePolicy.onlyAdmin,
    create: basePolicy.onlyAdmin,
    update: basePolicy.onlyAdmin,
    delete: basePolicy.onlyAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Questionnaire Name',
    },
    {
      name: 'questions',
      type: 'array',
      required: true,
      minRows: 1,
      label: 'Questions',
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          label: 'Question Text',
        },
        {
          name: 'possibleAnswers',
          type: 'array',
          required: true,
          minRows: 2,
          label: 'Possible Answers',
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
              label: 'Answer Text',
            },
            {
              name: 'score',
              type: 'number',
              required: true,
              label: 'Score',
              min: 0,
            },
          ],
        },
      ],
    },
  ],
}
