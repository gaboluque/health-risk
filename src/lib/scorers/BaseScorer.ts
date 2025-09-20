import type { QuestionnaireSubmission } from '@/payload-types'
import type { FormData } from '@/lib/types/questionnaire'
import { RiskResult } from '@/lib/types/questionnaire'
import { getQuestionnaireDataByName } from '../utils/questionnaires/questionnaire-registry'
import type { QuestionnaireSchema } from '@/lib/types/questionnaire'
import { RISK_LEVEL_MAPPING, riskLevelToNumber } from '../utils/risk-mapping'

export class BaseScorer {
  questionnaireData: QuestionnaireSchema

  constructor(
    protected readonly questionnaireSubmission: QuestionnaireSubmission,
    protected readonly formData: FormData,
  ) {
    this.questionnaireSubmission = questionnaireSubmission
    this.formData = formData
    this.questionnaireData = getQuestionnaireDataByName(questionnaireSubmission.questionnaireName)
  }

  public calculateRisk(): RiskResult {
    throw new Error('Not implemented')
  }

  protected getAnswerValue(questionId: string): string {
    return this.formData.answers[questionId] || ''
  }

  protected getRiskDescription(risk: RiskResult['riskLevel']): RiskResult['riskDescription'] {
    const riskLevel = RISK_LEVEL_MAPPING[risk]
    const riskCategory = this.questionnaireData.scoring.riskCategories.find(
      ({ level }) => level === riskLevel,
    )

    return riskCategory?.description || 'Not found'
  }

  protected getRiskValue(risk: RiskResult['riskLevel']): RiskResult['riskValue'] {
    return riskLevelToNumber(risk)
  }
}
