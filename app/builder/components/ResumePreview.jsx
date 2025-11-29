'use client'

import { useResumeStore } from '@/store/resumeStore'
import { templates } from '@/lib/templates'
import { addWatermarkIfNeeded } from '@/lib/watermark'
import { wrapTemplateForPDF } from '@/lib/pdf-optimizer'
import { useEffect, useRef, useState, useMemo } from 'react'

export default function ResumePreview({ resume: externalResume }) {
  const { resume: storeResume } = useResumeStore()
  const resume = externalResume || storeResume
  const currentTemplate = templates[resume.template] || templates.ats
  const contentRef = useRef(null)
  const iframeRef = useRef(null)
  const [totalPages, setTotalPages] = useState(1)
  
  const isProfessional = resume.subscriptionStatus === 'active'

  // Memoizar el HTML renderizado - IGUAL QUE EN EL PDF
  const renderedContent = useMemo(() => {
    const resumeToRender = isProfessional 
      ? resume 
      : { ...resume, coverLetter: '' }
    
    // Renderizar plantilla
    let html = currentTemplate.render(resumeToRender)
    
    // Agregar marca de agua si es necesario
    html = addWatermarkIfNeeded(html, resume.plan)
    
    // Envolver con los mismos estilos del PDF
    html = wrapTemplateForPDF(html, currentTemplate.name)
    
    return html
  }, [resume, currentTemplate, isProfessional])

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current
      const adjustHeight = () => {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
          if (iframeDoc && iframeDoc.body) {
            const height = Math.max(
              iframeDoc.body.scrollHeight,
              iframeDoc.documentElement.scrollHeight,
              842 // Mínimo A4
            )
            iframe.style.height = `${height}px`
          }
        } catch (e) {
          console.error('Error adjusting iframe height:', e)
        }
      }
      
      iframe.addEventListener('load', adjustHeight)
      // Ajustar también después de un pequeño delay por si las imágenes cargan
      setTimeout(adjustHeight, 100)
      setTimeout(adjustHeight, 500)
      
      return () => iframe.removeEventListener('load', adjustHeight)
    }
  }, [renderedContent])

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
      {/* Vista previa del CV - RENDERIZADO COMPLETO COMO PDF */}
      <div className="flex-1 bg-gradient-to-br from-neutral-100 via-neutral-50 to-neutral-100 overflow-y-auto custom-scrollbar">
        <div className="p-2 md:p-4 lg:p-6">
          {/* Iframe para renderizar el HTML completo con sus estilos */}
          <div
            ref={contentRef}
            className="bg-white mx-auto transition-all duration-300"
            style={{
              width: '100%',
              maxWidth: '595px',
              boxShadow: '0 10px 40px -5px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.1)',
              borderRadius: '4px',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <iframe
              ref={iframeRef}
              srcDoc={renderedContent}
              style={{
                width: '100%',
                minHeight: '842px',
                border: 'none',
                display: 'block',
                background: 'white'
              }}
              title="Vista previa del CV"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
