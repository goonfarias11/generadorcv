'use client'

import ProgressScore from './ProgressScore'
import TemplateSelector from './TemplateSelector'

export default function BuilderHero() {
  return (
    <div className="bg-gradient-to-br from-primary-50 via-purple-50 to-white border-b border-neutral-200">
      <div className="max-w-[1920px] mx-auto px-4 md:px-6 py-6 md:py-8">
        
        {/* Título y Subtítulo */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-neutral-900 mb-2 md:mb-3" style={{ fontSize: 'inherit', fontWeight: 'inherit' }}>
            Creá tu CV profesional
          </h1>
          <p className="text-sm md:text-base text-neutral-600 max-w-2xl mx-auto">
            Completá el formulario paso a paso y descargá tu currículum en minutos
          </p>
        </div>

        {/* Score Inteligente */}
        <div className="mb-6 md:mb-8">
          <ProgressScore compact />
        </div>

        {/* Selector de Plantillas */}
        <div>
          <TemplateSelector />
        </div>
      </div>
    </div>
  )
}
