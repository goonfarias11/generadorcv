'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useResumeStore } from '@/store/resumeStore'
import { useAutosave } from '@/hooks/useAutosave'
import StepPersonal from './components/StepPersonal'
import StepExperience from './components/StepExperience'
import StepEducation from './components/StepEducation'
import StepSkills from './components/StepSkills'
import StepExtras from './components/StepExtras'
import StepCoverLetter from './components/StepCoverLetter'
import BuilderHeader from './components/BuilderHeader'
import { templates } from '@/lib/templates'
import { addWatermarkIfNeeded } from '@/lib/watermark'
import { Eye } from 'lucide-react'

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
  const { clearAutosave, hasAutosave } = useAutosave(resume, updateResume)

  useEffect(() => {
    setIsMounted(true)
  }, [])

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
      const template = templates[resume.template] || templates.ats
      const resumeToRender = isProfessional 
        ? resume 
        : { ...resume, coverLetter: '' }
      
      let html = template.render(resumeToRender)
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
    } catch (error) {
      console.error('Error:', error)
      alert('Hubo un error. Por favor, intenta de nuevo.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleReset = () => {
    if (confirm('¿Seguro que quieres reiniciar? Se perderán todos los datos.')) {
      resetResume()
      clearAutosave()
      setActiveStep(0)
    }
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

      {/* Main Content - Grid 2 Columnas */}
      <div className="max-w-[1920px] mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* COLUMNA IZQUIERDA - Formulario */}
          <div className="space-y-6">
            
            {/* Navegación de Pasos */}
            <div className="card-premium p-4 md:p-6">
              <h3 className="text-sm font-display font-bold text-neutral-700 mb-4 uppercase tracking-wider flex items-center gap-2">
                <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Secciones
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
                {steps.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(step.id)}
                    className={`px-3 py-2.5 rounded-lg transition-all flex items-center gap-2 justify-center text-sm font-semibold ${
                      activeStep === step.id
                        ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-glow'
                        : 'text-neutral-700 hover:bg-neutral-100 border border-neutral-200 hover:border-primary-300'
                    }`}
                  >
                    <span className="text-lg">{step.icon}</span>
                    <span className="hidden sm:inline">{step.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Formulario Activo */}
            <div className="card-premium p-4 md:p-6">
              <div className="mb-6">
                <h2 className="text-lg md:text-xl font-display font-bold text-neutral-900 flex items-center gap-3">
                  <span className="text-2xl">{steps[activeStep].icon}</span>
                  <span>{steps[activeStep].name}</span>
                </h2>
                <p className="text-sm text-neutral-600 mt-2 ml-11">Completá esta sección</p>
              </div>

              <ActiveStepComponent />

              {/* Mensaje Final */}
              {activeStep === steps.length - 1 && (
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-green-900">¡Completaste todas las secciones!</p>
                      <p className="text-xs text-green-700 mt-1">Revisá tu CV y descargalo cuando quieras.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navegación */}
              <div className="mt-6 pt-6 border-t border-neutral-200 flex justify-between gap-3">
                <button
                  onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                  disabled={activeStep === 0}
                  className="px-4 py-2.5 text-sm text-neutral-700 hover:text-neutral-900 disabled:text-neutral-300 disabled:cursor-not-allowed transition-all flex items-center gap-2 rounded-lg hover:bg-neutral-100 font-semibold"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Anterior
                </button>
                
                {activeStep === steps.length - 1 ? (
                  <button
                    onClick={() => handleExport('pdf')}
                    disabled={isGenerating || !resume.name}
                    className="btn-primary text-sm px-6 py-2.5 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generando...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Mi CV está listo
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
                    className="btn-primary text-sm px-6 py-2.5 flex items-center gap-2"
                  >
                    Siguiente
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Botón Ver Preview (Mobile) */}
            <button
              onClick={() => setShowPreviewModal(true)}
              className="lg:hidden w-full btn-secondary py-3 flex items-center justify-center gap-2"
            >
              <Eye className="w-5 h-5" />
              Ver Vista Previa
            </button>
          </div>

          {/* COLUMNA DERECHA - Vista Previa (Desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <div className="bg-neutral-100 rounded-xl p-4 shadow-inner">
                <h3 className="text-sm font-bold text-neutral-700 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <Eye className="w-4 h-4 text-primary-600" />
                  Vista Previa
                </h3>
                <div className="bg-white rounded-lg shadow-lg max-h-[calc(100vh-200px)] overflow-y-auto">
                  <ResumePreview />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Preview (Mobile) */}
      <PreviewModal 
        isOpen={showPreviewModal} 
        onClose={() => setShowPreviewModal(false)} 
      />
    </div>
  )
}
