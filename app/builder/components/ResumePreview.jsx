'use client'

import { useResumeStore } from '@/store/resumeStore'
import { templates } from '@/lib/templates'
import { addWatermarkIfNeeded } from '@/lib/watermark'
import { useEffect, useRef, useState, useMemo } from 'react'

export default function ResumePreview() {
  const { resume } = useResumeStore()
  const currentTemplate = templates[resume.template] || templates.ats
  const contentRef = useRef(null)
  const [totalPages, setTotalPages] = useState(1)
  
  const isProfessional = resume.subscriptionStatus === 'active'

  // Memoizar el HTML renderizado para evitar cálculos innecesarios
  const renderedContent = useMemo(() => {
    const resumeToRender = isProfessional 
      ? resume 
      : { ...resume, coverLetter: '' }
    
    const renderedHTML = currentTemplate.render(resumeToRender)
    return addWatermarkIfNeeded(renderedHTML, resume.plan)
  }, [resume, currentTemplate, isProfessional])

  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight
      const pageHeight = 842 // Altura A4 ajustada
      const calculatedPages = Math.max(1, Math.ceil(contentHeight / pageHeight))
      setTotalPages(calculatedPages)
    }
  }, [renderedContent])

  return (
    <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl border-2 border-neutral-200 overflow-hidden flex flex-col max-h-[80vh]">
      {/* Indicador de páginas - RESPONSIVE */}
      <div className="bg-gradient-to-r from-primary-50 to-purple-50 border-b-2 border-neutral-200 px-4 md:px-5 py-2.5 md:py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 md:w-5 md:h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="text-xs md:text-sm font-bold text-neutral-800">
            Vista previa en tiempo real
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] md:text-xs font-semibold text-neutral-600">Páginas:</span>
          <span className="badge-primary text-[10px] md:text-xs px-2 md:px-2.5 py-0.5 md:py-1">{totalPages}</span>
        </div>
      </div>

      {/* Vista previa del CV - RESPONSIVE Y OPTIMIZADA CON MAX-HEIGHT */}
      <div className="flex-1 bg-gradient-to-br from-neutral-100 via-neutral-50 to-neutral-100 overflow-y-auto custom-scrollbar">
        <div className="p-2 md:p-4 lg:p-6">
          <div className="space-y-3 md:space-y-4 lg:space-y-6">
            {Array.from({ length: totalPages }).map((_, pageIndex) => (
                <div key={pageIndex} className="relative">
                  {/* Indicador de número de página - RESPONSIVE */}
                  {totalPages > 1 && (
                    <div className="text-center mb-2 md:mb-3">
                      <span className="inline-flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1 md:py-1.5 bg-white rounded-full shadow-md border-2 border-neutral-200 text-[9px] md:text-[11px] font-bold text-neutral-700">
                        <svg className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        Pág {pageIndex + 1}/{totalPages}
                      </span>
                    </div>
                  )}
                  
                  {/* Hoja A4 con sombra realista - ULTRA RESPONSIVE */}
                  <div
                    className="bg-white mx-auto transition-all duration-300"
                    style={{
                      width: '100%',
                      maxWidth: '595px',
                      minHeight: '842px',
                      boxShadow: '0 10px 40px -5px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.1)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      position: 'relative'
                    }}
                  >
                    {/* Efecto de papel */}
                    <div className="absolute inset-0 pointer-events-none" style={{
                      background: 'linear-gradient(to bottom, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.02) 100%)'
                    }}></div>
                    
                    <div
                      ref={pageIndex === 0 ? contentRef : null}
                      className="relative z-10"
                      style={{
                        transform: `translateY(-${pageIndex * 842}px)`,
                        transformOrigin: 'top center'
                      }}
                      dangerouslySetInnerHTML={{ __html: renderedContent }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
