/**
 * AutosaveIndicator Component
 * Visual feedback for autosave status
 */

'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Check, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

interface AutosaveIndicatorProps {
  isSaving: boolean
  lastSaved: Date | null
}

export default function AutosaveIndicator({ isSaving, lastSaved }: AutosaveIndicatorProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (isSaving || lastSaved) {
      setShow(true)
      const timer = setTimeout(() => {
        if (!isSaving) setShow(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isSaving, lastSaved])

  if (!show) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 rounded-lg shadow-lg"
      >
        {isSaving ? (
          <>
            <Loader2 className="w-4 h-4 text-primary-600 animate-spin" />
            <span className="text-sm font-medium text-neutral-700">Guardando...</span>
          </>
        ) : (
          <>
            <Check className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-neutral-700">Guardado ✓</span>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
