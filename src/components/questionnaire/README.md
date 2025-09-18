# Questionnaire System

This directory contains the abstracted questionnaire system that allows for easy creation of new health risk assessment questionnaires.

## Architecture Overview

The system is built with the following components:

### Core Components

1. **QuestionnaireContainer** - Main container that handles form/results state
2. **QuestionnaireForm** - Generic form component with validation and progress tracking
3. **QuestionnaireResults** - Generic results display with risk categories and interpretation
4. **Types** - Shared TypeScript interfaces for type safety

### Key Files

- `QuestionnaireContainer.tsx` - Main orchestrating component
- `QuestionnaireForm.tsx` - Form generation and validation
- `QuestionnaireResults.tsx` - Results display with risk visualization
- `index.ts` - Exports for easy importing
- `../lib/types/questionnaire.ts` - TypeScript definitions
- `../lib/actions/submit-questionnaire.ts` - Generic submission logic
- `../lib/utils/questionnaire-loader.ts` - Utility functions

## Creating a New Questionnaire

### Step 1: Create the Questionnaire Schema

Create a JSON file in `src/lib/data/questionnaires/` with your questionnaire definition:

```json
{
  "id": "my-questionnaire",
  "name": "My Risk Assessment",
  "description": "Description of what this measures",
  "version": "1.0.0",
  "category": "cardiovascular",
  "questions": [
    {
      "id": "question1",
      "type": "select",
      "label": "Question text",
      "description": "Additional context",
      "required": true,
      "options": [
        {
          "value": "option1",
          "label": "Option 1 text"
        },
        {
          "value": "option2", 
          "label": "Option 2 text"
        }
      ]
    }
  ],
  "scoring": {
    "algorithm": "custom_algorithm_name",
    "output": {
      "type": "percentage",
      "label": "10-Year Risk",
      "unit": "%",
      "precision": 1
    },
    "riskCategories": [
      {
        "name": "Low Risk",
        "range": { "min": 0, "max": 4.9 },
        "color": "#10b981",
        "description": "Low risk description"
      }
    ]
  },
  "metadata": {
    "createdAt": "2025-09-18",
    "clinicalUse": "Risk assessment"
  }
}
```

### Step 2: Create the Scorer

Create a scorer class in `src/lib/scorers/` that extends `BaseScorer`:

```typescript
import { BaseScorer } from './BaseScorer'
import type { RiskResult } from '@/lib/types/questionnaire'
import type { QuestionnaireSubmission } from '@/payload-types'

export class MyQuestionnaireScorer extends BaseScorer {
  calculateRisk(): RiskResult {
    // Get answers using this.getAnswerValue(questionId)
    const age = this.getAnswerValue('age')
    
    // Implement your scoring algorithm
    const score = this.calculateMyScore()
    
    // Determine risk category and interpretation
    const risk = this.getRiskCategory(score)
    const interpretation = this.getInterpretation(score, risk)
    
    return {
      score,
      risk,
      interpretation,
    }
  }
  
  private calculateMyScore(): number {
    // Your custom scoring logic here
    return 0
  }
  
  private getRiskCategory(score: number): string {
    // Determine risk category based on score
    if (score < 5) return 'Low Risk'
    if (score < 20) return 'Moderate Risk'
    return 'High Risk'
  }
  
  private getInterpretation(score: number, risk: string): string {
    // Return clinical interpretation text
    return `Based on your responses, your risk score is ${score}%.`
  }
}
```

### Step 3: Create the Server Action

Create a server action in `src/app/(frontend)/my-questionnaire/actions/`:

```typescript
'use server'

import { submitQuestionnaire } from '@/lib/actions/submit-questionnaire'
import { MyQuestionnaireScorer } from '@/lib/scorers/MyQuestionnaireScorer'
import type { FormData, QuestionnaireSchema, SubmissionResponse } from '@/lib/types/questionnaire'

export async function submitMyQuestionnaire(
  questionnaire: QuestionnaireSchema,
  formData: FormData,
): Promise<SubmissionResponse> {
  return submitQuestionnaire({
    questionnaire,
    formData,
    scorerClass: MyQuestionnaireScorer,
  })
}
```

### Step 4: Create the Form Component

Create a form component in `src/app/(frontend)/my-questionnaire/components/`:

```typescript
'use client'

import React from 'react'
import { QuestionnaireContainer } from '@/components/questionnaire'
import { submitMyQuestionnaire } from '../actions/submit-my-questionnaire'
import type { QuestionnaireSchema, FormData } from '@/lib/types/questionnaire'

interface MyQuestionnaireFormProps {
  questionnaire: QuestionnaireSchema
}

export function MyQuestionnaireForm({ questionnaire }: MyQuestionnaireFormProps) {
  const handleSubmit = async (formData: FormData) => {
    return submitMyQuestionnaire(questionnaire, formData)
  }

  return (
    <QuestionnaireContainer
      questionnaire={questionnaire}
      onSubmit={handleSubmit}
      submitButtonText="Calculate My Risk"
      loadingText="Calculating..."
    />
  )
}
```

### Step 5: Create the Page

Create the page in `src/app/(frontend)/my-questionnaire/page.tsx`:

```typescript
import React from 'react'
import { MyQuestionnaireForm } from './components/MyQuestionnaireForm'
import { loadQuestionnaire } from '@/lib/utils/questionnaire-loader'
import myQuestionnaireData from '@/lib/data/questionnaires/my-questionnaire.json'

export default function MyQuestionnairePage() {
  const questionnaire = loadQuestionnaire(myQuestionnaireData)
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {questionnaire.name}
            </h1>
            <p className="text-gray-600 text-lg mb-4">
              {questionnaire.description}
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>Target Population:</strong> {questionnaire.metadata.targetPopulation}
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    <strong>Estimated Time:</strong> {questionnaire.metadata.estimatedCompletionTime}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <MyQuestionnaireForm questionnaire={questionnaire} />
        </div>
      </div>
    </div>
  )
}
```

## Customization Options

### Form Customization

The `QuestionnaireContainer` accepts these props for customization:

- `submitButtonText` - Custom text for submit button
- `loadingText` - Text shown while processing
- `showPrintButton` - Whether to show print button in results
- `customActions` - Additional action buttons for results page

### Results Customization

The results component automatically:
- Displays the risk score with appropriate color coding
- Shows risk category based on the questionnaire's risk categories
- Includes clinical interpretation from the scorer
- Lists all risk categories for reference
- Includes medical disclaimer

## Type Safety

The system is fully typed with TypeScript interfaces:

- `QuestionnaireSchema` - Complete questionnaire definition
- `FormData` - User input data structure  
- `RiskResult` - Scorer output structure
- `SubmissionResult` - Complete submission result
- `SubmissionResponse` - Server action response

## Best Practices

1. **Validation**: Always validate questionnaire data using `loadQuestionnaire()`
2. **Error Handling**: Server actions include comprehensive error handling
3. **Type Safety**: Use the provided TypeScript interfaces
4. **Scoring**: Implement complex scoring logic in dedicated scorer classes
5. **Testing**: Test both the scorer logic and form interactions
6. **Accessibility**: The components include ARIA labels and keyboard navigation
7. **Responsive**: All components are mobile-friendly

## Example: ASCVD Implementation

See the ASCVD implementation as a reference:
- `src/lib/data/questionnaires/ascvd.json` - Questionnaire schema
- `src/lib/scorers/ASCVDScorer.ts` - Complex scoring algorithm
- `src/app/(frontend)/ascvd/` - Complete implementation

The ASCVD questionnaire demonstrates:
- Complex risk calculation algorithms
- Multiple risk categories with color coding
- Professional medical disclaimer
- Comprehensive form validation
