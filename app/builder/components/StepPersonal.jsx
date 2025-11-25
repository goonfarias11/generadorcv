'use client'

import { useState } from 'react'
import { useResumeStore } from '@/store/resumeStore'
import Question from './Question'
import PhotoUploader from './PhotoUploader'
import BotonSugerencias from './BotonSugerencias'

export default function StepPersonal() {
  const { resume, updateResume } = useResumeStore()
  const [currentQuestion, setCurrentQuestion] = useState(0)

  const questions = [
    {
      label: '¿Cuál es tu nombre completo?',
      type: 'text',
      field: 'name',
      placeholder: 'Ej: Juan Pérez',
      hint: 'Usá tu nombre real como aparece en tu DNI'
    },
    {
      label: '¿Cuál es tu email?',
      type: 'email',
      field: 'email',
      placeholder: 'tu@email.com',
      hint: 'Usá un email profesional que revises frecuentemente'
    },
    {
      label: '¿Cuál es tu teléfono?',
      type: 'tel',
      field: 'phone',
      placeholder: '+54 11 1234-5678',
      hint: 'Incluí el código de área para que puedan contactarte fácilmente'
    },
    {
      label: '¿Dónde vives?',
      type: 'text',
      field: 'location',
      placeholder: 'Ciudad, País',
      hint: 'Ejemplo: Buenos Aires, Argentina'
    },
    {
      label: '¿En qué rubro laboral te gustaría orientar tu CV?',
      type: 'select',
      field: 'industry',
      hint: 'Esto nos ayuda a personalizar tu CV según tu área',
      options: [
        'Tecnología / Software',
        'Atención al Cliente',
        'Ventas y Comercial',
        'Logística / Depósito',
        'Administración / Oficina',
        'Gastronomía',
        'Diseño / Creativo',
        'Salud',
        'Educación',
        'Construcción',
        'Otros'
      ]
    },
    {
      label: '¿A qué puesto específico querés orientar tu CV?',
      type: 'text',
      field: 'targetRole',
      placeholder: 'Ej: Programador Frontend, Mozo, Recepcionista, Repositor...',
      hint: 'Ayuda a enfocar tu CV en el trabajo que buscás',
      optional: true
    },
    {
      label: 'Escribí un breve perfil profesional',
      type: 'textarea',
      field: 'profile',
      placeholder: 'Describe tu experiencia, objetivos profesionales y lo que te hace único...',
      hint: 'Un buen perfil tiene 3-5 líneas y destaca tus fortalezas principales',
      minLength: 50
    },
    {
      label: '¿Querés agregar tu sitio web o portfolio?',
      type: 'text',
      field: 'website',
      placeholder: 'https://tusitio.com',
      hint: 'Ideal si tenés trabajos o proyectos para mostrar',
      optional: true
    },
    {
      label: '¿Querés agregar tu perfil de LinkedIn?',
      type: 'text',
      field: 'linkedin',
      placeholder: 'https://linkedin.com/in/usuario',
      hint: 'LinkedIn es muy valorado por reclutadores',
      optional: true
    },
    {
      label: '¿Querés agregar tu GitHub u otra red profesional?',
      type: 'text',
      field: 'github',
      placeholder: 'https://github.com/usuario',
      hint: 'Especialmente útil para perfiles técnicos',
      optional: true
    }
  ]

  const handleAnswer = (value) => {
    const field = questions[currentQuestion].field
    
    // Limpiar respuestas "no" o vacías en campos opcionales (website, linkedin, github, targetRole)
    const optionalFields = ['website', 'linkedin', 'github', 'targetRole']
    let finalValue = value
    
    if (optionalFields.includes(field)) {
      const trimmedValue = value.trim().toLowerCase()
      const negativeResponses = ['no', 'no tengo', 'ninguno', 'nada', 'n/a']
      
      if (negativeResponses.includes(trimmedValue) || trimmedValue === '') {
        finalValue = ''
      } else {
        finalValue = value.trim()
      }
    }
    
    updateResume({ [field]: finalValue })
    
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1)
      }, 300)
    }
  }

  const handleProfileChange = (value) => {
    updateResume({ profile: value })
  }

  return (
    <div className="space-y-6">
      {/* Componente de foto de perfil */}
      {currentQuestion === 0 && (
        <div className="mb-8">
          <PhotoUploader />
        </div>
      )}
      
      {/* Barra de progreso mejorada */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold text-neutral-700">
            Paso {currentQuestion + 1} de {questions.length}
          </span>
          {currentQuestion > 0 && (
            <button
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Pregunta anterior
            </button>
          )}
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary-500 to-primary-600 h-2.5 rounded-full transition-all duration-500 ease-out shadow-glow"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
        <p className="text-xs text-neutral-500 mt-2">
          {Math.round(((currentQuestion + 1) / questions.length) * 100)}% completado
        </p>
      </div>

      <Question
        key={currentQuestion}
        label={questions[currentQuestion].label}
        type={questions[currentQuestion].type}
        value={resume[questions[currentQuestion].field] || ''}
        placeholder={questions[currentQuestion].placeholder}
        onAnswer={handleAnswer}
        minLength={questions[currentQuestion].minLength || 0}
        optional={questions[currentQuestion].optional || false}
        hint={questions[currentQuestion].hint}
        options={questions[currentQuestion].options}
        onChange={currentQuestion === 6 ? handleProfileChange : undefined}
      />

      {/* Botón de sugerencias para el perfil */}
      {currentQuestion === 6 && (
        <div className="mt-6 p-5 bg-gradient-to-r from-purple-50 to-primary-50 border-2 border-primary-200 rounded-xl">
          <div className="flex items-start gap-3 mb-3">
            <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <div>
              <p className="text-sm font-bold text-primary-900">¿Necesitás ayuda?</p>
              <p className="text-xs text-primary-700 mt-1">Usá la IA para generar un perfil profesional personalizado</p>
            </div>
          </div>
          <BotonSugerencias 
            tipo="perfil"
            textoActual={resume.profile || ''}
            onSeleccionar={(texto) => updateResume({ profile: texto })}
          />
        </div>
      )}

      {/* Mensaje de completado */}
      {currentQuestion === questions.length - 1 && resume[questions[currentQuestion].field] && (
        <div className="mt-6 p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl animate-slide-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-green-900">¡Sección Personal completada!</p>
              <p className="text-xs text-green-700 mt-1">Podés continuar al siguiente paso</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
