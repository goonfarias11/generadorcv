'use client'

import { useState } from 'react'

/**
 * Componente: Selector de Método de Pago
 * Muestra las opciones de pago disponibles para el Plan PRO
 */
export default function PaymentMethodSelector({ resume, onClose }) {
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(null)

  const handleMercadoPago = async () => {
    // Validación estricta de campos requeridos
    const nombre = resume?.name?.trim()
    const correo = resume?.email?.trim()

    if (!nombre || nombre === '') {
      setError('Por favor, completá tu NOMBRE en la sección Personal (arriba)')
      return
    }

    if (!correo || correo === '') {
      setError('Por favor, completá tu EMAIL en la sección Personal (arriba)')
      return
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(correo)) {
      setError('Por favor, ingresá un email válido en la sección Personal')
      return
    }

    setProcessing(true)
    setError(null)

    try {
      console.log('🛒 Iniciando proceso de pago con Mercado Pago...')
      console.log('📧 Email:', correo)
      console.log('👤 Nombre:', nombre)
      
      const response = await fetch('/api/payments/mercadopago/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: correo,
          name: nombre
        })
      })

      console.log('📡 Respuesta recibida - Status:', response.status, response.statusText)
      
      const data = await response.json()
      console.log('📦 Datos recibidos:', data)

      if (response.ok && data.success && data.url) {
        console.log('✅ Redirigiendo a Mercado Pago:', data.url)
        window.location.href = data.url
      } else {
        console.error('❌ Error en respuesta:', data)
        throw new Error(data.message || data.error || 'Mercado Pago temporalmente no disponible')
      }

    } catch (error) {
      console.error('❌ Error completo:', error)
      setError(error.message || 'Error al procesar el pago con Mercado Pago')
      setProcessing(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-display font-semibold text-neutral-900">
          Seleccioná tu método de pago:
        </h4>
        {onClose && (
          <button
            onClick={onClose}
            className="text-neutral-600 hover:text-neutral-800"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Aviso de datos requeridos */}
      {(!resume?.name?.trim() || !resume?.email?.trim()) && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-yellow-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-semibold text-yellow-800 text-sm">
                ⚠️ Completá estos datos antes de continuar:
              </p>
              <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                {!resume?.name?.trim() && (
                  <li className="flex items-center gap-2">
                    <span className="text-red-600">✗</span> Tu <strong>NOMBRE</strong> en la sección Personal
                  </li>
                )}
                {!resume?.email?.trim() && (
                  <li className="flex items-center gap-2">
                    <span className="text-red-600">✗</span> Tu <strong>EMAIL</strong> en la sección Personal
                  </li>
                )}
              </ul>
              <p className="mt-2 text-xs text-yellow-600">
                👆 Scrolleá hacia arriba y completá la sección "Personal" primero
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">{error}</p>
              <p className="text-xs text-red-600 mt-1">
                Probá con el método de transferencia manual más abajo.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mercado Pago */}
      <button
        onClick={handleMercadoPago}
        disabled={processing}
        className="w-full p-5 bg-white border-2 border-neutral-200 rounded-xl hover:border-blue-400 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <span className="text-2xl font-bold text-blue-600">MP</span>
            </div>
            <div className="text-left">
              <p className="font-bold text-neutral-900 text-lg">Mercado Pago</p>
              <p className="text-sm text-neutral-600">Tarjeta, débito o transferencia</p>
              <p className="text-xs font-semibold text-blue-600 mt-1">🇦🇷 $2000 ARS (pago único)</p>
            </div>
          </div>
          <svg className="w-6 h-6 text-neutral-600 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </button>

      {processing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-3">
          <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-sm font-medium text-blue-800">Redirigiendo a Mercado Pago...</p>
        </div>
      )}
    </div>
  )
}
