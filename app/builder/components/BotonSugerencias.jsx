'use client'

import { useState } from 'react'
import { useResumeStore } from '@/store/resumeStore'

export default function BotonSugerencias({ tipo, textoActual, onSeleccionar, label = "💡 Generar sugerencia" }) {
  const { resume } = useResumeStore()
  const [sugerencias, setSugerencias] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [mostrarAdvertencia, setMostrarAdvertencia] = useState(false)

  const generarSugerencias = async () => {
    setIsLoading(true)
    setError('')
    setSugerencias([])
    setMostrarAdvertencia(false)

    try {
      const response = await fetch('/api/sugerencias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tipo, 
          texto: textoActual || '',
          rubro: resume.industry || 'Otros',
          puesto: resume.targetRole || ''
        })
      })

      const data = await response.json()

      if (data.sugerencias && data.sugerencias.length > 0) {
        setSugerencias(data.sugerencias)
        setMostrarAdvertencia(data.advertencia || false)
      }
    } catch (error) {
      setError('Error al conectar con el servidor')
    } finally {
      setIsLoading(false)
    }
  }

  const seleccionar = (texto) => {
    onSeleccionar(texto)
    setSugerencias([])
    setError('')
    setMostrarAdvertencia(false)
  }

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={generarSugerencias}
        disabled={isLoading}
        className="text-xs px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? '⏳ Generando...' : label}
      </button>

      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {mostrarAdvertencia && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-xs font-semibold text-yellow-800">
            ⚠️ El texto ingresado no permite generar una sugerencia precisa. Te dejo alternativas generales:
          </p>
        </div>
      )}

      {sugerencias.length > 0 && (
        <div className="mt-3 space-y-2 animate-fadeIn">
          {!mostrarAdvertencia && (
            <p className="text-xs font-semibold text-gray-600">Selecciona una sugerencia:</p>
          )}
          {sugerencias.map((sugerencia, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => seleccionar(sugerencia)}
              className="w-full text-left p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-indigo-300 cursor-pointer transition-all text-sm leading-relaxed"
            >
              {sugerencia}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
