'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles } from 'lucide-react'

export default function TemplatesGallery() {
  const router = useRouter()
  const [hoveredTemplate, setHoveredTemplate] = useState(null)

  const templates = [
    { name: 'Premium', color: 'from-purple-500 to-indigo-600', preview: '/previews/premium.svg', badge: 'PRO' },
    { name: 'ATS', color: 'from-blue-500 to-cyan-600', preview: '/previews/ats.svg', badge: 'Gratis' },
    { name: 'Executive', color: 'from-gray-700 to-gray-900', preview: '/previews/executive.svg', badge: 'PRO' },
    { name: 'Creative', color: 'from-pink-500 to-rose-600', preview: '/previews/creative.svg', badge: 'PRO' },
    { name: 'Minimalista', color: 'from-slate-400 to-slate-600', preview: '/previews/minimalista.svg', badge: 'PRO' },
    { name: 'Startup', color: 'from-orange-500 to-red-600', preview: '/previews/startup.svg', badge: 'PRO' },
    { name: 'Académica', color: 'from-green-500 to-emerald-600', preview: '/previews/academica.svg', badge: 'PRO' },
    { name: 'Dark', color: 'from-indigo-900 to-purple-900', preview: '/previews/dark.svg', badge: 'PRO' }
  ]

  return (
    <section id="plantillas" className="py-12 md:py-16 lg:py-20 px-4 md:px-6 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 mb-3 md:mb-4 px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-primary-100 to-purple-100 rounded-full">
            <Sparkles className="w-4 h-4 text-primary-600" />
            <span className="text-primary-700 font-semibold text-xs md:text-sm">8 Plantillas Profesionales</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-neutral-900 mb-3 md:mb-4 px-2">
            Galería de Plantillas
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-neutral-600 max-w-2xl mx-auto px-2">
            Diseños optimizados para ATS y reclutadores modernos
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
          {templates.map((template, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredTemplate(idx)}
              onMouseLeave={() => setHoveredTemplate(null)}
              className="card-premium cursor-pointer group transition-all duration-300 overflow-hidden hover:shadow-premium hover:-translate-y-2"
            >
              <div className="relative">
                <div className="aspect-[3/4] overflow-hidden rounded-t-xl bg-gradient-to-br from-neutral-100 to-neutral-200">
                  <img
                    src={template.preview}
                    alt={`Plantilla ${template.name}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `<div class="w-full h-full bg-gradient-to-br ${template.color} flex items-center justify-center text-white"><div class="text-center p-6"><svg class="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg><div class="font-bold text-xl md:text-2xl">${template.name}</div></div></div>`;
                    }}
                  />
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    template.badge === 'PRO' 
                      ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg' 
                      : 'bg-green-700 text-white shadow-md border border-green-800'
                  }`}>
                    {template.badge}
                  </span>
                </div>
              </div>
              
              <div className="p-4 md:p-5 bg-white">
                <h3 className="font-display font-bold text-neutral-900 text-lg md:text-xl mb-2">{template.name}</h3>
                <button
                  onClick={() => router.push('/builder')}
                  className={`w-full py-2.5 md:py-3 rounded-lg font-semibold text-sm md:text-base transition-all ${
                    hoveredTemplate === idx
                      ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-glow'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {hoveredTemplate === idx ? 'Crear este CV →' : 'Ver más'}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <button
            onClick={() => router.push('/builder')}
            className="btn-primary text-sm md:text-base lg:text-lg px-6 md:px-8 lg:px-10 py-3 md:py-4 shadow-glow inline-flex items-center gap-2 md:gap-3"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Crear CV con Cualquier Plantilla
          </button>
        </div>
      </div>
    </section>
  )
}
