'use client'

import { useRouter } from 'next/navigation'

export default function CTASection() {
  const router = useRouter()

  return (
    <section className="py-16 md:py-20 px-4 md:px-6 bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
      <div className="container mx-auto max-w-4xl text-center relative z-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 md:mb-6 px-2">
          ¿Listo para crear tu CV perfecto?
        </h2>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-8 md:mb-10 text-primary-100 max-w-2xl mx-auto px-2">
          Únete a miles de profesionales que ya destacan con nuestras plantillas
        </p>
        <button
          onClick={() => router.push('/builder')}
          className="bg-white text-primary-600 px-6 md:px-8 lg:px-10 py-3 md:py-4 rounded-xl text-sm md:text-base lg:text-lg font-bold hover:bg-primary-50 transition-all shadow-glow inline-flex items-center gap-2 md:gap-3"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Comenzar Ahora - Es Gratis
        </button>
      </div>
    </section>
  )
}
