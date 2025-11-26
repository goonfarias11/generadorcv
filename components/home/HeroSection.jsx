'use client'

import { useRouter } from 'next/navigation'
import { trackEvent } from '@/lib/analytics'

export default function HeroSection() {
  const router = useRouter()

  return (
    <section className="pt-20 md:pt-24 pb-12 md:pb-16 px-4 md:px-6 bg-gradient-to-br from-primary-50 via-purple-50 to-white relative overflow-hidden">
      {/* Decorative elements - sutiles */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute top-20 right-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      
      <div className="container mx-auto text-center max-w-4xl relative z-10">
        <div className="inline-flex items-center gap-2 mb-4 md:mb-5 px-3 md:px-4 py-1.5 md:py-2 bg-white/80 backdrop-blur-sm rounded-full border border-primary-200 shadow-sm">
          <span className="badge-primary text-[10px] md:text-xs px-2 py-0.5">GRATIS</span>
          <span className="text-neutral-700 font-semibold text-xs md:text-sm">Sin tarjeta • Sin instalación</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-neutral-900 mb-4 md:mb-5 leading-tight px-2" style={{ fontSize: 'inherit', fontWeight: 'inherit', margin: 0, padding: 0 }}>
          Crea tu CV profesional
          <span className="block bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mt-1 md:mt-2">
            en minutos
          </span>
        </h1>
        
        <p className="text-sm sm:text-base md:text-lg text-neutral-600 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
          Plantillas modernas optimizadas para ATS, análisis inteligente y exportación en múltiples formatos.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4 mb-6 md:mb-8">
          <button
            onClick={() => {
              trackEvent('cta_crear_cv', { position: 'landing_hero' });
              router.push('/builder');
            }}
            className="btn-primary text-sm md:text-base lg:text-lg px-6 md:px-8 py-3 md:py-3.5 shadow-glow flex items-center gap-2 justify-center"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Crear CV Gratis
          </button>
          <button
            onClick={() => document.getElementById('plantillas')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-secondary text-sm md:text-base lg:text-lg px-6 md:px-8 py-3 md:py-3.5 flex items-center gap-2 justify-center"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Ver Plantillas
          </button>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs md:text-sm text-neutral-600">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>100% Gratis</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>8 Plantillas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Exportación PDF</span>
          </div>
        </div>
      </div>
    </section>
  )
}
