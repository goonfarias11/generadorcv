import { useEffect } from 'react'

const STORAGE_KEY = 'generadorcv_autosave'

export function useAutosave(resume, updateResume) {
  // Cargar datos al iniciar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          const data = JSON.parse(saved)
          // Solo cargar si hay datos significativos
          if (data.name || data.experience?.length > 0 || data.education?.length > 0) {
            updateResume(data)
          }
        } catch (error) {
          console.error('Error loading autosave:', error)
        }
      }
    }
  }, []) // Solo al montar

  // Guardar automáticamente cuando cambie el resume
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const timer = setTimeout(() => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(resume))
        } catch (error) {
          console.error('Error saving autosave:', error)
        }
      }, 1000) // Debounce de 1 segundo

      return () => clearTimeout(timer)
    }
  }, [resume])

  // Función para limpiar el autosave
  const clearAutosave = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  // Función para verificar si hay datos guardados
  const hasAutosave = () => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem(STORAGE_KEY)
    }
    return false
  }

  return { clearAutosave, hasAutosave }
}
