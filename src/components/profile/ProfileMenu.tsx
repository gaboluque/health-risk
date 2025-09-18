'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useUserProfile } from '@/contexts/UserProfileContext'
import { UserProfileForm } from './index'
import type { UserProfile } from '@/lib/types/user-profile'
import { Edit3, LogOut, X } from 'lucide-react'

export function ProfileMenu() {
  const { profile, setProfile, clearProfile } = useUserProfile()
  const [showEditForm, setShowEditForm] = useState(false)

  if (!profile) {
    return null
  }

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile)
    setShowEditForm(false)
  }

  const handleClearProfile = () => {
    if (
      confirm(
        'Are you sure you want to clear your profile? You will need to enter your information again.',
      )
    ) {
      clearProfile()
    }
  }

  return (
    <>
      <div className="flex items-center space-x-3">
        <div className="text-right">
          <p className="text-sm text-slate-600">Welcome back</p>
          <p className="font-medium text-slate-900">
            {profile.firstName} {profile.lastName}
          </p>
        </div>
        <div className="flex space-x-2 flex-col">
          <Button
            style={{ width: '30px' }}
            variant="ghost"
            size="sm"
            onClick={() => setShowEditForm(true)}
            className="flex items-center space-x-1"
          >
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button
            style={{ width: '30px' }}
            variant="ghost"
            size="sm"
            onClick={handleClearProfile}
            className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:border-red-300"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Edit Your Profile</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEditForm(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="p-6">
              <UserProfileForm onSubmit={handleProfileUpdate} initialProfile={profile} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
