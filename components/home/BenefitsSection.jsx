'use client'

import { FileText, Zap, BarChart3, Download, Shield, Globe } from 'lucide-react'

export default function BenefitsSection() {
  const benefits = [
    {
      icon: FileText,
      title: 'Plantillas Profesionales',
      description: '8 diseños modernos optimizados para sistemas ATS'
    },
    {
      icon: Zap,
      title: 'Creación Rápida',
      description: 'Completa tu CV en menos de 10 minutos'
    },
    {
      icon: BarChart3,
      title: 'Score Inteligente',
      description: 'Análisis automático con sugerencias de mejora'
    },
    {
      icon: Download,
      title: 'Exportación Múltiple',
      description: 'PDF, PNG, DOCX o ZIP con un solo click'
    },
    {
      icon: Shield,
      title: 'Autoguardado Seguro',
      description: 'Tus datos protegidos en tu navegador'
    },
    {
      icon: Globe,
      title: 'Multi-idioma',
      description: 'Español, Inglés y Portugués disponibles'
    }
  ]

  return (
    <section id="beneficios" className="py-12 md:py-16 lg:py-20 px-4 md:px-6 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-neutral-900 mb-3 md:mb-4 px-2">
            Todo lo que necesitas para destacar
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-neutral-600 max-w-2xl mx-auto px-2">
            Herramientas profesionales al alcance de un click
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon
            return (
              <div
                key={idx}
                className="card-premium group hover:shadow-premium hover:-translate-y-1 transition-all duration-300 p-6 md:p-8"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 mb-4 md:mb-5 rounded-xl bg-gradient-to-br from-primary-100 to-purple-100 flex items-center justify-center group-hover:from-primary-200 group-hover:to-purple-200 transition-all">
                  <Icon className="w-7 h-7 md:w-8 md:h-8 text-primary-600" strokeWidth={2} />
                </div>
                <h3 className="text-lg md:text-xl font-display font-bold text-neutral-900 mb-2 md:mb-3">
                  {benefit.title}
                </h3>
                <p className="text-sm md:text-base text-neutral-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
