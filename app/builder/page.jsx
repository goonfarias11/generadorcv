'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useResumeStore } from '@/store/resumeStore'
import { useAutosave } from '@/hooks/useAutosave'
import { useDebounce } from '@/hooks/useDebounce'
import { useScrollRestoration } from '@/hooks/useScrollRestoration'
import StepPersonal from './components/StepPersonal'
import StepExperience from './components/StepExperience'
import StepEducation from './components/StepEducation'
import StepSkills from './components/StepSkills'
import StepExtras from './components/StepExtras'
import StepCoverLetter from './components/StepCoverLetter'
import BuilderHeader from './components/BuilderHeader'
import AutosaveIndicator from './components/AutosaveIndicator'
import StepperNavigation from './components/StepperNavigation'
import { templates } from '@/lib/templates'
import { addWatermarkIfNeeded } from '@/lib/watermark'
import { generatePDFHTML } from '@/lib/pdf-optimizer'
import { Eye } from 'lucide-react'
import { captureException, addBreadcrumb } from '@/lib/sentry'

// Dynamic imports para componentes grandes (code splitting)
const ResumePreview = dynamic(() => import('./components/ResumePreview'), {
  loading: () => <div className="animate-pulse bg-neutral-100 rounded-xl h-[800px]"></div>,
  ssr: false
})
const PlanSelection = dynamic(() => import('./components/PlanSelection'))
const BuilderHero = dynamic(() => import('./components/BuilderHero'))
const PreviewModal = dynamic(() => import('./components/PreviewModal'), { ssr: false })

export default function BuilderPage() {
  const router = useRouter()
  const { resume, resetResume, updateResume } = useResumeStore()
  const [activeStep, setActiveStep] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const { clearAutosave, hasAutosave } = useAutosave(resume, updateResume)
  
  // Debounce resume for live preview
  const debouncedResume = useDebounce(resume, 200)
  
  // Scroll restoration
  const scrollContainerRef = useScrollRestoration(`builder-step-${activeStep}`)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Simulate autosave feedback
  useEffect(() => {
    if (isMounted && resume) {
      setIsSaving(true)
      const timer = setTimeout(() => {
        setIsSaving(false)
        setLastSaved(new Date())
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [resume, isMounted])

  const isProfessional = resume.subscriptionStatus === 'active'

  // Pasos: carta solo para plan PRO activo
  const allSteps = [
    { id: 0, name: 'Personal', component: StepPersonal, icon: '👤' },
    { id: 1, name: 'Experiencia', component: StepExperience, icon: '💼' },
    { id: 2, name: 'Educación', component: StepEducation, icon: '🎓' },
    { id: 3, name: 'Habilidades', component: StepSkills, icon: '🚀' },
    { id: 4, name: 'Extras', component: StepExtras, icon: '⭐' }
  ]

  const steps = isProfessional 
    ? [...allSteps, { id: 5, name: 'Carta', component: StepCoverLetter, icon: '✉️' }]
    : allSteps

  const ActiveStepComponent = steps[activeStep]?.component

  const handleExport = async (format = 'pdf') => {
    setIsGenerating(true)
    setShowExportMenu(false)
    
    try {
      // Breadcrumb para tracking de flujo
      addBreadcrumb({
        category: 'user_action',
        message: 'User initiated PDF export',
        level: 'info',
        data: { 
          format,
          template: resume.template,
          isProfessional,
          hasName: !!resume.name
        }
      });

      const template = templates[resume.template] || templates.ats
      const resumeToRender = isProfessional 
        ? resume 
        : { ...resume, coverLetter: '' }
      
      // Usar el optimizador de PDF para generar HTML mejorado
      let html = generatePDFHTML(resumeToRender, template)
      html = addWatermarkIfNeeded(html, resume.plan, resume.subscriptionStatus)
      
      let endpoint = '/api/generate'
      let filename = `CV-${resume.name || 'curriculum'}.pdf`
      let body = { html }
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.status === 403) {
        alert('Este formato requiere el Plan Profesional.')
        return
      }

      if (!response.ok) throw new Error('Error al generar PDF')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      // Breadcrumb de éxito
      addBreadcrumb({
        category: 'export',
        message: 'PDF exported successfully',
        level: 'info',
        data: { filename, format }
      });

    } catch (error) {
      console.error('Error:', error)
      
      // Capturar error en Sentry con contexto completo
      captureException(error, {
        step: 'export_pdf',
        format,
        template: resume.template,
        isProfessional,
        hasName: !!resume.name,
        endpoint: '/api/generate'
      });

      alert('Hubo un error. Por favor, intenta de nuevo.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleReset = () => {
    if (confirm('¿Seguro que quieres reiniciar? Se perderán todos los datos.')) {
      try {
        resetResume()
        clearAutosave()
        setActiveStep(0)
        
        addBreadcrumb({
          category: 'user_action',
          message: 'User reset builder data',
          level: 'info'
        })
      } catch (error) {
        captureException(error, {
          step: 'reset_builder',
          action: 'handleReset'
        })
      }
    }
  }

  const handleStepChange = (stepId) => {
    setActiveStep(stepId)
    
    addBreadcrumb({
      category: 'navigation',
      message: `Changed to step: ${steps[stepId]?.name}`,
      level: 'info',
      data: { stepId, stepName: steps[stepId]?.name }
    })
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header Fijo */}
      <BuilderHeader 
        onReset={handleReset}
        hasAutosave={hasAutosave}
        onExport={() => handleExport('pdf')}
        isGenerating={isGenerating}
      />

      {/* Hero con Score y Plantillas */}
      <BuilderHero />

      {/* Selector de Plan */}
      <div className="bg-white border-b border-neutral-200" id="upgrade">
        <div className="max-w-[1920px] mx-auto px-4 md:px-6 py-4 md:py-6">
          <PlanSelection />
        </div>
      </div>

      {/* Main Content - Grid 3 Columnas (Stepper + Form + Preview) */}
      <div className="max-w-[1920px] mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* COLUMNA IZQUIERDA - Stepper Navigation (Hidden en mobile) */}
          <aside className="hidden lg:block lg:col-span-3 xl:col-span-2" role="complementary" aria-label="Navegación de secciones">
            <div className="sticky top-24">
              <StepperNavigation
                steps={steps}
                activeStep={activeStep}
                onStepClick={handleStepChange}
              />
            </div>
          </aside>
          
          {/* COLUMNA CENTRO - Formulario */}
          <main className="lg:col-span-5 xl:col-span-5 space-y-6" aria-label="Formulario del CV">
            
            {/* Navegación de Pasos (Mobile) */}
            <div className="lg:hidden card-premium p-4">
              <h3 className="text-sm font-display font-bold text-neutral-700 mb-4 uppercase tracking-wider flex items-center gap-2">
                <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Secciones
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {steps.map((step) => (
                  <motion.button
                    key={step.id}
                    onClick={() => handleStepChange(step.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-3 py-2.5 rounded-lg transition-all flex items-center gap-2 justify-center text-sm font-semibold ${
                      activeStep === step.id
                        ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-glow'
                        : 'text-neutral-700 hover:bg-neutral-100 border border-neutral-200 hover:border-primary-300'
                    }`}
                    aria-label={`Ir a sección ${step.name}`}
                    aria-current={activeStep === step.id ? 'step' : undefined}
                  >
                    <span className="text-lg" aria-hidden="true">{step.icon}</span>
                    <span className="hidden sm:inline">{step.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Formulario Activo con Animación */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="card-premium p-4 md:p-6"
              >
                <div className="mb-6">
                  <h2 className="text-lg md:text-xl font-display font-bold text-neutral-900 flex items-center gap-3">
                    <span className="text-2xl" aria-hidden="true">{steps[activeStep].icon}</span>
                    <span>{steps[activeStep].name}</span>
                  </h2>
                  <p className="text-sm text-neutral-600 mt-2 ml-11">Completá esta sección con tu información</p>
                </div>

                <div ref={scrollContainerRef} className="max-h-[600px] overflow-y-auto pr-2">
                  <ActiveStepComponent />
                </div>

                {/* Mensaje Final */}
                {activeStep === steps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-green-900">¡Completaste todas las secciones!</p>
                        <p className="text-xs text-green-700 mt-1">Revisá tu CV y descargalo cuando quieras.</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Navegación */}
                <div className="mt-6 pt-6 border-t border-neutral-200 flex justify-between gap-3">
                  <motion.button
                    onClick={() => handleStepChange(Math.max(0, activeStep - 1))}
                    disabled={activeStep === 0}
                    whileHover={{ scale: activeStep > 0 ? 1.02 : 1 }}
                    whileTap={{ scale: activeStep > 0 ? 0.98 : 1 }}
                    className="px-4 py-2.5 text-sm text-neutral-700 hover:text-neutral-900 disabled:text-neutral-300 disabled:cursor-not-allowed transition-all flex items-center gap-2 rounded-lg hover:bg-neutral-100 font-semibold"
                    aria-label="Ir a la sección anterior"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Anterior
                  </motion.button>
                  
                  {activeStep === steps.length - 1 ? (
                    <motion.button
                      onClick={() => handleExport('pdf')}
                      disabled={isGenerating || !resume.name}
                      whileHover={{ scale: !isGenerating && resume.name ? 1.02 : 1 }}
                      whileTap={{ scale: !isGenerating && resume.name ? 0.98 : 1 }}
                      className="btn-primary text-sm px-6 py-2.5 disabled:opacity-50 flex items-center gap-2"
                      aria-label="Descargar CV en PDF"
                    >
                      {isGenerating ? (
                        <>
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generando PDF...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Descargar PDF
                        </>
                      )}
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={() => handleStepChange(Math.min(steps.length - 1, activeStep + 1))}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-primary text-sm px-6 py-2.5 flex items-center gap-2"
                      aria-label="Ir a la siguiente sección"
                    >
                      Siguiente
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Botón Ver Preview (Mobile) */}
            <button
              onClick={() => setShowPreviewModal(true)}
              className="lg:hidden w-full btn-secondary py-3 flex items-center justify-center gap-2"
              aria-label="Ver vista previa del CV"
            >
              <Eye className="w-5 h-5" aria-hidden="true" />
              Ver Vista Previa
            </button>
          </main>

          {/* COLUMNA DERECHA - Vista Previa Live (Desktop) */}
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-5" role="complementary" aria-label="Vista previa del CV">
            <div className="sticky top-24">
              <div className="bg-neutral-100 rounded-xl p-4 shadow-inner">
                <h3 className="text-sm font-bold text-neutral-700 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <Eye className="w-4 h-4 text-primary-600" aria-hidden="true" />
                  Vista Previa en Tiempo Real
                </h3>
                <div className="bg-white rounded-lg shadow-lg max-h-[calc(100vh-200px)] overflow-y-auto">
                  <ResumePreview resume={debouncedResume} />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Indicador de Autoguardado */}
      <AutosaveIndicator isSaving={isSaving} lastSaved={lastSaved} />

      {/* Modal de Preview (Mobile) */}
      <PreviewModal 
        isOpen={showPreviewModal} 
        onClose={() => setShowPreviewModal(false)} 
      />
    </div>
  )
}
