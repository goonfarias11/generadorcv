'use client'

/**
 * Componente: Modal de Upgrade a PRO
 * Muestra cuando el usuario intenta usar funciones premium sin tener plan PRO
 */

import { useState } from 'react'

export default function UpgradeModal({ isOpen, onClose, featureName }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl animate-scale-in">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-6 rounded-t-2xl text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <h2 className="text-2xl font-bold mb-2">
            Función PRO Exclusiva
          </h2>
          <p className="text-white/90 text-sm">
            {featureName || 'Esta función'} requiere el Plan Profesional
          </p>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-5 mb-6">
            <h3 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Con el Plan PRO obtenés:
            </h3>
            <ul className="space-y-3">
              {[
                '8 plantillas premium exclusivas',
                'Exportación sin marca de agua',
                'Descarga en PDF, DOCX, PNG, JPG',
                'Carta de presentación profesional',
                'Análisis completo del CV',
                'Soporte prioritario por email'
              ].map((benefit, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm text-indigo-800">
                  <svg className="w-5 h-5 text-indigo-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Precio */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 mb-6 text-center">
            <p className="text-sm text-neutral-600 mb-2">Pago único</p>
            <div className="flex items-baseline justify-center gap-3">
              <div>
                <span className="text-4xl font-bold text-neutral-900">$2000</span>
                <span className="text-neutral-600 text-sm ml-1">ARS</span>
              </div>
              <div className="text-neutral-400">o</div>
              <div>
                <span className="text-4xl font-bold text-neutral-900">$9.99</span>
                <span className="text-neutral-600 text-sm ml-1">USD</span>
              </div>
            </div>
            <p className="text-xs text-neutral-500 mt-2">Sin suscripciones • Acceso de por vida</p>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                onClose()
                // Scroll hacia la sección de planes
                const planSection = document.querySelector('[data-plan-selection]')
                if (planSection) {
                  planSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }
              }}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              Activar Plan PRO
            </button>
            <button
              onClick={onClose}
              className="sm:w-auto px-6 py-3 bg-neutral-100 text-neutral-700 rounded-xl font-semibold hover:bg-neutral-200 transition-all"
            >
              Ahora no
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
