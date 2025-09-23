export interface UserProfile {
  firstName: string
  lastName: string
  email: string
  birthDate: string // YYYY-MM-DD format
  height: number // in cm
  weight: number // in kg
  sex: 'male' | 'female'
  currentSmoking?: boolean // Added for autofilling questionnaires
  idNumber: string // ID Number
  socialSecurityNumber?: string // Numero de Caja de Seguro Social (optional)
  cellphoneNumber: string // Cellphone number
  privateInsurance?: string // Seguro privado
  createdAt?: string
  // Calculated fields (computed from the above)
  age?: number
  bmi?: number
}

export interface UserProfileContextType {
  profile: UserProfile | null
  setProfile: (profile: UserProfile) => void
  clearProfile: () => void
  isProfileComplete: boolean
  loadingProfile: boolean
  isHydrated: boolean
  error?: string | null
}
