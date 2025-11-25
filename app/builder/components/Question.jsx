'use client'

import { useState, useEffect } from 'react'
import { validateEmail, validatePhone, validateMinLength } from '@/lib/validation'

export default function Question({ label, type = 'text', options = [], value = '', onAnswer, placeholder = '', hint = '', minLength = 0, optional = false, onChange }) {
  const [inputValue, setInputValue] = useState(value)
  const [error, setError] = useState('')

  useEffect(() => {
    setInputValue(value)
  }, [value])

  const handleInputChange = (e) => {
    const val = e.target.value
    setInputValue(val)
    if (onChange) {
      onChange(val)
    }
  }

  const validate = (val) => {
    setError('')
    
    if (type === 'email') {
      const result = validateEmail(val)
      if (!result.isValid) {
        setError(result.message)
        return false
      }
    }
    
    if (type === 'tel') {
      const result = validatePhone(val)
      if (!result.isValid) {
        setError(result.message)
        return false
      }
    }
    
    if (minLength > 0) {
      const result = validateMinLength(val, minLength)
      if (!result.isValid) {
        setError(result.message)
        return false
      }
    }
    
    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Si la pregunta es opcional, permitir avanzar siempre (con o sin texto)
    if (optional) {
      if (inputValue.trim()) {
        // Si hay texto, validar
        if (validate(inputValue)) {
          onAnswer(inputValue)
          if (type !== 'textarea') {
            setInputValue('')
          }
        }
      } else {
        // Si no hay texto, avanzar con vacío
        onAnswer('')
      }
      return
    }
    
    // Para preguntas obligatorias, requerir texto
    if (inputValue.trim()) {
      if (validate(inputValue)) {
        onAnswer(inputValue)
        if (type !== 'textarea') {
          setInputValue('')
        }
      }
    }
  }

  const handleSelectChange = (e) => {
    const val = e.target.value
    setInputValue(val)
    if (val) {
      onAnswer(val)
    }
  }

  const handleSkip = () => {
    onAnswer('')
  }

  return (
    <div className="animate-slide-in space-y-6">
      {/* Label mejorado con indicador opcional */}
      <div className="space-y-2">
        <label className="label-premium flex items-center gap-2 text-base md:text-lg font-bold text-neutral-800">
          {label}
          {optional && (
            <span className="text-xs font-semibold text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-md">
              Opcional
            </span>
          )}
        </label>
        {hint && (
          <div className="flex items-start gap-2 p-3 bg-primary-50 border border-primary-200 rounded-lg">
            <svg className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs md:text-sm text-primary-800 font-medium">{hint}</p>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {type === 'textarea' ? (
          <textarea
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            className={`textarea-premium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${
              error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'focus:border-primary-500 focus:ring-primary-200'
            }`}
            rows={5}
            autoFocus
            aria-label={label}
            aria-invalid={!!error}
            aria-describedby={error ? 'input-error' : undefined}
          />
        ) : type === 'select' ? (
          <select
            value={inputValue}
            onChange={handleSelectChange}
            className={`select-premium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${
              error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'focus:border-primary-500 focus:ring-primary-200'
            }`}
            autoFocus
            aria-label={label}
            aria-invalid={!!error}
          >
            <option value="">Seleccioná una opción...</option>
            {options.map((opt, idx) => (
              <option key={idx} value={opt.value || opt}>
                {opt.label || opt}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            className={`input-premium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${
              error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'focus:border-primary-500 focus:ring-primary-200'
            }`}
            autoFocus
            aria-label={label}
            aria-invalid={!!error}
            aria-describedby={error ? 'input-error' : undefined}
          />
        )}
        
        {error && (
          <div id="input-error" className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-semibold text-red-800">{error}</p>
          </div>
        )}
        
        {type !== 'select' && (
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={optional ? false : !inputValue.trim()}
              className="btn-primary flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <span>Siguiente</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            {optional && (
              <button
                type="button"
                onClick={handleSkip}
                className="px-5 py-3 text-sm md:text-base font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2"
              >
                Omitir este paso
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  )
}
