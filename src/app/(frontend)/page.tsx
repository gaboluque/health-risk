'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Heart, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-blue-100 rounded-full">
                <Heart className="h-12 w-12 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Evalúa tu
              <span className="text-blue-600 block">Riesgo de Salud</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Herramientas de evaluación de salud basadas en evidencia científica para ayudarte a
              entender tu estado de salud y tomar decisiones informadas sobre tu bienestar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/user">
                <Button size="lg" className="text-lg px-8 py-3">
                  Comenzar Evaluación
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Conocer Más
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Health Assessments Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Evaluaciones Disponibles
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Herramientas especializadas para diferentes aspectos de tu salud
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
