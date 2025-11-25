'use client'

import { Star, Quote } from 'lucide-react'

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'María González',
      role: 'Desarrolladora Frontend',
      avatar: 'MG',
      rating: 5,
      text: 'Conseguí mi trabajo ideal gracias a GeneradorCV. La plantilla ATS me ayudó a pasar el filtro automático.'
    },
    {
      name: 'Carlos Rodríguez',
      role: 'Diseñador UX/UI',
      avatar: 'CR',
      rating: 5,
      text: 'Las plantillas son increíbles y super fáciles de usar. En 10 minutos tenía mi CV listo y se veía profesional.'
    },
    {
      name: 'Ana Martínez',
      role: 'Project Manager',
      avatar: 'AM',
      rating: 5,
      text: 'El análisis inteligente me dio tips excelentes. Mejoré mi CV y empecé a recibir más llamadas de reclutadores.'
    }
  ]

  return (
    <section className="py-12 md:py-16 lg:py-20 px-4 md:px-6 bg-gradient-to-br from-neutral-50 to-primary-50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-neutral-900 mb-3 md:mb-4 px-2">
            Lo que dicen nuestros usuarios
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-neutral-600 max-w-2xl mx-auto px-2">
            Miles de profesionales ya destacan con nuestras plantillas
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="card-premium p-6 md:p-8 hover:shadow-premium transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center gap-3 mb-4 md:mb-5">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center text-white font-bold text-base md:text-lg shadow-glow">
                  {testimonial.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-neutral-900 text-base md:text-lg truncate">
                    {testimonial.name}
                  </h3>
                  <p className="text-xs md:text-sm text-neutral-600 truncate">{testimonial.role}</p>
                </div>
              </div>
              
              <div className="flex gap-1 mb-3 md:mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              
              <div className="relative">
                <Quote className="absolute -top-1 -left-1 w-6 h-6 md:w-8 md:h-8 text-primary-200" />
                <p className="text-sm md:text-base text-neutral-700 leading-relaxed pl-6 md:pl-8">
                  {testimonial.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
