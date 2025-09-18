import type { CollectionConfig } from 'payload'

export const QuestionnaireSubmission: CollectionConfig = {
  slug: 'questionnaire-submissions',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['questionnaire', 'totalScore', 'standardRiskLevel', 'riskLevel', 'createdAt'],
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
      name: 'riskLevel',
      type: 'text',
      required: true,
      label: 'Risk Level',
      admin: {
        description: 'Original risk level as calculated by the questionnaire-specific scorer',
      },
    },
    {
      name: 'standardRiskLevel',
      type: 'select',
      required: true,
      label: 'Standard Risk Level',
      options: [
        { label: 'Minimal', value: 'minimal' },
        { label: 'Low', value: 'low' },
        { label: 'Moderate', value: 'moderate' },
        { label: 'High', value: 'high' },
        { label: 'Severe', value: 'severe' },
      ],
      admin: {
        description: 'Standardized risk level for filtering and comparison across questionnaires',
      },
    },
    {
      name: 'riskDescription',
      type: 'textarea',
      required: false,
      label: 'Risk Description',
      admin: {
        description: 'Additional description or interpretation of the risk level',
      },
    },
    {
      name: 'submittedBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Submitted By',
      admin: {
        allowCreate: false,
      },
    },
  ],
  timestamps: true,
}
