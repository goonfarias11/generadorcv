'use client'

import { useState } from 'react'
import ResumePreview from './ResumePreview'
import { X } from 'lucide-react'

export default function PreviewModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-premium flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-4 flex justify-between items-center">
          <h3 className="text-lg font-display font-bold text-white">Vista Previa</h3>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <ResumePreview />
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-200 p-4 bg-neutral-50">
          <button
            onClick={onClose}
            className="btn-secondary w-full py-3"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
