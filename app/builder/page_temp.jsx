'use client'

import { useState, useEffect } from 'react'
import { useResumeStore } from '@/store/resumeStore'
import { useAutosave } from '@/hooks/useAutosave'
import StepPersonal from './components/StepPersonal'
import StepExperience from './components/StepExperience'
import StepEducation from './components/StepEducation'
import StepSkills from './components/StepSkills'
import StepExtras from './components/StepExtras'
import StepCoverLetter from './components/StepCoverLetter'
import ResumePreview from './components/ResumePreview'
import ProgressScore from './components/ProgressScore'
import PlanSelection from './components/PlanSelection'
import TemplateSelector from './components/TemplateSelector'
import { templates } from '@/lib/templates'
import { addWatermarkIfNeeded } from '@/lib/watermark'

export default function BuilderPage() {
  const { resume, resetResume, updateResume } = useResumeStore()
  const [activeStep, setActiveStep] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
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

  // Solo agregar carta si es plan profesional
  const steps = isProfessional 
    ? [...allSteps, { id: 5, name: 'Carta', component: StepCoverLetter, icon: '✉️' }]
    : allSteps

  const ActiveStepComponent = steps[activeStep]?.component

  const handleExport = async (format) => {
    setIsGenerating(true)
    setShowExportMenu(false)
    
    try {
      const template = templates[resume.template] || templates.ats
      
      // Excluir la carta de presentación si es plan gratuito
      const resumeToRender = isProfessional 
        ? resume 
        : { ...resume, coverLetter: '' }
      
      let html = template.render(resumeToRender)
      
      // Agregar marca de agua si no es plan profesional activo
      html = addWatermarkIfNeeded(html, resume.plan, resume.subscriptionStatus)
      
      let endpoint = '/api/generate'
      let filename = `CV-${resume.name || 'curriculum'}`
      let body = { html }
      
      // Formatos PRO exclusivos
      if (format === 'docx') {
        endpoint = '/api/export/docx'
        filename += '.rtf'
        body = { html, resume }
      } else if (format === 'txt') {
        endpoint = '/api/export/txt'
        filename += '.txt'
        body = { resume }
      } else if (format === 'json') {
        endpoint = '/api/export/json'
        filename += '.json'
        body = { resume }
      } else if (format === 'html') {
        endpoint = '/api/export/html'
        filename += '.html'
        body = { resume }
      } else if (format === 'png') {
        endpoint = '/api/export/image'
        filename += '.png'
        body = { resume, format: 'png' }
      } else if (format === 'jpg') {
        endpoint = '/api/export/image'
        filename += '.jpg'
        body = { resume, format: 'jpg' }
      } else {
        // PDF (disponible para todos)
        filename += '.pdf'
        body = { html }
      }
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.status === 403) {
        alert('Este formato de exportación requiere el Plan Profesional. Actualizá tu plan para acceder a esta función.')
        return
      }

      if (!response.ok) throw new Error(`Error al generar ${format.toUpperCase()}`)

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
      console.error('Error generando archivo:', error)
      alert('Hubo un error al generar el archivo. Por favor, intenta de nuevo.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGeneratePDF = () => handleExport('pdf')

  const exportFormats = [
    { id: 'pdf', name: 'PDF', icon: '📄', proPlan: false },
    { id: 'docx', name: 'DOCX (Word)', icon: '📝', proPlan: true },
    { id: 'txt', name: 'TXT (Texto)', icon: '📃', proPlan: true },
    { id: 'html', name: 'HTML', icon: '🌐', proPlan: true },
    { id: 'json', name: 'JSON', icon: '{ }', proPlan: true },
    { id: 'png', name: 'PNG (Imagen)', icon: '🖼️', proPlan: true },
    { id: 'jpg', name: 'JPG (Imagen)', icon: '📷', proPlan: true }
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header Premium - RESPONSIVE */}
      <header className="bg-white border-b-2 border-neutral-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1920px] mx-auto px-4 md:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex items-center justify-between gap-3 md:gap-4">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-glow">
                <svg className="w-4 h-4 md:w-6 md:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-base md:text-lg lg:text-xl font-display font-bold text-neutral-900">Generador de CV</h1>
                <p className="text-[10px] md:text-xs text-neutral-500 hidden sm:block">Creá tu currículum profesional</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 md:gap-3">
              <button
                onClick={() => {
                  if (confirm('¿Seguro que quieres reiniciar? Se perderán todos los datos guardados.')) {
                    resetResume()
                    clearAutosave()
                    setActiveStep(0)
                  }
                }}
                className="px-2 md:px-4 py-1.5 md:py-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg md:rounded-xl transition-all flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium"
                title="Reiniciar CV"
              >
                <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="hidden lg:inline">Reiniciar</span>
              </button>
              <button
                onClick={() => {
                  if (hasAutosave()) {
                    alert('✅ Tus datos están guardados automáticamente en este navegador.\n\nSi cambiás de dispositivo o navegador, tus datos no estarán disponibles.')
                  } else {
                    alert('ℹ️ El autoguardado se activará cuando empieces a completar tu CV.')
                  }
                }}
                className={`px-2 md:px-3 py-1.5 md:py-2 text-[10px] md:text-xs rounded-lg md:rounded-xl transition-all flex items-center gap-1 md:gap-2 font-medium ${
                  isMounted && hasAutosave() 
                    ? 'text-green-700 bg-green-50 hover:bg-green-100' 
                    : 'text-neutral-500 bg-neutral-100 hover:bg-neutral-200'
                }`}
                title="Ver información del autoguardado"
              >
                <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                <span className="hidden md:inline">{isMounted && hasAutosave() ? 'Autoguardado activo' : 'Sin guardar'}</span>
                <span className="md:hidden">{isMounted && hasAutosave() ? '✓' : '○'}</span>
              </button>
              <div className="relative flex gap-1 md:gap-2">
                <button
                  onClick={handleGeneratePDF}
                  disabled={isGenerating || !resume.name}
                  className="btn-primary text-xs md:text-sm px-3 md:px-6 py-2 md:py-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md flex items-center gap-1 md:gap-2"
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin h-3 w-3 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline">Generando...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span className="hidden sm:inline">Generar PDF</span>
                      <span className="sm:hidden">PDF</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  disabled={isGenerating || !resume.name}
                  className="px-2 md:px-3 py-2 md:py-3 bg-neutral-100 text-neutral-700 rounded-lg md:rounded-xl hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  title="Más opciones de exportación"
                >
                  <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showExportMenu && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-premium border-2 border-neutral-200 overflow-hidden z-50">
                    <div className="p-4 bg-gradient-to-r from-primary-50 to-purple-50 border-b border-neutral-200">
                      <h3 className="font-display font-bold text-neutral-900 flex items-center gap-2">
                        <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Exportar CV
                      </h3>
                      <p className="text-xs text-neutral-600 mt-1">Elegí el formato para descargar</p>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {exportFormats.map(format => {
                        const isLocked = format.proPlan && !isProfessional
                        return (
                          <button
                            key={format.id}
                            onClick={() => !isLocked && handleExport(format.id)}
                            disabled={isLocked}
                            className={`w-full px-4 py-3.5 text-left hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all border-b border-neutral-100 last:border-0 group ${
                              isLocked ? 'bg-neutral-50/50' : ''
                            }`}
                            title={isLocked ? 'Requiere Plan Profesional' : `Descargar como ${format.name}`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3 flex-1">
                                <div className={`mt-0.5 w-10 h-10 rounded-xl flex items-center justify-center ${
                                  isLocked 
                                    ? 'bg-neutral-100 text-neutral-400' 
                                    : 'bg-gradient-to-br from-primary-100 to-purple-100 text-primary-600 group-hover:from-primary-200 group-hover:to-purple-200'
                                } transition-all`}>
                                  <span className="text-xl">{format.icon}</span>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-neutral-900">{format.name}</span>
                                    {format.proPlan && (
                                      <span className="badge-warning text-[10px] px-2 py-0.5">PRO</span>
                                    )}
                                  </div>
                                  <p className="text-xs text-neutral-600 mt-0.5">{format.description}</p>
                                </div>
                              </div>
                              {!isLocked ? (
                                <svg className="w-5 h-5 text-neutral-400 group-hover:text-primary-600 transition-colors mt-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              ) : (
                                <svg className="w-5 h-5 text-neutral-300 mt-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                              )}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                    {!isProfessional && exportFormats.some(f => f.proPlan) && (
                      <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-t-2 border-amber-200">
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <p className="text-xs font-semibold text-amber-900">Desbloquea todos los formatos</p>
                            <p className="text-[11px] text-amber-700 mt-1">Actualiza a PRO para exportar en DOCX, imágenes y más.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

