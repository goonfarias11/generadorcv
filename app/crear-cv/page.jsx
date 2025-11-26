'use client'

import { useRouter } from 'next/navigation'
import { trackEvent } from '@/lib/analytics'
import Header from '@/components/home/Header'
import Footer from '@/components/home/Footer'

export default function CrearCVPage() {
  const router = useRouter()

  const benefits = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Rápido y fácil",
      description: "Crea tu CV profesional en menos de 5 minutos con nuestro generador intuitivo"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "100% Gratis",
      description: "Sin costos ocultos, sin tarjeta de crédito. Crea y descarga tu CV sin pagar"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      title: "Plantillas profesionales",
      description: "Elige entre 8+ diseños modernos optimizados para reclutadores"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: "Exporta a PDF",
      description: "Descarga tu CV en formato PDF profesional listo para enviar"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: "Compatible ATS",
      description: "Diseños optimizados para superar sistemas de filtrado automático"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: "Responsive",
      description: "Crea tu CV desde cualquier dispositivo: PC, tablet o móvil"
    }
  ]

  const steps = [
    {
      number: "1",
      title: "Elige una plantilla",
      description: "Selecciona el diseño que mejor se adapte a tu perfil profesional"
    },
    {
      number: "2",
      title: "Completa tu información",
      description: "Agrega tus datos personales, experiencia, educación y habilidades"
    },
    {
      number: "3",
      title: "Descarga tu CV",
      description: "Exporta tu currículum en PDF y comienza a aplicar a empleos"
    }
  ]

  const faqs = [
    {
      question: "¿Es realmente gratis crear un CV?",
      answer: "Sí, GeneradorCV es 100% gratuito. Puedes crear, editar y descargar tu CV sin costo alguno y sin necesidad de tarjeta de crédito."
    },
    {
      question: "¿Necesito registrarme para crear mi CV?",
      answer: "No es necesario registrarte para usar el generador básico. Sin embargo, crear una cuenta te permite guardar múltiples versiones de tu CV."
    },
    {
      question: "¿Qué formato tiene el CV descargado?",
      answer: "Tu CV se descarga en formato PDF de alta calidad, el formato más aceptado por reclutadores y empresas."
    },
    {
      question: "¿Puedo editar mi CV después de crearlo?",
      answer: "Sí, puedes editar tu CV en cualquier momento. Los cambios se aplican en tiempo real y puedes descargar nuevamente."
    },
    {
      question: "¿Las plantillas son compatibles con ATS?",
      answer: "Todas nuestras plantillas están diseñadas para ser legibles por sistemas ATS (Applicant Tracking Systems) usados por empresas."
    },
    {
      question: "¿Puedo crear CV en diferentes idiomas?",
      answer: "Sí, puedes crear tu CV en español u otros idiomas simplemente escribiendo el contenido en el idioma que prefieras."
    }
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-purple-700 text-white py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight">
            Crear CV Online Gratis en Minutos
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            GeneradorCV es la herramienta más rápida y fácil para crear un currículum vitae profesional. 
            Elige una plantilla, completa tus datos y descarga tu CV en PDF en minutos.
          </p>
          <button
            onClick={() => {
              trackEvent('cta_crear_cv', { position: 'hero' });
              router.push('/builder');
            }}
            className="btn-primary bg-white text-primary-600 hover:bg-neutral-100 px-8 py-4 text-lg font-semibold shadow-xl"
          >
            Crear CV Gratis Ahora
          </button>
          <p className="text-sm text-white/70 mt-4">
            ✓ Sin registro ✓ Sin tarjeta ✓ 100% Gratis
          </p>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
              ¿Por qué crear tu CV con GeneradorCV?
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Todo lo que necesitas para destacar en tu búsqueda laboral
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-neutral-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="bg-white py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
              Cómo crear tu CV en 3 pasos
            </h2>
            <p className="text-lg text-neutral-600">
              Es más fácil de lo que piensas
            </p>
          </div>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-6 items-start">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                  {step.number}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-lg text-neutral-600">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => router.push('/builder')}
              className="btn-primary px-8 py-4 text-lg"
            >
              Comenzar a Crear Mi CV
            </button>
          </div>
        </div>
      </section>

      {/* Preguntas frecuentes */}
      <section className="py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-lg text-neutral-600">
              Resolvemos tus dudas sobre crear CV online
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <details 
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden group"
              >
                <summary className="px-6 py-4 cursor-pointer font-semibold text-lg text-neutral-900 hover:bg-neutral-50 transition-colors list-none flex justify-between items-center">
                  {faq.question}
                  <svg className="w-5 h-5 text-neutral-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-4 text-neutral-600">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Enlaces internos SEO */}
      <section className="bg-neutral-100 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h3 className="text-2xl font-bold text-neutral-900 mb-6 text-center">
            Recursos adicionales
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="/blog" 
              className="px-6 py-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-neutral-700 hover:text-primary-600"
            >
              📝 Blog de consejos laborales
            </a>
            <a 
              href="/soporte" 
              className="px-6 py-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-neutral-700 hover:text-primary-600"
            >
              💬 Centro de soporte
            </a>
            <a 
              href="/builder" 
              className="px-6 py-3 bg-primary-600 text-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              🚀 Empezar ahora
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
