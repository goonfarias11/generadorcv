'use client'

import { Eye, FileEdit, Download } from 'lucide-react'

export default function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: 'Completás tus datos',
      description: 'Seguí el asistente guiado paso a paso con tu información personal, experiencia y educación.',
      icon: FileEdit
    },
    {
      number: 2,
      title: 'Elegís tu plantilla',
      description: 'Seleccionás entre la plantilla gratuita o una de las 8 plantillas PRO disponibles.',
      icon: Eye
    },
    {
      number: 3,
      title: 'Descargás tu CV',
      description: 'Exportás tu currículum profesional en PDF, DOCX, PNG o ZIP con un solo click.',
      icon: Download
    }
  ]

  return (
    <section className="py-12 md:py-16 lg:py-20 px-4 md:px-6 bg-gradient-to-br from-neutral-50 to-primary-50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-neutral-900 mb-3 md:mb-4 px-2">
            Cómo funciona
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-neutral-600 max-w-2xl mx-auto px-2">
            Proceso rápido y guiado para resultados profesionales
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <div key={step.number} className="text-center group">
                <div className="relative mb-5 md:mb-6 inline-block">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-primary-600 to-purple-600 rounded-2xl flex items-center justify-center text-3xl md:text-4xl font-display font-bold text-white shadow-glow group-hover:scale-105 transition-transform">
                    {step.number}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-primary-100 to-purple-100 rounded-xl flex items-center justify-center shadow-md">
                    <Icon className="w-6 h-6 md:w-7 md:h-7 text-primary-600" strokeWidth={2} />
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-display font-bold text-neutral-900 mb-2 md:mb-3 px-2">
                  {step.title}
                </h3>
                <p className="text-sm md:text-base text-neutral-600 leading-relaxed max-w-xs mx-auto px-2">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
