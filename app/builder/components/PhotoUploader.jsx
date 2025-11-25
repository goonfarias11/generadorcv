'use client'

import { useState, useRef } from 'react'
import { useResumeStore } from '@/store/resumeStore'

export default function PhotoUploader() {
  const { resume, updateResume } = useResumeStore()
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      setError('Solo se permiten archivos JPG o PNG')
      return
    }

    // Validar tamaño (2MB máximo)
    if (file.size > 2 * 1024 * 1024) {
      setError('La imagen no debe superar los 2MB')
      return
    }

    // Convertir a base64
    const reader = new FileReader()
    reader.onload = (event) => {
      const base64Data = event.target?.result
      updateResume({ photo: base64Data })
      setError('')
    }
    reader.onerror = () => {
      setError('Error al cargar la imagen')
    }
    reader.readAsDataURL(file)
  }

  const handleRemovePhoto = () => {
    updateResume({ photo: '' })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">
        Foto de perfil (opcional)
      </label>
      
      {resume.photo ? (
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={resume.photo}
              alt="Foto de perfil"
              className="w-32 h-32 object-cover rounded-full border-4 border-gray-200 shadow-md"
            />
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium hover:bg-indigo-200 transition-colors"
            >
              Cambiar foto
            </button>
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
            >
              Eliminar foto
            </button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
          <div className="mb-3">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Seleccionar foto
          </button>
          <p className="mt-2 text-xs text-gray-500">
            JPG o PNG, máximo 2MB
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  )
}
