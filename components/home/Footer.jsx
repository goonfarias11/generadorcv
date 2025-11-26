'use client'

import { useRouter } from 'next/navigation'

export default function Footer() {
  const router = useRouter()

  return (
    <footer className="bg-neutral-900 text-neutral-300 py-8 md:py-10 px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
          {/* Branding */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl flex items-center justify-center shadow-glow">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-white font-display font-bold text-lg md:text-xl">GeneradorCV</h3>
            </div>
            <p className="text-xs md:text-sm text-neutral-400 leading-relaxed pr-4">
              Crea currículums profesionales en minutos
            </p>
          </div>
          
          {/* Inicio */}
          <div>
            <h4 className="text-white font-display font-bold mb-3 md:mb-4 text-sm md:text-base">Inicio</h4>
            <ul className="space-y-2 text-xs md:text-sm">
              <li>
                <a href="#beneficios" className="hover:text-primary-400 transition-colors flex items-center gap-1.5">
                  <span className="text-primary-600">▸</span> Beneficios
                </a>
              </li>
              <li>
                <a href="#plantillas" className="hover:text-primary-400 transition-colors flex items-center gap-1.5">
                  <span className="text-primary-600">▸</span> Plantillas
                </a>
              </li>
              <li>
                <button 
                  onClick={() => router.push('/builder')}
                  className="hover:text-primary-400 transition-colors flex items-center gap-1.5"
                >
                  <span className="text-primary-600">▸</span> Crear CV
                </button>
              </li>
            </ul>
          </div>
          
          {/* Recursos */}
          <div>
            <h4 className="text-white font-display font-bold mb-3 md:mb-4 text-sm md:text-base">Recursos</h4>
            <ul className="space-y-2 text-xs md:text-sm">
              <li>
                <a href="/blog" className="hover:text-primary-400 transition-colors flex items-center gap-1.5">
                  <span className="text-primary-600">▸</span> Blog
                </a>
              </li>
              <li>
                <a href="/soporte" className="hover:text-primary-400 transition-colors flex items-center gap-1.5">
                  <span className="text-primary-600">▸</span> Soporte
                </a>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="text-white font-display font-bold mb-3 md:mb-4 text-sm md:text-base">Legal</h4>
            <ul className="space-y-2 text-xs md:text-sm">
              <li>
                <a href="/privacidad" className="hover:text-primary-400 transition-colors flex items-center gap-1.5">
                  <span className="text-primary-600">▸</span> Privacidad
                </a>
              </li>
              <li>
                <a href="/terminos" className="hover:text-primary-400 transition-colors flex items-center gap-1.5">
                  <span className="text-primary-600">▸</span> Términos
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="border-t border-neutral-800 pt-6 md:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs md:text-sm">
          <p className="text-neutral-400 text-center sm:text-left">
            © 2025 <span className="text-white font-semibold">GeneradorCV</span>. Todos los derechos reservados.
          </p>
          <button
            onClick={() => router.push('/builder')}
            className="btn-primary px-5 md:px-6 py-2 md:py-2.5 text-xs md:text-sm whitespace-nowrap"
          >
            Crear CV Gratis
          </button>
        </div>
      </div>
    </footer>
  )
}
