'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { useUserProfile } from '@/contexts/UserProfileContext'
import { UserProfileForm } from './UserProfileForm'
import type { UserProfile } from '@/lib/types/user-profile'
import { Edit3, LogOut, Menu, X, User } from 'lucide-react'

export function ProfileMenu() {
  const { profile, setProfile, clearProfile } = useUserProfile()
  const [showEditForm, setShowEditForm] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile)
    setShowEditForm(false)
  }

  const handleClearProfile = () => {
    if (
      window.confirm(
        '¿Estás seguro de que quieres salir? Tendrás que ingresar tu información nuevamente en el futuro.',
      )
    ) {
      clearProfile()
      setShowMobileMenu(false)
    }
  }

  const handleEditProfile = () => {
    setShowEditForm(true)
    setShowMobileMenu(false)
  }

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false)
      }
    }

    if (showMobileMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMobileMenu])

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowMobileMenu(false)
      }
    }

    if (showMobileMenu) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [showMobileMenu])

  if (!profile) {
    return null
  }

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden md:flex items-center space-x-3">
        <div className="text-right">
          <p className="text-sm text-slate-600">Bienvenido</p>
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
            title="Editar Perfil"
          >
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearProfile}
            className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50"
            title="Salir"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden relative" ref={menuRef}>
        {/* Hamburger Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="flex items-center space-x-2 hover:bg-slate-100 p-2"
          title="Menú"
        >
          {showMobileMenu ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>

        {/* Mobile Dropdown Menu */}
        {showMobileMenu && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-sm text-slate-600">Bienvenido</p>
              <p className="font-medium text-slate-900">
                {profile.firstName} {profile.lastName}
              </p>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <button
                onClick={handleEditProfile}
                className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
              >
                <Edit3 className="h-4 w-4 text-slate-600" />
                <span className="text-sm text-slate-900">Editar Perfil</span>
              </button>

              <button
                onClick={handleClearProfile}
                className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-red-50 transition-colors text-red-600 hover:text-red-700"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Salir</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
        title="Editar tu Perfil"
        description="Actualiza tu información personal"
        maxWidth="4xl"
      >
        <UserProfileForm onSubmit={handleProfileUpdate} initialProfile={profile} />
      </Modal>
    </>
  )
}
