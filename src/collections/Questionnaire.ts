import type { CollectionConfig } from 'payload'

export const Questionnaire: CollectionConfig = {
  slug: 'questionnaires',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
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
