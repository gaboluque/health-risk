'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Mail, Calendar, Scale, Users, Ruler, Cigarette } from 'lucide-react'
import { enrichProfileWithCalculations } from '@/lib/utils/health-calculations'
import type { UserProfile } from '@/lib/types/user-profile'

interface UserProfileFormProps {
  onSubmit: (profile: UserProfile) => void
  initialProfile?: Partial<UserProfile>
}

export function UserProfileForm({ onSubmit, initialProfile }: UserProfileFormProps) {
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    firstName: initialProfile?.firstName || '',
    lastName: initialProfile?.lastName || '',
    email: initialProfile?.email || '',
    birthDate: initialProfile?.birthDate || '',
    height: initialProfile?.height,
    weight: initialProfile?.weight,
    sex: initialProfile?.sex || '',
    currentSmoking: initialProfile?.currentSmoking,
  })
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (name: keyof UserProfile, value: string | number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate required fields
    const missingFields = []
    if (!formData.firstName?.trim()) missingFields.push('First Name')
    if (!formData.lastName?.trim()) missingFields.push('Last Name')
    if (!formData.email?.trim()) missingFields.push('Email')
    if (!formData.birthDate?.trim()) missingFields.push('Date of Birth')
    if (!formData.height || formData.height <= 0) missingFields.push('Height')
    if (!formData.weight || formData.weight <= 0) missingFields.push('Weight')
    if (!formData.sex?.trim()) missingFields.push('Biological Sex')

    if (missingFields.length > 0) {
      setError(`Please fill in the following required fields: ${missingFields.join(', ')}`)
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email!)) {
      setError('Please enter a valid email address')
      return
    }

    // Validate height range
    if (formData.height! < 100 || formData.height! > 250) {
      setError('Please enter a valid height between 100 and 250 cm')
      return
    }

    // Validate weight range
    if (formData.weight! < 30 || formData.weight! > 300) {
      setError('Please enter a valid weight between 30 and 300 kg')
      return
    }

    // Calculate age and BMI from the input data
    const enrichedProfile = enrichProfileWithCalculations({
      firstName: formData.firstName!,
      lastName: formData.lastName!,
      email: formData.email!,
      birthDate: formData.birthDate,
      height: formData.height,
      weight: formData.weight,
      sex: formData.sex,
      currentSmoking: formData.currentSmoking,
      createdAt: new Date().toISOString(),
    })

    onSubmit(enrichedProfile as UserProfile)
  }

  const sexOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ]

  const smokingOptions = [
    { value: 'no', label: "No, I don't smoke" },
    { value: 'yes', label: 'Yes, I currently smoke' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Personal Information</h3>
              <p className="text-sm text-slate-600">
                This information is required for all assessments
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="firstName" className="text-sm font-medium text-slate-700">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Enter your first name"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-sm font-medium text-slate-700">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Enter your last name"
                className="mt-1"
                required
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email address"
                className="mt-1"
                required
              />
            </div>
          </div>
        </div>

        {/* Health Information */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Health Information</h3>
              <p className="text-sm text-slate-600">
                This information is required to provide accurate health assessments
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Birth Date */}
            <div>
              <Label htmlFor="birthDate" className="text-sm font-medium text-slate-700 mb-3 block">
                Date of Birth <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate || ''}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  className="flex-1"
                  max={new Date().toISOString().split('T')[0]} // Prevent future dates
                  required
                />
              </div>
            </div>

            {/* Height and Weight */}
            <div className="grid grid-cols-1 gap-6">
              <div>
                <Label htmlFor="height" className="text-sm font-medium text-slate-700 mb-3 block">
                  Height (cm) <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center space-x-2">
                  <Ruler className="h-4 w-4 text-slate-400" />
                  <Input
                    id="height"
                    type="number"
                    min="100"
                    max="250"
                    value={formData.height || ''}
                    onChange={(e) => {
                      const value = e.target.value
                      handleInputChange('height', value ? Number(value) : '')
                    }}
                    placeholder="170"
                    className="flex-1"
                    required
                  />
                  <span className="text-sm text-slate-500">cm</span>
                </div>
              </div>

              <div>
                <Label htmlFor="weight" className="text-sm font-medium text-slate-700 mb-3 block">
                  Weight (kg) <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center space-x-2">
                  <Scale className="h-4 w-4 text-slate-400" />
                  <Input
                    id="weight"
                    type="number"
                    min="30"
                    max="300"
                    step="0.1"
                    value={formData.weight || ''}
                    onChange={(e) => {
                      const value = e.target.value
                      handleInputChange('weight', value ? Number(value) : '')
                    }}
                    placeholder="70"
                    className="flex-1"
                    required
                  />
                  <span className="text-sm text-slate-500">kg</span>
                </div>
              </div>
            </div>

            {/* Sex */}
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-3 block">
                Biological Sex <span className="text-red-500">*</span>
              </Label>
              <ToggleGroup
                type="single"
                value={formData.sex || ''}
                onValueChange={(value) => {
                  if (value) {
                    handleInputChange('sex', value)
                  }
                }}
                className="flex"
                variant="outline"
              >
                {sexOptions.map((option) => (
                  <ToggleGroupItem
                    key={option.value}
                    value={option.value}
                    className="flex-1 justify-center text-center p-3 h-auto transition-all duration-200 data-[state=on]:bg-blue-50 data-[state=on]:border-blue-500 data-[state=on]:text-blue-900"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">{option.label}</span>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            {/* Current Smoking */}
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-3 block">
                Current Smoking Status
              </Label>
              <p className="text-xs text-slate-500 mb-3">
                This helps us provide more accurate health risk assessments
              </p>
              <ToggleGroup
                type="single"
                value={
                  formData.currentSmoking === true
                    ? 'yes'
                    : formData.currentSmoking === false
                      ? 'no'
                      : ''
                }
                onValueChange={(value) => {
                  if (value) {
                    handleInputChange('currentSmoking', value === 'yes')
                  }
                }}
                className="flex"
                variant="outline"
              >
                {smokingOptions.map((option) => (
                  <ToggleGroupItem
                    key={option.value}
                    value={option.value}
                    className="flex-1 justify-center text-center p-3 h-auto transition-all duration-200 data-[state=on]:bg-blue-50 data-[state=on]:border-blue-500 data-[state=on]:text-blue-900"
                  >
                    <Cigarette className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">{option.label}</span>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg mr-3">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-red-800">Please check the following:</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h4 className="text-sm font-semibold text-slate-900">Ready to continue?</h4>
              <p className="text-xs text-slate-600">
                All fields are required for accurate health assessments
              </p>
            </div>
            <Button
              type="submit"
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Continue to Assessments
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
