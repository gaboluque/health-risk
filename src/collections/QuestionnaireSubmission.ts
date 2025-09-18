import type { CollectionConfig } from 'payload'

export const QuestionnaireSubmission: CollectionConfig = {
  slug: 'questionnaire-submissions',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['questionnaire', 'totalScore', 'createdAt'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'questionnaire',
      type: 'relationship',
      relationTo: 'questionnaires',
      required: true,
      label: 'Questionnaire',
    },
    {
      name: 'submittedAnswers',
      type: 'array',
      required: true,
      minRows: 1,
      label: 'Submitted Answers',
      fields: [
        {
          name: 'questionIndex',
          type: 'number',
          required: true,
          label: 'Question Index',
          min: 0,
        },
        {
          name: 'questionText',
          type: 'text',
          required: true,
          label: 'Question Text',
        },
        {
          name: 'selectedAnswerIndex',
          type: 'number',
          required: true,
          label: 'Selected Answer Index',
          min: 0,
        },
        {
          name: 'selectedAnswerText',
          type: 'text',
          required: true,
          label: 'Selected Answer Text',
        },
        {
          name: 'score',
          type: 'number',
          required: true,
          label: 'Answer Score',
          min: 0,
        },
      ],
    },
    {
      name: 'totalScore',
      type: 'number',
      required: true,
      label: 'Total Score',
      min: 0,
    },
    {
      name: 'submittedBy',
      type: 'group',
      label: 'Submitted By',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          required: true,
          label: 'First Name',
        },
        {
          name: 'lastName',
          type: 'text',
          required: true,
          label: 'Last Name',
        },
        {
          name: 'email',
          type: 'email',
          required: true,
          label: 'Email',
        },
      ],
    },
  ],
  timestamps: true,
}
