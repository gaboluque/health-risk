'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { useUserProfile } from '@/contexts/UserProfileContext'
import { UserProfileForm } from './UserProfileForm'
import type { UserProfile } from '@/lib/types/user-profile'
import { Edit3, LogOut } from 'lucide-react'

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
      window.confirm(
        'Are you sure you want to exit? You will need to enter your information again in the future.',
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
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowEditForm(true)}
            className="flex items-center space-x-1 hover:bg-slate-100"
            title="Edit Profile"
          >
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearProfile}
            className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50"
            title="Clear Profile"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
        title="Edit Your Profile"
        description="Update your personal information"
        maxWidth="4xl"
      >
        <UserProfileForm onSubmit={handleProfileUpdate} initialProfile={profile} />
      </Modal>
    </>
  )
}
