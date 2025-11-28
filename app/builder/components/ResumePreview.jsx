'use client'

import { useResumeStore } from '@/store/resumeStore'
import { templates } from '@/lib/templates'
import { addWatermarkIfNeeded } from '@/lib/watermark'
import { useEffect, useRef, useState, useMemo } from 'react'

export default function ResumePreview({ resume: externalResume }) {
  const { resume: storeResume } = useResumeStore()
  const resume = externalResume || storeResume
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
      {/* Vista previa del CV - UN SOLO RENDER */}
      <div className="flex-1 bg-gradient-to-br from-neutral-100 via-neutral-50 to-neutral-100 overflow-y-auto custom-scrollbar">
        <div className="p-2 md:p-4 lg:p-6">
          {/* Hoja A4 con sombra realista - ULTRA RESPONSIVE */}
          <div
            ref={contentRef}
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
              className="relative z-10"
              dangerouslySetInnerHTML={{ __html: renderedContent }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
