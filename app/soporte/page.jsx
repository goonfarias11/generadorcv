'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SoportePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  })
  const [openFaq, setOpenFaq] = useState(null)

  const faqs = [
    {
      question: '¿Cómo descargo mi CV?',
      answer: 'Podés descargar tu CV en cualquier momento desde el builder. Hacé clic en el botón "Exportar PDF" en la parte superior derecha de la pantalla. Tu CV se descargará automáticamente en formato PDF profesional, listo para enviar a tus postulaciones.'
    },
    {
      question: '¿Qué incluye el plan PRO?',
      answer: 'El plan PRO incluye acceso completo a todas las plantillas premium, descarga ilimitada de CVs en PDF, sin marca de agua, personalización avanzada de colores y tipografías, múltiples plantillas de cartas de presentación, y soporte prioritario por email. Además, podés guardar y editar múltiples CVs.'
    },
    {
      question: '¿Cómo activo el plan PRO?',
      answer: 'Para activar el plan PRO, ingresá al builder y seleccioná la opción "Plan PRO" en la sección de planes. Podés pagar con Mercado Pago o transferencia bancaria. Si elegís transferencia, subí el comprobante y te activamos el plan en menos de 24 horas. También podés usar un código de activación si tenés uno.'
    },
    {
      question: '¿Puedo editar mi CV después de crearlo?',
      answer: 'Sí, tu CV se guarda automáticamente en el navegador mientras trabajás. Podés volver en cualquier momento y continuar editando. Si tenés el plan PRO, podés crear y guardar múltiples versiones de tu CV para diferentes tipos de postulaciones.'
    },
    {
      question: '¿Cómo contacto al soporte?',
      answer: 'Podés contactarnos completando el formulario de esta página. Respondemos todas las consultas en menos de 24 horas. Los usuarios PRO tienen soporte prioritario. También podés escribirnos directamente a soporte@generadorcv.com'
    }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí se implementaría la lógica de envío
    console.log('Form submitted:', formData)
    alert('¡Gracias por contactarnos! Te responderemos pronto.')
    setFormData({ nombre: '', email: '', mensaje: '' })
  }

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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="text-neutral-700 font-semibold text-xs md:text-sm">Centro de Ayuda</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-neutral-900 mb-3 md:mb-6 px-2">
            ¿Necesitás ayuda?
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-neutral-600 max-w-2xl mx-auto px-2">
            Estamos acá para resolver tus dudas y ayudarte a crear el mejor CV
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 md:py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-5xl">
          {/* FAQ Section */}
          <div className="mb-8 md:mb-16">
            <div className="text-center mb-6 md:mb-12">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-neutral-900 mb-3 md:mb-4 px-2">
                Preguntas Frecuentes
              </h2>
              <p className="text-sm md:text-base text-neutral-600 max-w-2xl mx-auto">
                Las respuestas a las dudas más comunes sobre nuestro generador de CV
              </p>
            </div>
            <div className="space-y-3 md:space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl md:rounded-2xl shadow-md border-2 border-neutral-100 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full px-5 md:px-6 py-4 md:py-5 flex items-center justify-between gap-4 text-left hover:bg-neutral-50 transition-colors"
                  >
                    <span className="text-base md:text-lg font-semibold text-neutral-900">
                      {faq.question}
                    </span>
                    <svg
                      className={`w-5 h-5 md:w-6 md:h-6 text-primary-600 transition-transform flex-shrink-0 ${
                        openFaq === idx ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaq === idx && (
                    <div className="px-5 md:px-6 pb-4 md:pb-5 pt-0">
                      <p className="text-sm md:text-base text-neutral-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gradient-to-br from-white to-primary-50 rounded-xl md:rounded-3xl shadow-xl border-2 border-primary-200 p-4 md:p-8 lg:p-10">
            <div className="text-center mb-4 md:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-neutral-900 mb-2 md:mb-4 px-2">
                Contactanos
              </h2>
              <p className="text-sm md:text-base text-neutral-600 max-w-xl mx-auto">
                ¿No encontraste lo que buscabas? Escribinos y te responderemos en menos de 24 horas
              </p>
            </div>
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4 md:space-y-5">
              <div>
                <label htmlFor="nombre" className="block text-sm md:text-base font-semibold text-neutral-700 mb-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  id="nombre"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="input-premium w-full px-4 md:px-5 py-3 md:py-3.5 text-sm md:text-base"
                  placeholder="Juan Pérez"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm md:text-base font-semibold text-neutral-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-premium w-full px-4 md:px-5 py-3 md:py-3.5 text-sm md:text-base"
                  placeholder="tucorreo@ejemplo.com"
                />
              </div>
              <div>
                <label htmlFor="mensaje" className="block text-sm md:text-base font-semibold text-neutral-700 mb-2">
                  Mensaje
                </label>
                <textarea
                  id="mensaje"
                  required
                  rows={5}
                  value={formData.mensaje}
                  onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                  className="input-premium w-full px-4 md:px-5 py-3 md:py-3.5 text-sm md:text-base resize-none"
                  placeholder="Contanos tu consulta o problema..."
                />
              </div>
              <button
                type="submit"
                className="btn-primary w-full px-6 py-3 md:py-4 text-sm md:text-base font-semibold shadow-glow flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Enviar consulta
              </button>
            </form>
          </div>

          {/* Quick Links */}
          <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-white rounded-xl md:rounded-2xl shadow-md border-2 border-neutral-100 p-5 md:p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-primary-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <svg className="w-6 h-6 md:w-7 md:h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-base md:text-lg font-bold text-neutral-900 mb-2">Email</h3>
              <p className="text-xs md:text-sm text-neutral-600">soporte@generadorcv.com</p>
            </div>
            <div className="bg-white rounded-xl md:rounded-2xl shadow-md border-2 border-neutral-100 p-5 md:p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-primary-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <svg className="w-6 h-6 md:w-7 md:h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base md:text-lg font-bold text-neutral-900 mb-2">Horario</h3>
              <p className="text-xs md:text-sm text-neutral-600">Lunes a Viernes<br/>9:00 - 18:00</p>
            </div>
            <div className="bg-white rounded-xl md:rounded-2xl shadow-md border-2 border-neutral-100 p-5 md:p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-primary-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <svg className="w-6 h-6 md:w-7 md:h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-base md:text-lg font-bold text-neutral-900 mb-2">Respuesta</h3>
              <p className="text-xs md:text-sm text-neutral-600">Menos de 24 horas<br/>PRO: Prioritario</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
