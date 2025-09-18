export interface UserProfile {
  firstName: string
  lastName: string
  email: string
  birthDate: string // YYYY-MM-DD format
  height: number // in cm
  weight: number // in kg
  sex: string
  createdAt: string
  // Calculated fields (computed from the above)
  age?: number
  bmi?: number
}

export interface UserProfileContextType {
  profile: UserProfile | null
  setProfile: (profile: UserProfile) => void
  clearProfile: () => void
  isProfileComplete: boolean
}
