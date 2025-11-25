'use client'

import { useState } from 'react'
import { useResumeStore } from '@/store/resumeStore'
import Question from './Question'
import BotonSugerencias from './BotonSugerencias'

export default function StepEducation() {
  const { resume, addEducation, updateEducation, removeEducation, updateResume } = useResumeStore()
  const [currentQuestion, setCurrentQuestion] = useState(-2) // Comenzar con preguntas de info
  const [tempEdu, setTempEdu] = useState({})
  const [editingIndex, setEditingIndex] = useState(null)

  const questions = [
    { label: '¿Qué título obtuviste?', field: 'degree', type: 'text', placeholder: 'Ej: Licenciatura en Sistemas' },
    { label: '¿En qué institución?', field: 'institution', type: 'text', placeholder: 'Ej: Universidad Nacional' },
    { label: '¿En qué año?', field: 'year', type: 'text', placeholder: 'Ej: 2019 o 2017-2021' },
    { label: '¿Proyectos, logros académicos o reconocimientos? (opcional)', field: 'details', type: 'textarea', placeholder: 'Ej: Proyecto final sobre IA, Promedio: 9.2, Mención honorífica...' }
  ]

  const handleEducationInfoAnswer = (value) => {
    const educationInfo = resume.educationInfo || { hasHighSchoolCompleted: null, hasAnalitico: null }
    
    if (currentQuestion === -2) {
      // Pregunta 1: Secundario completo
      updateResume({ 
        educationInfo: { 
          ...educationInfo, 
          hasHighSchoolCompleted: value === 'Sí' 
        } 
      })
      
      if (value === 'Sí') {
        setTimeout(() => setCurrentQuestion(-1), 300)
      } else {
        setTimeout(() => setCurrentQuestion(0), 300)
      }
    } else if (currentQuestion === -1) {
      // Pregunta 2: Analítico en mano
      updateResume({ 
        educationInfo: { 
          ...educationInfo, 
          hasAnalitico: value === 'Sí' 
        } 
      })
      setTimeout(() => setCurrentQuestion(0), 300)
    }
  }

  const handleAnswer = (value) => {
    const field = questions[currentQuestion].field
    const newTempEdu = { ...tempEdu, [field]: value }
    setTempEdu(newTempEdu)
    
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1)
      }, 300)
    }
    // No avanzar automáticamente en la última pregunta para permitir usar sugerencias
  }

  const handleDetailsChange = (value) => {
    setTempEdu({ ...tempEdu, details: value })
  }

  const handleEdit = (index) => {
    setTempEdu(resume.education[index])
    setEditingIndex(index)
    setCurrentQuestion(0)
  }

  const handleAddAnother = () => {
    setTempEdu({})
    setEditingIndex(null)
    setCurrentQuestion(0)
  }

  // Renderizar preguntas de información de educación
  if (currentQuestion === -2) {
    return (
      <div className="space-y-6">
        <Question
          label="¿Tenés el secundario completo?"
          type="select"
          value=""
          options={['Sí', 'No']}
          onAnswer={handleEducationInfoAnswer}
        />
      </div>
    )
  }

  if (currentQuestion === -1) {
    return (
      <div className="space-y-6">
        <div className="mb-4">
          <button
            onClick={() => setCurrentQuestion(-2)}
            className="text-sm text-indigo-600 hover:text-indigo-700"
          >
            ← Anterior
          </button>
        </div>
        <Question
          label="¿Tenés el analítico en mano?"
          type="select"
          value=""
          options={['Sí', 'No']}
          onAnswer={handleEducationInfoAnswer}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {resume.education.length > 0 && currentQuestion === 0 && !editingIndex && Object.keys(tempEdu).length === 0 && (
        <div className="mb-6 space-y-3">
          <h3 className="font-semibold text-gray-700">Educación agregada:</h3>
          {resume.education.map((edu, idx) => (
            <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                  <p className="text-sm text-gray-600">{edu.institution}</p>
                  <p className="text-xs text-gray-500">{edu.year}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(idx)}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => removeEducation(idx)}
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

      {(currentQuestion > 0 || Object.keys(tempEdu).length > 0 || editingIndex !== null || resume.education.length === 0) && (
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
            value={tempEdu[questions[currentQuestion].field] || ''}
            placeholder={questions[currentQuestion].placeholder}
            onAnswer={handleAnswer}
            optional={currentQuestion === 3}
            onChange={currentQuestion === 3 ? handleDetailsChange : undefined}
          />

          {/* Botón de sugerencias para el campo de detalles/logros */}
          {currentQuestion === 3 && tempEdu.details && tempEdu.details.length > 20 && (
            <div className="mt-4">
              <BotonSugerencias 
                tipo="educacion"
                textoActual={tempEdu.details}
                onSeleccionar={(texto) => setTempEdu({...tempEdu, details: texto})}
              />
            </div>
          )}

          {/* Botón para guardar educación */}
          {currentQuestion === 3 && tempEdu.degree && tempEdu.institution && (
            <button
              onClick={() => {
                if (editingIndex !== null) {
                  updateEducation(editingIndex, tempEdu)
                  setEditingIndex(null)
                } else {
                  addEducation(tempEdu)
                }
                setTempEdu({})
                setCurrentQuestion(0)
              }}
              className="w-full mt-4 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              {editingIndex !== null ? '✓ Actualizar educación' : '✓ Guardar educación'}
            </button>
          )}
        </>
      )}

      {resume.education.length > 0 && currentQuestion === 0 && !editingIndex && Object.keys(tempEdu).length === 0 && (
        <button
          onClick={handleAddAnother}
          className="w-full px-4 py-3 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
        >
          + Agregar otra educación
        </button>
      )}
    </div>
  )
}
