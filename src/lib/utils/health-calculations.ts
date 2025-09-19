import type { UserProfile } from '@/lib/types/user-profile'

/**
 * Calculate age from birth date
 */
export function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate)
  const today = new Date()
  const age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  // Adjust if birthday hasn't occurred this year
  const actualAge =
    monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate()) ? age - 1 : age

  return actualAge
}

/**
 * Calculate BMI from height (cm) and weight (kg)
 */
export function calculateBMI(height: number, weight: number): number {
  const heightInMeters = height / 100
  const bmi = weight / (heightInMeters * heightInMeters)

  return Number(bmi.toFixed(1))
}

/**
 * Calculate and add computed fields to a profile
 */
export function enrichProfileWithCalculations(
  profile: UserProfile,
): UserProfile & { age?: number; bmi?: number } {
  const enriched: UserProfile & { age?: number; bmi?: number } = { ...profile }

  // Calculate age if birth date is provided
  if ('birthDate' in profile && typeof profile.birthDate === 'string') {
    enriched.age = calculateAge(profile.birthDate)
  }

  // Calculate BMI if height and weight are provided
  if (
    'height' in profile &&
    'weight' in profile &&
    typeof profile.height === 'number' &&
    typeof profile.weight === 'number'
  ) {
    enriched.bmi = calculateBMI(profile.height, profile.weight)
  }

  return enriched
}
