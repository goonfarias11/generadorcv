'use client'

import { useState } from 'react'
import { useResumeStore } from '@/store/resumeStore'
import Question from './Question'
import BotonSugerencias from './BotonSugerencias'

export default function StepExtras() {
  const { resume, addExtra, removeExtra } = useResumeStore()
  const [inputValue, setInputValue] = useState('')

  const handleAnswer = (value) => {
    if (value.trim()) {
      addExtra(value.trim())
      setInputValue('')
    }
  }

  const suggestions = [
    'Idiomas: Inglés avanzado, Francés intermedio',
    'Certificaciones: AWS Certified Solutions Architect',
    'Voluntariado: Cruz Roja Argentina',
    'Publicaciones: Artículos en Medium sobre desarrollo web',
    'Proyectos personales: Aplicación móvil con 10k descargas',
    'Premios: Primer lugar en Hackathon 2023'
  ]

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Agrega información adicional como idiomas, certificaciones, voluntariado, premios, etc.
        </p>
      </div>

      <Question
        label="Agrega información adicional (opcional)"
        type="textarea"
        value={inputValue}
        placeholder="Ej: Inglés avanzado (C1), Certificado en Google Analytics..."
        onAnswer={handleAnswer}
      />

      {/* Botón de sugerencias para extras */}
      <div className="mt-4">
        <BotonSugerencias 
          tipo="extras"
          textoActual={resume.extras.join('\n')}
          onSeleccionar={(texto) => {
            // Agregar el texto de sugerencia como nuevo extra
            if (texto.trim() && !resume.extras.includes(texto.trim())) {
              addExtra(texto.trim())
            }
          }}
          label="💡 Sugerir información adicional"
        />
      </div>

      {resume.extras.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-gray-700 mb-3">Información agregada:</h3>
          <div className="space-y-2">
            {resume.extras.map((extra, idx) => (
              <div
                key={idx}
                className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex justify-between items-start"
              >
                <p className="text-sm text-gray-700">{extra}</p>
                <button
                  onClick={() => removeExtra(idx)}
                  className="text-red-600 hover:text-red-700 font-bold ml-2"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <h3 className="font-semibold text-gray-700 mb-3">Ejemplos de información adicional:</h3>
        <div className="space-y-2">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => addExtra(suggestion)}
              className="w-full text-left bg-gray-50 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 text-sm transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
