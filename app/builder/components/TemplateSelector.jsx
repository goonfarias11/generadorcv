'use client'

import { useResumeStore } from '@/store/resumeStore'
import { templates } from '@/lib/templates'
import { useSearchParams } from 'next/navigation'

export default function TemplateSelector() {
  const { resume, updateResume } = useResumeStore()
  const currentTemplate = templates[resume.template] || templates.ats
  const searchParams = useSearchParams()
  const isDemoMode = searchParams.get('demo') === 'true'
  const isProfessional = resume.subscriptionStatus === 'active' || isDemoMode

  return (
    <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border-2 border-neutral-200 p-4 md:p-6 w-full">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 md:w-6 md:h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
        <label className="text-base md:text-lg font-display font-bold text-neutral-800 mb-0">
          Diseño de plantilla
        </label>
      </div>
      
      {!isProfessional && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-lg md:rounded-xl p-3 mb-4">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div className="flex-1">
              <p className="text-xs md:text-sm font-bold text-amber-900">
                Solo ATS disponible
              </p>
              <p className="text-[11px] md:text-xs text-amber-800 mt-1">
                Actualizá a PRO para acceder a más plantillas premium
              </p>
            </div>
          </div>
        </div>
      )}

      {isDemoMode && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg md:rounded-xl p-3 mb-4">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-xs md:text-sm font-bold text-blue-900">
                Modo demostración activado
              </p>
              <p className="text-[11px] md:text-xs text-blue-800 mt-1">
                Podés ver todas las plantillas premium. Las descargas incluirán marca de agua.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex overflow-x-auto md:grid md:grid-cols-4 gap-2 md:gap-3 pb-2 md:pb-0 scrollbar-hide">
        {Object.entries(templates).map(([key, template]) => {
          const isDisabled = !isProfessional && key !== 'ats'
          const isActive = resume.template === key
          return (
            <button
              key={key}
              onClick={() => !isDisabled && updateResume({ template: key })}
              disabled={isDisabled}
              className={`flex-shrink-0 w-32 md:w-auto relative px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isActive
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-glow ring-2 ring-primary-300 focus:ring-primary-500'
                  : isDisabled
                  ? 'bg-neutral-100 text-neutral-500 border-2 border-neutral-200 cursor-not-allowed'
                  : 'bg-white text-neutral-700 border-2 border-neutral-300 hover:border-primary-400 hover:shadow-md focus:ring-primary-500'
              }`}
              aria-label={`Plantilla ${template.name}`}
              aria-pressed={isActive}
            >
              <span className="truncate">{template.name}</span>
              {isDisabled && (
                <svg className="w-3 h-3 md:w-3.5 md:h-3.5 inline-block ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
              {isActive && !isDisabled && (
                <span className="ml-0.5 md:ml-1">✓</span>
              )}
            </button>
          )
        })}
      </div>
      <p className="text-[10px] md:text-xs text-neutral-600 mt-2 md:mt-3 flex items-center gap-1.5 md:gap-2">
        <svg className="w-3 h-3 md:w-4 md:h-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="truncate">{currentTemplate.description}</span>
      </p>
    </div>
  )
}
