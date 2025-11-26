'use client'

import { useRouter } from 'next/navigation'
import { useResumeStore } from '@/store/resumeStore'
import { trackEvent } from '@/lib/analytics'

export default function BuilderHeader({ onReset, hasAutosave, onExport, isGenerating }) {
  const router = useRouter()
  const { resume } = useResumeStore()
  const isProfessional = resume.subscriptionStatus === 'active'

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1920px] mx-auto px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between gap-3">
          
          {/* Logo */}
          <button 
            onClick={() => router.push('/')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl flex items-center justify-center shadow-glow">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-lg md:text-xl font-display font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              GeneradorCV
            </span>
          </button>

          {/* Center - Plan Badge */}
          <div className="hidden md:flex items-center gap-2">
            {isProfessional ? (
              <div className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center gap-2">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-white font-bold text-sm">Plan PRO</span>
              </div>
            ) : (
              <div className="px-4 py-2 bg-neutral-100 rounded-full flex items-center gap-2">
                <span className="text-neutral-700 font-semibold text-sm">Plan FREE</span>
              </div>
            )}
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-2">
            
            {/* Autoguardado */}
            <button
              onClick={() => {
                if (hasAutosave()) {
                  alert('✅ Autoguardado activo')
                } else {
                  alert('ℹ️ Sin cambios guardados')
                }
              }}
              className={`hidden md:flex px-3 py-2 text-xs rounded-lg transition-all items-center gap-2 font-medium ${
                hasAutosave() 
                  ? 'text-green-700 bg-green-50 hover:bg-green-100' 
                  : 'text-neutral-500 bg-neutral-100 hover:bg-neutral-200'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              {hasAutosave() ? 'Guardado' : 'Sin guardar'}
            </button>

            {/* Reiniciar */}
            <button
              onClick={onReset}
              className="px-3 md:px-4 py-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all flex items-center gap-2 text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden lg:inline">Reiniciar</span>
            </button>

            {/* Export PDF */}
            {!isProfessional && (
              <button
                onClick={() => router.push('/builder#upgrade')}
                className="hidden md:flex btn-warning text-sm px-4 py-2 items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Mejorar a PRO
              </button>
            )}

            <button
              onClick={() => {
                trackEvent('descargar_pdf', { format: 'A4', template: resume.template || 'default' });
                onExport();
              }}
              disabled={isGenerating || !resume.name}
              className="btn-primary text-sm px-4 md:px-6 py-2 md:py-2.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 relative overflow-hidden transition-all"
              aria-label={isGenerating ? "Generando PDF" : "Exportar CV a PDF"}
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="hidden sm:inline font-semibold">Generando PDF...</span>
                  <span className="sm:hidden font-semibold">...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span className="hidden sm:inline font-semibold">Exportar PDF</span>
                  <span className="sm:hidden font-semibold">PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
