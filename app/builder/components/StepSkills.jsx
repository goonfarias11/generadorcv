'use client'

import { useState } from 'react'
import { useResumeStore } from '@/store/resumeStore'
import Question from './Question'
import BotonSugerencias from './BotonSugerencias'

export default function StepSkills() {
  const { resume, addSkill, removeSkill } = useResumeStore()
  const [inputValue, setInputValue] = useState('')

  const handleAnswer = (value) => {
    if (value.trim()) {
      addSkill(value.trim())
      setInputValue('')
    }
  }

  const popularSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript',
    'HTML/CSS', 'SQL', 'Git', 'AWS', 'Docker',
    'Comunicación', 'Liderazgo', 'Trabajo en equipo', 'Resolución de problemas'
  ]

  const addPopularSkill = (skill) => {
    if (!resume.skills.includes(skill)) {
      addSkill(skill)
    }
  }

  return (
    <div className="space-y-6">
      <Question
        label="Agrega tus habilidades (una por vez)"
        type="text"
        value={inputValue}
        placeholder="Ej: React, Python, Liderazgo..."
        onAnswer={handleAnswer}
      />

      {/* Botón de sugerencias para skills */}
      <div className="mt-4">
        <BotonSugerencias 
          tipo="skills"
          textoActual={resume.skills.join(', ')}
          onSeleccionar={(texto) => {
            // Convertir el texto de sugerencia en array de skills
            const newSkills = texto.split(',').map(s => s.trim()).filter(s => s)
            newSkills.forEach(skill => {
              if (!resume.skills.includes(skill)) {
                addSkill(skill)
              }
            })
          }}
          label="💡 Sugerir habilidades"
        />
      </div>

      {resume.skills.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-gray-700 mb-3">Habilidades agregadas:</h3>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill, idx) => (
              <div
                key={idx}
                className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full flex items-center gap-2"
              >
                <span>{skill}</span>
                <button
                  onClick={() => removeSkill(idx)}
                  className="text-indigo-600 hover:text-indigo-900 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <h3 className="font-semibold text-gray-700 mb-3">O selecciona de las más populares:</h3>
        <div className="flex flex-wrap gap-2">
          {popularSkills.map((skill, idx) => (
            <button
              key={idx}
              onClick={() => addPopularSkill(skill)}
              disabled={resume.skills.includes(skill)}
              className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed text-sm transition-colors"
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {resume.skills.length >= 4 && (
        <p className="text-sm text-green-600 font-medium">
          ✓ Excelente, tienes {resume.skills.length} habilidades
        </p>
      )}
    </div>
  )
}
