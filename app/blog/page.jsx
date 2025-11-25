'use client'

import { useRouter } from 'next/navigation'

export default function BlogPage() {
  const router = useRouter()

  const articles = [
    {
      id: 1,
      title: 'Cómo crear un CV perfecto paso a paso',
      summary: 'Descubrí las mejores prácticas para armar un currículum profesional que destaque entre cientos de postulaciones.',
      category: 'Guías',
      date: '15 Nov 2025',
      readTime: '5 min'
    },
    {
      id: 2,
      title: 'Los errores más comunes al armar un currículum',
      summary: 'Evitá estos errores frecuentes que pueden hacer que tu CV sea descartado antes de ser leído por completo.',
      category: 'Consejos',
      date: '12 Nov 2025',
      readTime: '4 min'
    },
    {
      id: 3,
      title: '¿Qué poner si no tengo experiencia laboral?',
      summary: 'Estrategias efectivas para destacar tus habilidades y proyectos cuando estás comenzando tu carrera profesional.',
      category: 'Principiantes',
      date: '10 Nov 2025',
      readTime: '6 min'
    },
    {
      id: 4,
      title: 'Cómo escribir una carta de presentación que destaque',
      summary: 'Aprendé a redactar una carta de presentación convincente que complemente tu CV y capture la atención de los reclutadores.',
      category: 'Cartas',
      date: '8 Nov 2025',
      readTime: '7 min'
    },
    {
      id: 5,
      title: 'Qué formato de CV es mejor para tu búsqueda laboral',
      summary: 'Conocé las diferencias entre formatos cronológicos, funcionales y combinados, y cuál elegir según tu situación.',
      category: 'Formatos',
      date: '5 Nov 2025',
      readTime: '5 min'
    }
  ]

  const categories = ['Todos', 'Guías', 'Consejos', 'Principiantes', 'Cartas', 'Formatos']

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="fixed w-full bg-white/90 backdrop-blur-xl border-b-2 border-neutral-200 shadow-sm z-50">
        <nav className="container mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-4">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl flex items-center justify-center shadow-glow">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-xl md:text-2xl font-display font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              GeneradorCV
            </span>
          </button>
          <button
            onClick={() => router.push('/builder')}
            className="btn-primary flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-2 md:py-3 text-sm md:text-base whitespace-nowrap"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Crear CV Gratis</span>
            <span className="sm:hidden">Crear CV</span>
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-8 md:pb-16 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 mb-3 md:mb-6 px-3 md:px-5 py-1.5 md:py-2.5 bg-white/80 backdrop-blur-sm rounded-full border-2 border-primary-200 shadow-md">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-neutral-700 font-semibold text-xs md:text-sm">Recursos y Consejos</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-neutral-900 mb-3 md:mb-6 px-2">
            Blog y Recursos
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-neutral-600 max-w-2xl mx-auto px-2">
            Consejos para crear un CV profesional y destacar en tus postulaciones
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 md:py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Categories Filter */}
          <div className="mb-6 md:mb-12 flex flex-wrap justify-center gap-2 md:gap-3">
            {categories.map((category, idx) => (
              <button
                key={idx}
                className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all ${
                  idx === 0
                    ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-md'
                    : 'bg-white text-neutral-600 border-2 border-neutral-200 hover:border-primary-400 hover:text-primary-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {articles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-xl md:rounded-2xl shadow-lg border-2 border-neutral-100 p-4 md:p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center gap-2 mb-3 md:mb-4">
                  <span className="badge-primary text-[10px] md:text-xs px-2 md:px-3 py-1">
                    {article.category}
                  </span>
                  <span className="text-[10px] md:text-xs text-neutral-500">{article.date}</span>
                </div>
                <h2 className="text-lg md:text-xl font-display font-bold text-neutral-900 mb-2 md:mb-3 group-hover:text-primary-600 transition-colors">
                  {article.title}
                </h2>
                <p className="text-sm md:text-base text-neutral-600 mb-4 md:mb-5 line-clamp-3">
                  {article.summary}
                </p>
                <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-neutral-200">
                  <span className="text-xs md:text-sm text-neutral-500 flex items-center gap-1 md:gap-2">
                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {article.readTime} lectura
                  </span>
                  <button className="text-xs md:text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 md:gap-2 group-hover:gap-2 md:group-hover:gap-3 transition-all">
                    Leer más
                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-8 md:mt-16 text-center bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl md:rounded-3xl p-6 md:p-12 border-2 border-primary-200">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-neutral-900 mb-3 md:mb-4 px-2">
              ¿Listo para crear tu CV profesional?
            </h3>
            <p className="text-sm md:text-base text-neutral-600 mb-6 md:mb-8 max-w-2xl mx-auto px-2">
              Aplicá estos consejos con nuestro generador de CV y destacá en tu próxima postulación
            </p>
            <button
              onClick={() => router.push('/builder')}
              className="btn-primary text-sm md:text-base lg:text-lg px-6 md:px-8 lg:px-10 py-3 md:py-4 shadow-glow flex items-center gap-2 md:gap-3 mx-auto"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Comenzar Ahora
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
