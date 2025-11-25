'use client'

import { useState } from 'react'
import { useResumeStore } from '@/store/resumeStore'
import Question from './Question'
import BotonSugerenciasExperiencia from './BotonSugerenciasExperiencia'

export default function StepExperience() {
  const { resume, updateResume, addExperience, updateExperience, removeExperience } = useResumeStore()
  const [hasExperience, setHasExperience] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [tempExp, setTempExp] = useState({})
  const [editingIndex, setEditingIndex] = useState(null)
  const [noExpStep, setNoExpStep] = useState(0)

  const questions = [
    { label: '¿Cuál fue tu posición o cargo?', field: 'position', type: 'text', placeholder: 'Ej: Desarrollador Frontend' },
    { label: '¿En qué empresa trabajaste?', field: 'company', type: 'text', placeholder: 'Ej: Tech Company SA' },
    { label: '¿Desde cuándo?', field: 'startDate', type: 'text', placeholder: 'Ej: Enero 2020' },
    { label: '¿Hasta cuándo?', field: 'endDate', type: 'text', placeholder: 'Ej: Diciembre 2023 (o deja vacío si continúas)' },
    { label: 'Describe tus responsabilidades y logros', field: 'description', type: 'textarea', placeholder: 'Describe tus principales tareas, logros y tecnologías utilizadas...' }
  ]

  const noExperienceQuestions = [
    { label: '¿Hiciste algún voluntariado? (opcional)', field: 'volunteer', type: 'textarea', placeholder: 'Describe tu experiencia en voluntariado...' },
    { label: '¿Tenés algún proyecto personal destacable? (opcional)', field: 'projects', type: 'textarea', placeholder: 'Describe tus proyectos personales...' },
    { label: '¿Querés agregar algún logro personal o académico? (opcional)', field: 'achievements', type: 'textarea', placeholder: 'Describe tus logros...' }
  ]

  const handleHasExperienceAnswer = (value) => {
    if (value === 'No') {
      setHasExperience(false)
      updateResume({ experience: [] })
    } else {
      setHasExperience(true)
    }
  }

  const handleNoExpAnswer = (value) => {
    const field = noExperienceQuestions[noExpStep].field
    const currentExtras = resume.noExperienceExtras || { volunteer: '', projects: '', achievements: '' }
    
    updateResume({
      noExperienceExtras: {
        ...currentExtras,
        [field]: value.trim()
      }
    })
    
    if (noExpStep < noExperienceQuestions.length - 1) {
      setTimeout(() => {
        setNoExpStep(noExpStep + 1)
      }, 300)
    }
  }

  const handleAnswer = (value) => {
    const field = questions[currentQuestion].field
    const newTempExp = { ...tempExp, [field]: value }
    setTempExp(newTempExp)
    
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1)
      }, 300)
    }
    // No avanzar automáticamente en la última pregunta para permitir usar sugerencias
  }

  const handleDescriptionChange = (value) => {
    setTempExp({ ...tempExp, description: value })
  }

  const handleEdit = (index) => {
    setTempExp(resume.experience[index])
    setEditingIndex(index)
    setCurrentQuestion(0)
  }

  const handleAddAnother = () => {
    setTempExp({
      position: '',
      company: '',
      startDate: '',
      endDate: '',
      description: ''
    })
    setEditingIndex(null)
    setCurrentQuestion(0)
  }

  // Pregunta inicial: ¿Tiene experiencia?
  if (hasExperience === null) {
    return (
      <div className="space-y-6">
        <Question
          label="¿Tenés experiencia laboral?"
          type="select"
          options={['Sí', 'No']}
          onAnswer={handleHasExperienceAnswer}
        />
      </div>
    )
  }

  // Flujo para usuarios SIN experiencia
  if (hasExperience === false) {
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-800">
            💡 No te preocupes. Podés destacar voluntariados, proyectos personales o logros académicos.
          </p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">
              Pregunta {noExpStep + 1} de {noExperienceQuestions.length}
            </span>
            {noExpStep > 0 && (
              <button
                onClick={() => setNoExpStep(noExpStep - 1)}
                className="text-sm text-indigo-600 hover:text-indigo-700"
              >
                ← Anterior
              </button>
            )}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((noExpStep + 1) / noExperienceQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <Question
          key={noExpStep}
          label={noExperienceQuestions[noExpStep].label}
          type={noExperienceQuestions[noExpStep].type}
          value={(resume.noExperienceExtras && resume.noExperienceExtras[noExperienceQuestions[noExpStep].field]) || ''}
          placeholder={noExperienceQuestions[noExpStep].placeholder}
          onAnswer={handleNoExpAnswer}
          optional={true}
        />

        {noExpStep === noExperienceQuestions.length - 1 && (
          <p className="text-sm text-green-600 font-medium mt-4">
            ✓ Sección completada
          </p>
        )}
      </div>
    )
  }

  // Flujo normal para usuarios CON experiencia
  return (
    <div className="space-y-6">
      {resume.experience.length > 0 && currentQuestion === 0 && !editingIndex && Object.keys(tempExp).length === 0 && (
        <div className="mb-6 space-y-3">
          <h3 className="font-semibold text-gray-700">Experiencias agregadas:</h3>
          {resume.experience.map((exp, idx) => (
            <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                  <p className="text-sm text-gray-600">{exp.company}</p>
                  <p className="text-xs text-gray-500">{exp.startDate} - {exp.endDate || 'Presente'}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(idx)}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => removeExperience(idx)}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(currentQuestion > 0 || Object.keys(tempExp).length > 0 || editingIndex !== null || resume.experience.length === 0) && (
        <>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">
                Pregunta {currentQuestion + 1} de {questions.length}
              </span>
              {currentQuestion > 0 && (
                <button
                  onClick={() => setCurrentQuestion(currentQuestion - 1)}
                  className="text-sm text-indigo-600 hover:text-indigo-700"
                >
                  ← Anterior
                </button>
              )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <Question
            key={currentQuestion}
            label={questions[currentQuestion].label}
            type={questions[currentQuestion].type}
            value={tempExp[questions[currentQuestion].field] || ''}
            placeholder={questions[currentQuestion].placeholder}
            onAnswer={handleAnswer}
            onChange={currentQuestion === 4 ? handleDescriptionChange : undefined}
          />

          {/* Botón de sugerencias para el campo de descripción - SIEMPRE VISIBLE */}
          {currentQuestion === 4 && (
            <div className="mt-4">
              <BotonSugerenciasExperiencia 
                cargo={tempExp.position || ''}
                empresa={tempExp.company || ''}
                textoActual={tempExp.description || ''}
                onSeleccionar={(texto) => setTempExp({...tempExp, description: texto})}
              />
            </div>
          )}

          {/* Botón para guardar experiencia */}
          {currentQuestion === 4 && tempExp.position && tempExp.company && tempExp.description && (
            <button
              onClick={() => {
                if (editingIndex !== null) {
                  updateExperience(editingIndex, tempExp)
                  setEditingIndex(null)
                } else {
                  addExperience(tempExp)
                }
                setTempExp({})
                setCurrentQuestion(0)
              }}
              className="w-full mt-4 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              {editingIndex !== null ? '✓ Actualizar experiencia' : '✓ Guardar experiencia'}
            </button>
          )}
        </>
      )}

      {resume.experience.length > 0 && currentQuestion === 0 && editingIndex === null && Object.keys(tempExp).length === 0 && (
        <button
          onClick={handleAddAnother}
          className="w-full px-4 py-3 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors font-medium"
        >
          + Agregar otra experiencia
        </button>
      )}
    </div>
  )
}
