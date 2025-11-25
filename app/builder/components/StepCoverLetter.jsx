'use client'

import { useState, useEffect } from 'react'
import { useResumeStore } from '@/store/resumeStore'

export default function StepCoverLetter() {
  const { resume, updateResume } = useResumeStore()
  const [coverLetter, setCoverLetter] = useState(resume.coverLetter || '')
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    setCoverLetter(resume.coverLetter || '')
  }, [resume.coverLetter])

  const generateAutomaticCover = () => {
    setIsGenerating(true)
    setCoverLetter('') // Limpiar antes de generar
    
    setTimeout(() => {
      const name = resume.name || '[Tu nombre]'
      const position = resume.experience?.[0]?.position || '[tu posición]'
      const company = '[Nombre de la empresa]'
      const skills = resume.skills?.slice(0, 3).join(', ') || 'mis habilidades'
      
      const template = `Estimado/a responsable de contratación de ${company},

Me dirijo a ustedes con gran interés en la posición disponible en su organización. Como profesional ${position}, me entusiasma la posibilidad de contribuir al éxito de ${company}.

${resume.profile ? resume.profile : `Cuento con experiencia demostrable en el área, destacándome por mi capacidad de ${skills}.`}

${resume.experience && resume.experience.length > 0 ? 
`En mi experiencia previa en ${resume.experience[0].company}, logré ${resume.experience[0].description ? resume.experience[0].description.substring(0, 100) + '...' : 'resultados significativos que aportaron valor a la organización'}.` 
: ''}

Mi formación académica ${resume.education && resume.education.length > 0 ? `en ${resume.education[0].degree}` : ''} y mis habilidades en ${skills} me permiten afrontar con éxito los desafíos que esta posición requiere.

Agradezco de antemano la consideración de mi candidatura y quedo a disposición para ampliar cualquier información que consideren relevante.

Atentamente,
${name}`

      setCoverLetter(template)
      updateResume({ coverLetter: template })
      setIsGenerating(false)
    }, 1000)
  }

  const handleSave = () => {
    updateResume({ coverLetter })
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Carta de presentación:</strong> Complementa tu CV con una carta personalizada que destaque tu motivación e interés.
        </p>
      </div>

      {!coverLetter && (
        <button
          onClick={generateAutomaticCover}
          disabled={isGenerating}
          className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 transition-colors font-semibold"
        >
          {isGenerating ? '✨ Generando...' : '✨ Generar carta automática'}
        </button>
      )}

      <div>
        <label className="block text-lg font-medium text-gray-700 mb-3">
          {coverLetter ? 'Edita tu carta de presentación' : 'Escribe tu carta de presentación'}
        </label>
        <textarea
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          onBlur={handleSave}
          placeholder="Escribe tu carta de presentación aquí..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          rows={12}
        />
        <p className="text-xs text-gray-500 mt-2">
          {coverLetter.length} caracteres
        </p>
      </div>

      {coverLetter && (
        <button
          onClick={() => {
            if (confirm('¿Seguro que quieres eliminar la carta?')) {
              setCoverLetter('')
              updateResume({ coverLetter: '' })
            }
          }}
          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
        >
          🗑️ Eliminar
        </button>
      )}

      {coverLetter && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-700 mb-2">Vista previa:</h4>
          <div className="text-sm text-gray-600 whitespace-pre-wrap">
            {coverLetter}
          </div>
        </div>
      )}
    </div>
  )
}
