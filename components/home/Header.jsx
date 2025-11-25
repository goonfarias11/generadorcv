'use client'

import { useRouter } from 'next/navigation'

export default function Header() {
  const router = useRouter()

  return (
    <header className="fixed w-full bg-white/90 backdrop-blur-xl border-b border-neutral-200 shadow-sm z-50">
      <nav className="container mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl flex items-center justify-center shadow-glow">
            <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-xl md:text-2xl font-display font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            GeneradorCV
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          <a href="#beneficios" className="text-neutral-700 hover:text-primary-600 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded">Beneficios</a>
          <a href="#plantillas" className="text-neutral-700 hover:text-primary-600 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded">Plantillas</a>
          <a href="/blog" className="text-neutral-700 hover:text-primary-600 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded">Blog</a>
          <a href="/soporte" className="text-neutral-700 hover:text-primary-600 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded">Soporte</a>
        </div>
        <button
          onClick={() => router.push('/builder')}
          className="btn-primary flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-2 md:py-2.5 text-sm md:text-base whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-label="Crear un nuevo currículum vitae"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Crear CV</span>
        </button>
      </nav>
    </header>
  )
}
