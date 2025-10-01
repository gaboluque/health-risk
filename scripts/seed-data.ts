#!/usr/bin/env tsx

/**
 * Seed Data Script for Health Risk Assessment Platform
 *
 * This script generates realistic test data including:
 * - Multiple users with different profiles
 * - Historical questionnaire submissions across the past year
 * - Varied risk levels and scores for comprehensive testing
 */

import { getPayload } from 'payload'
import config from '../src/payload.config'
import { Questionnaires } from '../src/lib/utils/questionnaires/questionnaire-registry'
// Import types for reference (not directly used in runtime)
// import type { User, QuestionnaireSubmission } from '../src/payload-types'

// Import scorer classes
import { ASCVDScorer } from '../src/lib/scorers/ASCVDScorer'
import { FINDRISKScorer } from '../src/lib/scorers/FINDRISKScorer'
import { FRAXScorer } from '../src/lib/scorers/FRAXScorer'
import { GAD7Scorer } from '../src/lib/scorers/GAD7Scorer'
import { HCRIScorer } from '../src/lib/scorers/HCRIScorer'
import { ODIScorer } from '../src/lib/scorers/ODIScorer'

// Load environment variables
import 'dotenv/config'

// Types for our seed data
interface SeedUser {
  email: string
  password: string
  role: 'admin' | 'client' | 'user'
  profile?: {
    firstName: string
    lastName: string
    birthDate: string
    height: number
    weight: number
    sex: 'male' | 'female'
    currentSmoking: boolean
    idNumber: string
    socialSecurityNumber?: string
    cellphoneNumber: string
    privateInsurance?: string
  }
}

interface SeedSubmission {
  questionnaireName: string
  submittedAnswers: Array<{
    questionIndex: number
    questionText: string
    selectedAnswerIndex: number
    selectedAnswerText: string
    score: number
  }>
  totalScore: number
  riskLevel: 'minimal' | 'low' | 'moderate' | 'high' | 'severe'
  riskValue: number
  riskDescription?: string
  createdAt: Date
}

// Sample user data with realistic profiles
const sampleUsers: SeedUser[] = [
  // Admin user
  {
    email: 'admin@healthrisk.com',
    password: 'admin123',
    role: 'admin',
  },

  // Client users (healthcare providers)
  {
    email: 'dr@client.com',
    password: 'client123',
    role: 'client',
  },
  {
    email: 'dr.martinez@clinica.com',
    password: 'client123',
    role: 'client',
  },
  {
    email: 'enfermera.lopez@hospital.com',
    password: 'client123',
    role: 'client',
  },

  // Regular users (patients) with detailed profiles
  {
    email: 'john.doe@test.com',
    password: 'user123',
    role: 'user',
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      birthDate: '1990-01-01',
      height: 180,
      weight: 75,
      sex: 'male',
      currentSmoking: false,
      idNumber: '8-123-456',
      socialSecurityNumber: '123456789',
      cellphoneNumber: '+507 7234-5678',
      privateInsurance: 'Seguros Universales',
    },
  },
  {
    email: 'maria.gonzalez@email.com',
    password: 'user123',
    role: 'user',
    profile: {
      firstName: 'María',
      lastName: 'González',
      birthDate: '1985-03-15',
      height: 165,
      weight: 68,
      sex: 'female',
      currentSmoking: false,
      idNumber: '8-123-456',
      socialSecurityNumber: '123456789',
      cellphoneNumber: '+507 6123-4567',
      privateInsurance: 'Seguros Universales',
    },
  },
  {
    email: 'carlos.rodriguez@email.com',
    password: 'user123',
    role: 'user',
    profile: {
      firstName: 'Carlos',
      lastName: 'Rodríguez',
      birthDate: '1978-11-22',
      height: 178,
      weight: 85,
      sex: 'male',
      currentSmoking: true,
      idNumber: '8-234-567',
      cellphoneNumber: '+507 6234-5678',
    },
  },
  {
    email: 'ana.morales@email.com',
    password: 'user123',
    role: 'user',
    profile: {
      firstName: 'Ana',
      lastName: 'Morales',
      birthDate: '1992-07-08',
      height: 160,
      weight: 55,
      sex: 'female',
      currentSmoking: false,
      idNumber: '8-345-678',
      socialSecurityNumber: '234567890',
      cellphoneNumber: '+507 6345-6789',
      privateInsurance: 'Mapfre Panamá',
    },
  },
  {
    email: 'luis.herrera@email.com',
    password: 'user123',
    role: 'user',
    profile: {
      firstName: 'Luis',
      lastName: 'Herrera',
      birthDate: '1965-12-03',
      height: 175,
      weight: 92,
      sex: 'male',
      currentSmoking: false,
      idNumber: '8-456-789',
      cellphoneNumber: '+507 6456-7890',
    },
  },
  {
    email: 'sofia.castillo@email.com',
    password: 'user123',
    role: 'user',
    profile: {
      firstName: 'Sofía',
      lastName: 'Castillo',
      birthDate: '1990-05-18',
      height: 168,
      weight: 72,
      sex: 'female',
      currentSmoking: false,
      idNumber: '8-567-890',
      socialSecurityNumber: '345678901',
      cellphoneNumber: '+507 6567-8901',
      privateInsurance: 'Assa Compañía de Seguros',
    },
  },
  {
    email: 'roberto.vega@email.com',
    password: 'user123',
    role: 'user',
    profile: {
      firstName: 'Roberto',
      lastName: 'Vega',
      birthDate: '1982-09-25',
      height: 180,
      weight: 78,
      sex: 'male',
      currentSmoking: true,
      idNumber: '8-678-901',
      cellphoneNumber: '+507 6678-9012',
    },
  },
  {
    email: 'patricia.jimenez@email.com',
    password: 'user123',
    role: 'user',
    profile: {
      firstName: 'Patricia',
      lastName: 'Jiménez',
      birthDate: '1975-01-12',
      height: 162,
      weight: 65,
      sex: 'female',
      currentSmoking: false,
      idNumber: '8-789-012',
      socialSecurityNumber: '456789012',
      cellphoneNumber: '+507 6789-0123',
      privateInsurance: 'Seguros Fedpa',
    },
  },
  {
    email: 'miguel.santos@email.com',
    password: 'user123',
    role: 'user',
    profile: {
      firstName: 'Miguel',
      lastName: 'Santos',
      birthDate: '1988-04-30',
      height: 172,
      weight: 80,
      sex: 'male',
      currentSmoking: false,
      idNumber: '8-890-123',
      cellphoneNumber: '+507 6890-1234',
    },
  },
]

// Helper function to generate random date within the past year
// Creates a more realistic distribution with some clustering around certain periods
function getRandomDateInPastYear(): Date {
  const now = new Date()
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())

  // Create some clustering around certain months for more realistic patterns
  const random = Math.random()
  let timeRange: number

  if (random < 0.3) {
    // 30% of submissions in the last 3 months (more recent activity)
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
    timeRange =
      threeMonthsAgo.getTime() + Math.random() * (now.getTime() - threeMonthsAgo.getTime())
  } else if (random < 0.6) {
    // 30% of submissions in months 3-6 ago
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
    timeRange =
      sixMonthsAgo.getTime() + Math.random() * (threeMonthsAgo.getTime() - sixMonthsAgo.getTime())
  } else {
    // 40% of submissions distributed across the remaining time
    timeRange = oneYearAgo.getTime() + Math.random() * (now.getTime() - oneYearAgo.getTime())
  }

  return new Date(timeRange)
}

// Helper function to generate realistic questionnaire submissions using actual scorers
function generateSubmissionForQuestionnaire(
  questionnaireName: string,
  userProfile: SeedUser['profile'],
  createdAt: Date,
): SeedSubmission {
  const questionnaire = Questionnaires[questionnaireName]
  if (!questionnaire) {
    throw new Error(`Questionnaire ${questionnaireName} not found`)
  }

  // Skip STarT questionnaire as requested
  if (questionnaireName === 'start') {
    throw new Error('STarT questionnaire is excluded from seeding')
  }

  const questions = questionnaire.data.questions
  const submittedAnswers: SeedSubmission['submittedAnswers'] = []

  // Determine target risk level for this submission (varied distribution)
  const targetRisk = getRandomTargetRisk()

  // Generate answers based on questionnaire type and target risk level
  const answers: Record<string, string> = {}

  questions.forEach((question, index) => {
    const options = question.options || []
    let selectedIndex: number

    switch (questionnaireName) {
      case 'gad7':
        selectedIndex = generateGAD7Answer(question, targetRisk, userProfile)
        break
      case 'findrisk':
        selectedIndex = generateFINDRISKAnswer(question, targetRisk, userProfile)
        break
      case 'ascvd':
        selectedIndex = generateASCVDAnswer(question, targetRisk, userProfile)
        break
      case 'frax':
        selectedIndex = generateFRAXAnswer(question, targetRisk, userProfile)
        break
      case 'hcri':
        selectedIndex = generateHCRIAnswer(question, targetRisk, userProfile)
        break
      case 'odi':
        selectedIndex = generateODIAnswer(question, targetRisk, userProfile)
        break
      default:
        selectedIndex = generateGenericAnswer(question, targetRisk)
        break
    }

    // Ensure selectedIndex is valid
    selectedIndex = Math.min(selectedIndex, options.length - 1)
    selectedIndex = Math.max(0, selectedIndex)

    const selectedOption = options[selectedIndex]
    const answerScore = (selectedOption as { score?: number }).score || 0

    // Store the answer value for the scorer
    answers[question.id] = selectedOption.value

    submittedAnswers.push({
      questionIndex: index,
      questionText: question.description || question.label,
      selectedAnswerIndex: selectedIndex,
      selectedAnswerText: selectedOption.label,
      score: answerScore,
    })
  })

  // Create a mock questionnaire submission for the scorer
  const mockSubmission = {
    questionnaire: questionnaireName,
    questionnaireName: questionnaireName,
    submittedAnswers: submittedAnswers,
    totalScore: 0, // Will be calculated by scorer
    riskLevel: 'minimal' as const,
    riskValue: 0,
    riskDescription: '',
    submittedBy: 'mock-user-id',
    createdAt: createdAt.toISOString(),
    updatedAt: createdAt.toISOString(),
    id: 'mock-id',
  }

  // Use the appropriate scorer to calculate the actual risk
  const formData = { answers }
  const { riskLevel, riskValue, totalScore } = calculateRiskUsingScorer(
    questionnaireName,
    mockSubmission,
    formData,
  )

  return {
    questionnaireName,
    submittedAnswers,
    totalScore,
    riskLevel,
    riskValue,
    riskDescription: `Evaluación de riesgo ${riskLevel} basada en las respuestas del cuestionario`,
    createdAt,
  }
}

// Helper function to calculate risk using the actual scorer classes
function calculateRiskUsingScorer(
  questionnaireName: string,
  mockSubmission: any,
  formData: { answers: Record<string, string> },
): { riskLevel: SeedSubmission['riskLevel']; riskValue: number; totalScore: number } {
  try {
    let scorer: any
    let riskResult: any

    switch (questionnaireName) {
      case 'gad7':
        scorer = new GAD7Scorer(mockSubmission, formData)
        riskResult = scorer.calculateRisk()
        break
      case 'findrisk':
        scorer = new FINDRISKScorer(mockSubmission, formData)
        riskResult = scorer.calculateRisk()
        break
      case 'ascvd':
        scorer = new ASCVDScorer(mockSubmission, formData)
        riskResult = scorer.calculateRisk()
        break
      case 'frax':
        scorer = new FRAXScorer(mockSubmission, formData)
        riskResult = scorer.calculateRisk()
        break
      case 'hcri':
        scorer = new HCRIScorer(mockSubmission, formData)
        riskResult = scorer.calculateRisk()
        break
      case 'odi':
        scorer = new ODIScorer(mockSubmission, formData)
        riskResult = scorer.calculateRisk()
        break
      default:
        // Fallback to simple calculation
        const totalScore = Object.values(formData.answers).reduce(
          (sum, _) => sum + Math.floor(Math.random() * 3),
          0,
        )
        return {
          riskLevel: totalScore > 10 ? 'high' : totalScore > 5 ? 'moderate' : 'low',
          riskValue: totalScore,
          totalScore,
        }
    }

    // Map the scorer's risk level to our enum
    const riskLevelMap: Record<string, SeedSubmission['riskLevel']> = {
      minimal: 'minimal',
      low: 'low',
      mild: 'low',
      moderate: 'moderate',
      high: 'high',
      severe: 'severe',
      unknown: 'minimal',
    }

    const mappedRiskLevel = riskLevelMap[riskResult.riskLevel.toLowerCase()] || 'minimal'

    return {
      riskLevel: mappedRiskLevel,
      riskValue: riskResult.riskValue || riskResult.score || 0,
      totalScore: riskResult.score || 0,
    }
  } catch (error) {
    console.warn(`Error using scorer for ${questionnaireName}:`, error)
    // Fallback to simple calculation
    const totalScore = Object.values(formData.answers).reduce(
      (sum, _) => sum + Math.floor(Math.random() * 3),
      0,
    )
    return {
      riskLevel: totalScore > 10 ? 'high' : totalScore > 5 ? 'moderate' : 'low',
      riskValue: totalScore,
      totalScore,
    }
  }
}

// Helper function to get random target risk with realistic distribution
function getRandomTargetRisk(): SeedSubmission['riskLevel'] {
  const random = Math.random()
  if (random < 0.3) return 'minimal'
  if (random < 0.5) return 'low'
  if (random < 0.7) return 'moderate'
  if (random < 0.9) return 'high'
  return 'severe'
}

// GAD-7 specific answer generation
function generateGAD7Answer(
  question: any,
  targetRisk: SeedSubmission['riskLevel'],
  userProfile?: SeedUser['profile'],
): number {
  const options = question.options || []

  // GAD-7 uses frequency scale: not(0), several(1), more_than_half(2), nearly_every(3)
  switch (targetRisk) {
    case 'minimal': // 0-4 points
      return Math.random() < 0.8 ? 0 : 1
    case 'low': // 5-9 points
      return Math.random() < 0.4 ? 0 : Math.random() < 0.7 ? 1 : 2
    case 'moderate': // 10-14 points
      return Math.random() < 0.2 ? 1 : Math.random() < 0.6 ? 2 : 3
    case 'high':
    case 'severe': // 15-21 points
      return Math.random() < 0.3 ? 2 : 3
    default:
      return Math.floor(Math.random() * options.length)
  }
}

// FINDRISK specific answer generation
function generateFINDRISKAnswer(
  question: any,
  targetRisk: SeedSubmission['riskLevel'],
  userProfile?: SeedUser['profile'],
): number {
  const options = question.options || []

  // Use actual user profile data when available
  if (userProfile) {
    const age = new Date().getFullYear() - new Date(userProfile.birthDate).getFullYear()
    const bmi = userProfile.weight / Math.pow(userProfile.height / 100, 2)

    if (question.id === 'age') {
      if (age < 45) return 0
      if (age < 55) return 1
      if (age < 65) return 2
      return 3
    }

    if (question.id === 'bmi') {
      if (bmi < 25) return 0
      if (bmi < 30) return 1
      return Math.min(2, options.length - 1)
    }

    if (question.id === 'current_smoking') {
      return userProfile.currentSmoking ? 1 : 0
    }
  }

  // Generate answers based on target risk
  switch (targetRisk) {
    case 'minimal': // <12 points
      return Math.random() < 0.7 ? 0 : 1
    case 'low': // 12-14 points
      return Math.random() < 0.4 ? 0 : Math.random() < 0.7 ? 1 : 2
    case 'moderate': // 15-19 points
      return Math.random() < 0.3 ? 1 : Math.random() < 0.6 ? 2 : Math.min(3, options.length - 1)
    case 'high':
    case 'severe': // 20+ points
      return Math.random() < 0.2 ? 2 : Math.min(3, options.length - 1)
    default:
      return Math.floor(Math.random() * options.length)
  }
}

// ASCVD specific answer generation
function generateASCVDAnswer(
  question: any,
  targetRisk: SeedSubmission['riskLevel'],
  userProfile?: SeedUser['profile'],
): number {
  const options = question.options || []

  // Use actual user profile data when available
  if (userProfile) {
    const age = new Date().getFullYear() - new Date(userProfile.birthDate).getFullYear()

    if (question.id === 'age') {
      if (age < 40) return 0
      if (age < 45) return 1
      if (age < 50) return 2
      if (age < 55) return 3
      if (age < 60) return 4
      if (age < 65) return 5
      return Math.min(6, options.length - 1)
    }

    if (question.id === 'sex') {
      return userProfile.sex === 'male' ? 0 : 1
    }

    if (question.id === 'current_smoking') {
      return userProfile.currentSmoking ? 1 : 0
    }
  }

  // ASCVD risk varies greatly with age and other factors
  switch (targetRisk) {
    case 'minimal':
    case 'low':
      return Math.random() < 0.8 ? 0 : 1
    case 'moderate':
      return Math.random() < 0.5 ? 0 : Math.random() < 0.8 ? 1 : 2
    case 'high':
    case 'severe':
      return Math.random() < 0.3 ? 1 : Math.floor(Math.random() * options.length)
    default:
      return Math.floor(Math.random() * options.length)
  }
}

// FRAX specific answer generation
function generateFRAXAnswer(
  question: any,
  targetRisk: SeedSubmission['riskLevel'],
  userProfile?: SeedUser['profile'],
): number {
  const options = question.options || []

  // Use actual user profile data when available
  if (userProfile) {
    const age = new Date().getFullYear() - new Date(userProfile.birthDate).getFullYear()
    const bmi = userProfile.weight / Math.pow(userProfile.height / 100, 2)

    if (question.id === 'age') {
      if (age < 40) return 0
      if (age < 45) return 1
      if (age < 50) return 2
      if (age < 55) return 3
      if (age < 60) return 4
      if (age < 65) return 5
      if (age < 70) return 6
      if (age < 75) return 7
      if (age < 80) return 8
      if (age < 85) return 9
      return Math.min(10, options.length - 1)
    }

    if (question.id === 'sex') {
      return userProfile.sex === 'male' ? 0 : 1
    }

    if (question.id === 'bmi') {
      if (bmi < 19) return 0
      if (bmi < 25) return 1
      if (bmi < 30) return 2
      if (bmi < 35) return 3
      return Math.min(4, options.length - 1)
    }

    if (question.id === 'current_smoking') {
      return userProfile.currentSmoking ? 1 : 0
    }
  }

  // FRAX risk factors - yes/no questions mostly
  if (
    question.id?.includes('fracture') ||
    question.id?.includes('alcohol') ||
    question.id?.includes('glucocorticoids') ||
    question.id?.includes('arthritis')
  ) {
    switch (targetRisk) {
      case 'minimal':
      case 'low':
        return 0 // No risk factors
      case 'moderate':
        return Math.random() < 0.7 ? 0 : 1
      case 'high':
      case 'severe':
        return Math.random() < 0.4 ? 0 : 1
      default:
        return Math.floor(Math.random() * options.length)
    }
  }

  return Math.floor(Math.random() * options.length)
}

// HCRI specific answer generation
function generateHCRIAnswer(
  question: any,
  targetRisk: SeedSubmission['riskLevel'],
  userProfile?: SeedUser['profile'],
): number {
  const options = question.options || []

  // Use actual user profile data when available
  if (userProfile) {
    const age = new Date().getFullYear() - new Date(userProfile.birthDate).getFullYear()

    if (question.id === 'age') {
      if (age < 40) return 0
      if (age < 50) return 1
      if (age < 60) return 2
      if (age < 70) return 3
      if (age < 80) return 4
      return Math.min(5, options.length - 1)
    }

    if (question.id === 'sex') {
      return userProfile.sex === 'male' ? 0 : 1
    }

    if (question.id === 'smoking_status') {
      if (userProfile.currentSmoking) {
        return Math.random() < 0.7 ? 3 : 4 // current_light or current_heavy
      } else {
        return Math.random() < 0.8 ? 0 : Math.random() < 0.6 ? 1 : 2 // never, former_light, former_recent
      }
    }
  }

  // HCRI has complex scoring - generate based on target risk
  switch (targetRisk) {
    case 'minimal': // Very low relative risk
      return Math.random() < 0.8 ? 0 : 1
    case 'low': // Below average risk
      return Math.random() < 0.6 ? 0 : Math.random() < 0.8 ? 1 : 2
    case 'moderate': // Average risk
      return Math.random() < 0.4 ? 1 : Math.random() < 0.7 ? 2 : 3
    case 'high': // Above average risk
      return Math.random() < 0.3 ? 2 : Math.random() < 0.6 ? 3 : Math.min(4, options.length - 1)
    case 'severe': // Very high relative risk
      return Math.random() < 0.2 ? 3 : Math.min(4, options.length - 1)
    default:
      return Math.floor(Math.random() * options.length)
  }
}

// ODI specific answer generation
function generateODIAnswer(
  question: any,
  targetRisk: SeedSubmission['riskLevel'],
  userProfile?: SeedUser['profile'],
): number {
  const options = question.options || []

  // ODI uses 0-5 scale for disability levels
  switch (targetRisk) {
    case 'minimal': // 0-20% disability
      return Math.random() < 0.7 ? 0 : 1
    case 'low': // 21-40% disability
      return Math.random() < 0.4 ? 1 : 2
    case 'moderate': // 41-60% disability
      return Math.random() < 0.3 ? 2 : 3
    case 'high': // 61-80% disability
      return Math.random() < 0.3 ? 3 : 4
    case 'severe': // 81-100% disability
      return Math.random() < 0.3 ? 4 : Math.min(5, options.length - 1)
    default:
      return Math.floor(Math.random() * options.length)
  }
}

// Generic answer generation for unknown questionnaires
function generateGenericAnswer(question: any, targetRisk: SeedSubmission['riskLevel']): number {
  const options = question.options || []

  switch (targetRisk) {
    case 'minimal':
      return 0
    case 'low':
      return Math.random() < 0.7 ? 0 : 1
    case 'moderate':
      return Math.floor(options.length * 0.5)
    case 'high':
      return Math.floor(options.length * 0.75)
    case 'severe':
      return options.length - 1
    default:
      return Math.floor(Math.random() * options.length)
  }
}

// Note: calculateFinalRisk function removed - now using actual scorer classes

async function seedDatabase() {
  console.log('🌱 Starting database seeding...')

  // Check required environment variables
  if (!process.env.PAYLOAD_SECRET) {
    console.error('❌ PAYLOAD_SECRET environment variable is required')
    console.log('💡 Add to your .env file: PAYLOAD_SECRET=your-secret-key-here')
    process.exit(1)
  }

  if (!process.env.DATABASE_URI) {
    console.error('❌ DATABASE_URI environment variable is required')
    console.log('💡 Add to your .env file: DATABASE_URI=mongodb://localhost:27017/health-risk')
    process.exit(1)
  }

  try {
    // Initialize Payload
    const payload = await getPayload({ config })
    console.log('✅ Payload initialized')

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🧹 Clearing existing data...')
    await payload.delete({
      collection: 'questionnaire-submissions',
      where: {},
    })
    await payload.delete({
      collection: 'users',
      where: {
        email: {
          not_equals: 'admin@healthrisk.com', // Keep at least one admin
        },
      },
    })

    // Create questionnaires if they don't exist
    console.log('📋 Creating questionnaires...')
    const createdQuestionnaires: Record<string, string> = {}

    for (const [name, questionnaire] of Object.entries(Questionnaires)) {
      try {
        const existing = await payload.find({
          collection: 'questionnaires',
          where: {
            name: {
              equals: name,
            },
          },
          limit: 1,
        })

        if (existing.docs.length === 0) {
          const created = await payload.create({
            collection: 'questionnaires',
            data: {
              name: questionnaire.data.patientFriendlyName || questionnaire.data.name,
              questions: questionnaire.data.questions.map((q, _index) => ({
                text: q.description || q.label,
                possibleAnswers: (q.options || []).map((option) => ({
                  text: option.label,
                  score: (option as { score?: number }).score || 0,
                })),
              })),
            },
          })
          createdQuestionnaires[name] = created.id
          console.log(`  ✅ Created questionnaire: ${name}`)
        } else {
          createdQuestionnaires[name] = existing.docs[0].id
          console.log(`  ℹ️  Questionnaire already exists: ${name}`)
        }
      } catch (error) {
        console.error(`  ❌ Error creating questionnaire ${name}:`, error)
      }
    }

    // Create users
    console.log('👥 Creating users...')
    const createdUsers: Array<{ id: string; email: string; profile?: SeedUser['profile'] }> = []

    for (const userData of sampleUsers) {
      try {
        const existing = await payload.find({
          collection: 'users',
          where: {
            email: {
              equals: userData.email,
            },
          },
          limit: 1,
        })

        if (existing.docs.length === 0) {
          const user = await payload.create({
            collection: 'users',
            data: userData,
          })
          createdUsers.push({
            id: user.id,
            email: userData.email,
            profile: userData.profile,
          })
          console.log(`  ✅ Created user: ${userData.email}`)
        } else {
          createdUsers.push({
            id: existing.docs[0].id,
            email: userData.email,
            profile: userData.profile,
          })
          console.log(`  ℹ️  User already exists: ${userData.email}`)
        }
      } catch (error) {
        console.error(`  ❌ Error creating user ${userData.email}:`, error)
      }
    }

    // Generate questionnaire submissions for regular users
    console.log('📊 Generating questionnaire submissions...')
    const regularUsers = createdUsers.filter(
      (user) => sampleUsers.find((u) => u.email === user.email)?.role === 'user',
    )

    let submissionCount = 0
    // Exclude STarT questionnaire as requested
    const questionnaireNames = Object.keys(Questionnaires).filter((name) => name !== 'start')
    console.log(`📋 Available questionnaires for seeding: ${questionnaireNames.join(', ')}`)

    for (const user of regularUsers) {
      const userProfile = sampleUsers.find((u) => u.email === user.email)?.profile

      // Generate 4-7 submissions per user across different questionnaires
      const numSubmissions = 4 + Math.floor(Math.random() * 4)

      // Ensure each user tries different questionnaires for better coverage
      const userQuestionnairePool = [...questionnaireNames]

      for (let i = 0; i < numSubmissions; i++) {
        // Select a questionnaire, preferring ones not yet used by this user
        let questionnaireName: string
        if (userQuestionnairePool.length > 0) {
          const randomIndex = Math.floor(Math.random() * userQuestionnairePool.length)
          questionnaireName = userQuestionnairePool.splice(randomIndex, 1)[0]
        } else {
          // If all questionnaires used, pick randomly for additional submissions
          questionnaireName =
            questionnaireNames[Math.floor(Math.random() * questionnaireNames.length)]
        }

        const questionnaireId = createdQuestionnaires[questionnaireName]

        if (!questionnaireId) {
          console.warn(`  ⚠️  Questionnaire ID not found for ${questionnaireName}`)
          continue
        }

        try {
          // Generate submission with historical date
          const createdAt = getRandomDateInPastYear()
          const submission = generateSubmissionForQuestionnaire(
            questionnaireName,
            userProfile,
            createdAt,
          )

          // Create submission with historical timestamp for analytics
          await payload.create({
            collection: 'questionnaire-submissions',
            data: {
              questionnaire: questionnaireId,
              questionnaireName: questionnaireName,
              submittedAnswers: submission.submittedAnswers,
              totalScore: submission.totalScore,
              riskLevel: submission.riskLevel,
              riskValue: submission.riskValue,
              riskDescription: submission.riskDescription,
              submittedBy: user.id,
              // Set historical timestamps for proper analytics dashboard functionality
              createdAt: createdAt.toISOString(),
              updatedAt: createdAt.toISOString(),
            },
          })

          submissionCount++

          if (submissionCount % 10 === 0) {
            console.log(
              `  📈 Created ${submissionCount} submissions... (${questionnaireName}: ${submission.riskLevel})`,
            )
          }
        } catch (error) {
          console.error(
            `  ❌ Error creating submission for ${user.email} (${questionnaireName}):`,
            error,
          )
        }
      }
    }

    // Generate summary statistics
    const submissionStats = await payload.find({
      collection: 'questionnaire-submissions',
      limit: 1000,
    })

    const questionnaireDistribution: Record<string, number> = {}
    const riskDistribution: Record<string, number> = {}

    submissionStats.docs.forEach((sub: any) => {
      questionnaireDistribution[sub.questionnaireName] =
        (questionnaireDistribution[sub.questionnaireName] || 0) + 1
      riskDistribution[sub.riskLevel] = (riskDistribution[sub.riskLevel] || 0) + 1
    })

    console.log(`✅ Database seeding completed successfully!`)
    console.log(`📊 Summary:`)
    console.log(`  - Users created: ${createdUsers.length}`)
    console.log(`  - Questionnaires: ${Object.keys(createdQuestionnaires).length}`)
    console.log(`  - Submissions created: ${submissionCount}`)

    // Show the actual date range used
    const now = new Date()
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
    console.log(
      `  - Time period: ${oneYearAgo.toLocaleDateString()} to ${now.toLocaleDateString()}`,
    )
    console.log(`  - Distribution: 30% recent (3 months), 30% mid-range (3-6 months), 40% older`)

    // Show questionnaire distribution
    console.log(`📋 Questionnaire Distribution:`)
    Object.entries(questionnaireDistribution).forEach(([name, count]) => {
      console.log(`  - ${name}: ${count} submissions`)
    })

    // Show risk level distribution
    console.log(`⚠️ Risk Level Distribution:`)
    Object.entries(riskDistribution).forEach(([level, count]) => {
      console.log(`  - ${level}: ${count} submissions`)
    })

    // Verify some recent submissions have correct timestamps
    const recentSubmissions = await payload.find({
      collection: 'questionnaire-submissions',
      limit: 5,
      sort: '-createdAt',
    })

    if (recentSubmissions.docs.length > 0) {
      console.log(`📅 Sample submission dates:`)
      recentSubmissions.docs.forEach((sub, index) => {
        const date = new Date(sub.createdAt)
        console.log(`  ${index + 1}. ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`)
      })
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

// Run the seeding script
const isMainModule = import.meta.url === `file://${process.argv[1]}`
if (isMainModule) {
  seedDatabase()
    .then(() => {
      console.log('🎉 Seeding completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error)
      process.exit(1)
    })
}

export { seedDatabase }
