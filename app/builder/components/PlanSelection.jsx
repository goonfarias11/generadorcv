'use client'

import { useState } from 'react'
import { useResumeStore } from '@/store/resumeStore'
import PaymentMethodSelector from './PaymentMethodSelector'

export default function PlanSelection() {
  const { resume, updateResume } = useResumeStore()
  const [showPayment, setShowPayment] = useState(false)
  const [receiptFile, setReceiptFile] = useState(null)
  const [receiptPreview, setReceiptPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [activationCode, setActivationCode] = useState('')
  const [activating, setActivating] = useState(false)

  const selectFreePlan = () => {
    updateResume({ 
      plan: 'free', 
      template: 'ats',
      subscriptionStatus: 'none',
      receiptUrl: null
    })
  }

  const selectProPlan = () => {
    setShowPayment(true)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('El archivo es demasiado grande. Máximo 5MB')
      return
    }

    // Validar tipo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      alert('Formato no válido. Solo se permiten JPG, PNG o PDF')
      return
    }

    setReceiptFile(file)

    // Preview si es imagen
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setReceiptPreview(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      setReceiptPreview(null)
    }
  }

  const submitReceipt = async () => {
    if (!receiptFile) {
      alert('Por favor, adjuntá el comprobante de pago')
      return
    }

    if (!resume.name || !resume.email) {
      alert('Por favor, completá tu nombre y email en la sección Personal antes de enviar el comprobante')
      return
    }

    setUploading(true)

    try {
      // 1. Subir archivo
      const formData = new FormData()
      formData.append('receipt', receiptFile)

      const uploadResponse = await fetch('/api/pro/receipt/upload', {
        method: 'POST',
        body: formData
      })

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json()
        throw new Error(error.error || 'Error al subir el comprobante')
      }

      const { url } = await uploadResponse.json()

      // 2. Registrar solicitud
      const submitResponse = await fetch('/api/pro/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: resume.name,
          email: resume.email,
          receiptUrl: url
        })
      })

      if (!submitResponse.ok) {
        throw new Error('Error al enviar la solicitud')
      }

      // 3. Actualizar estado local
      updateResume({
        subscriptionStatus: 'pending',
        receiptUrl: url
      })

      setShowPayment(false)

    } catch (error) {
      console.error('Error:', error)
      alert(error.message || 'Hubo un error al enviar el comprobante. Por favor, intenta de nuevo.')
    } finally {
      setUploading(false)
    }
  }

  const activateWithCode = async () => {
    if (!activationCode.trim()) {
      alert('Ingresa un código de activación')
      return
    }

    setActivating(true)
    try {
      const response = await fetch('/api/pro/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: activationCode.trim(),
          email: resume.personalInfo?.email || 'sin-email'
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        updateResume({
          subscriptionStatus: 'active',
          plan: 'professional'
        })
        alert('✅ ' + data.message)
        setShowPayment(false)
      } else {
        alert('❌ ' + (data.error || 'Código inválido'))
      }
    } catch (error) {
      alert('Error al activar código')
    } finally {
      setActivating(false)
    }
  }

  // Estado: Plan PRO activo
  if (resume.subscriptionStatus === 'active') {
    return (
      <div className="card-premium p-6 border-2 border-primary-200 bg-gradient-to-br from-primary-50 to-purple-50 animate-scale-in">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-glow">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-display font-bold text-primary-900 mb-1">
              Plan Profesional Activado ✨
            </h3>
            <p className="text-sm text-primary-700 leading-relaxed">
              Acceso completo a todas las plantillas premium, exportación en múltiples formatos y sin marca de agua. ¡Aprovecha al máximo tu CV!
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="badge-primary">Todas las plantillas</span>
              <span className="badge-primary">Sin watermark</span>
              <span className="badge-primary">Exportación ilimitada</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Estado: Comprobante en validación
  if (resume.subscriptionStatus === 'pending') {
    return (
      <div className="card-premium p-6 border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 animate-scale-in">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center animate-pulse">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-display font-bold text-amber-900 mb-1">
              Comprobante enviado ✓
            </h3>
            <p className="text-sm text-amber-700 leading-relaxed mb-2">
              Estamos validando tu pago. Este proceso puede demorar hasta 12 horas laborables.
            </p>
            <p className="text-xs text-amber-600 font-medium">
              💌 Te notificaremos por email cuando tu Plan PRO esté activo
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Formulario de pago
  if (showPayment) {
    return (
      <div className="card-premium p-8 animate-scale-in">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center shadow-glow">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-display font-bold text-neutral-900">
              Activar Plan Profesional
            </h3>
          </div>
          <button
            onClick={() => setShowPayment(false)}
            className="text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Beneficios del Plan PRO */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-5 mb-6">
          <h4 className="font-display font-bold text-indigo-900 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Con el Plan PRO obtenés:
          </h4>
          <ul className="grid grid-cols-2 gap-3">
            {[
              '8 plantillas premium',
              'Sin marca de agua',
              'PDF, DOCX, PNG, JPG',
              'Carta de presentación',
              'Análisis completo',
              'Soporte prioritario'
            ].map((benefit, idx) => (
              <li key={idx} className="flex items-center gap-2 text-xs text-indigo-800">
                <svg className="w-4 h-4 text-indigo-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Selector de método de pago */}
        <PaymentMethodSelector resume={resume} />

        {/* Separador */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-neutral-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 py-1 bg-white text-sm font-medium text-neutral-500 rounded-full border-2 border-neutral-200">
              o transferencia manual
            </span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-primary-50 to-purple-50 border-2 border-primary-200 rounded-2xl p-5 mb-5">
          <p className="font-display font-semibold text-primary-900 mb-3 flex items-center gap-2">
            <span className="text-lg">📋</span>
            Instrucciones de pago:
          </p>
          <ol className="text-sm text-primary-800 space-y-2.5 ml-1">
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
              <span>Abrí tu app de <strong>Mercado Pago</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
              <span>Enviá <strong className="text-primary-900">$2000 ARS</strong> por transferencia</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
              <span>Adjuntá el comprobante abajo</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
              <span>Hacé clic en <strong>"Enviar comprobante"</strong></span>
            </li>
          </ol>
        </div>

        <div className="bg-white border-2 border-neutral-200 rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💵</span>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-600">Monto a transferir</p>
              <p className="text-3xl font-display font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                $2000 <span className="text-xl">ARS</span>
              </p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
              <span className="font-semibold text-neutral-700">Alias de Mercado Pago</span>
              <code className="bg-primary-100 text-primary-700 px-3 py-1.5 rounded-lg font-mono font-semibold">generadorcv</code>
            </div>
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
              <span className="font-semibold text-neutral-700">CBU</span>
              <code className="bg-primary-100 text-primary-700 px-3 py-1.5 rounded-lg font-mono text-xs font-semibold">0000003100095184668063</code>
            </div>
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
              <span className="font-semibold text-neutral-700">Titular</span>
              <span className="font-semibold text-neutral-900">Gonzalo Farias</span>
            </div>
          </div>
        </div>

        {/* Campo de adjuntar comprobante */}
        <div className="mb-6">
          <label className="block text-sm font-display font-semibold text-neutral-900 mb-3">
            📎 Adjuntar comprobante de pago *
          </label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-neutral-600 
                     file:mr-4 file:py-3 file:px-6 file:rounded-xl 
                     file:border-2 file:border-primary-200 file:text-sm file:font-semibold 
                     file:bg-primary-50 file:text-primary-700 
                     hover:file:bg-primary-100 hover:file:border-primary-300
                     cursor-pointer transition-all"
          />
          <p className="text-xs text-neutral-500 mt-2 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Formatos permitidos: JPG, PNG, PDF. Máximo 5MB
          </p>

          {/* Preview de imagen */}
          {receiptPreview && (
            <div className="mt-4 border-2 border-primary-200 rounded-2xl p-4 bg-gradient-to-br from-primary-50 to-purple-50 animate-scale-in">
              <p className="text-xs font-semibold text-primary-700 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Vista previa:
              </p>
              <img 
                src={receiptPreview} 
                alt="Preview" 
                className="max-w-full h-auto max-h-48 rounded-xl shadow-lg"
              />
            </div>
          )}

          {/* Archivo PDF seleccionado */}
          {receiptFile && !receiptPreview && (
            <div className="mt-4 bg-green-50 border-2 border-green-200 rounded-2xl p-4 animate-scale-in">
              <p className="text-sm text-green-800 flex items-center gap-3">
                <span className="text-2xl">📄</span>
                <span className="font-semibold">{receiptFile.name}</span>
                <svg className="w-5 h-5 ml-auto text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={submitReceipt}
            disabled={!receiptFile || uploading}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Enviar comprobante
              </>
            )}
          </button>
          <button
            onClick={() => setShowPayment(false)}
            disabled={uploading}
            className="btn-secondary disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>

        {/* Separador */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-neutral-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 py-1 bg-white text-sm font-medium text-neutral-500 rounded-full border-2 border-neutral-200">
              o activa con código
            </span>
          </div>
        </div>

        {/* Campo de código de activación */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-display font-bold text-green-900 mb-1">
                ¿Ya realizaste el pago?
              </p>
              <p className="text-xs text-green-700 leading-relaxed">
                Ingresa el código de activación que te enviamos por WhatsApp o email
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              value={activationCode}
              onChange={(e) => setActivationCode(e.target.value.toUpperCase())}
              placeholder="PRO2024-XXXXXX"
              className="flex-1 input-premium text-sm font-mono font-semibold uppercase"
              disabled={activating}
            />
            <button
              onClick={activateWithCode}
              disabled={!activationCode.trim() || activating}
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold shadow-md hover:bg-green-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {activating ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  Activar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-neutral-900 mb-2">
          Elegí tu plan
        </h3>
        <p className="text-sm text-neutral-600">Seleccioná el que mejor se adapte a tus necesidades</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {/* Plan Gratuito */}
        <div 
          className={`relative bg-white rounded-xl p-5 border-2 transition-all duration-200 cursor-pointer ${
            resume.plan === 'free' 
              ? 'border-neutral-400 shadow-md' 
              : 'border-neutral-200 hover:border-neutral-300'
          }`} 
          onClick={selectFreePlan}
        >
          <div className="mb-4">
            <h4 className="text-lg font-bold text-neutral-900 mb-1">Gratis</h4>
            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="text-2xl font-bold text-green-600">$0</span>
              <span className="text-xs text-neutral-500">para siempre</span>
            </div>
          </div>
          
          <ul className="space-y-2 mb-5">
            <li className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-neutral-700">Exportar a PDF</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-neutral-700">1 plantilla</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="text-neutral-400">Con marca de agua</span>
            </li>
          </ul>

          <button className={`w-full py-2 rounded-lg font-semibold text-sm transition-all ${
            resume.plan === 'free'
              ? 'bg-neutral-900 text-white'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          }`}>
            {resume.plan === 'free' ? '✓ Seleccionado' : 'Usar Gratis'}
          </button>
        </div>

        {/* Plan PRO */}
        <div 
          onClick={selectProPlan}
          className="relative bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 border-2 border-indigo-300 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
        >
          <div className="absolute -top-2 left-1/2 -translate-x-1/2">
            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">
              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              RECOMENDADO
            </span>
          </div>
          
          <div className="mb-4 mt-2">
            <h4 className="text-lg font-bold text-neutral-900 mb-1">PRO</h4>
            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">$2000</span>
              <span className="text-xs text-neutral-600">pago único</span>
            </div>
          </div>
          
          <ul className="space-y-2 mb-5">
            <li className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-indigo-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-neutral-800 font-medium">8 plantillas premium</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-indigo-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-neutral-800 font-medium">Sin marca de agua</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-indigo-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-neutral-800">PDF, DOCX, PNG, JPG</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-indigo-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-neutral-800">Carta de presentación</span>
            </li>
          </ul>

          <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md text-sm">
            Activar PRO
          </button>
        </div>
      </div>

      {resume.plan === 'free' && (
        <div className="mt-4 bg-amber-50 border-l-4 border-amber-400 rounded-lg p-3.5 max-w-4xl mx-auto">
          <div className="flex items-start gap-2.5">
            <svg className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <p className="text-xs font-semibold text-amber-900 mb-0.5">Nota sobre el Plan Gratuito</p>
              <p className="text-xs text-amber-800">
                Tu CV incluirá una marca de agua. Para un CV 100% profesional sin marcas, activá el Plan PRO.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
