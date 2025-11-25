'use client'

import { useState, useEffect } from 'react'

export default function AdminReceipts() {
  const [pendingUsers, setPendingUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(null)

  useEffect(() => {
    loadPendingUsers()
  }, [])

  const loadPendingUsers = async () => {
    try {
      const response = await fetch('/api/pro/verify')
      const data = await response.json()
      setPendingUsers(data.pending || [])
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (userId) => {
    if (!confirm('¿Confirmar aprobación del Plan PRO para este usuario?')) {
      return
    }

    setProcessing(userId)

    try {
      const response = await fetch('/api/pro/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'approve' })
      })

      if (response.ok) {
        alert('✓ Plan PRO aprobado correctamente')
        loadPendingUsers()
      } else {
        alert('Error al aprobar el usuario')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al procesar la solicitud')
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (userId) => {
    if (!confirm('¿Confirmar rechazo del comprobante?')) {
      return
    }

    setProcessing(userId)

    try {
      const response = await fetch('/api/pro/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'reject' })
      })

      if (response.ok) {
        alert('✓ Comprobante rechazado')
        loadPendingUsers()
      } else {
        alert('Error al rechazar')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al procesar la solicitud')
    } finally {
      setProcessing(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔐 Panel de Administración
          </h1>
          <p className="text-gray-600">
            Validación de comprobantes de pago del Plan PRO
          </p>
        </div>

        {pendingUsers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">✓</div>
            <p className="text-xl text-gray-600">
              No hay comprobantes pendientes de validación
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <p className="text-indigo-800 font-semibold">
                📋 {pendingUsers.length} solicitud{pendingUsers.length !== 1 ? 'es' : ''} pendiente{pendingUsers.length !== 1 ? 's' : ''}
              </p>
            </div>

            {pendingUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Información del usuario */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Información del Usuario
                    </h3>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Nombre</p>
                        <p className="text-gray-900 font-semibold">{user.name}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Email</p>
                        <p className="text-gray-900">{user.email}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Fecha de envío</p>
                        <p className="text-gray-900">
                          {new Date(user.submittedAt).toLocaleString('es-AR')}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 uppercase">Estado actual</p>
                        <span className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold">
                          ⏳ Pendiente
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Comprobante */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Comprobante de Pago
                    </h3>
                    
                    {user.receiptUrl && (
                      <div className="space-y-3">
                        {user.receiptUrl.match(/\.(jpg|jpeg|png)$/i) ? (
                          <div className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                            <img
                              src={user.receiptUrl}
                              alt="Comprobante"
                              className="max-w-full h-auto rounded max-h-64 mx-auto"
                            />
                          </div>
                        ) : (
                          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <p className="text-gray-600 text-center mb-2">📄 Archivo PDF</p>
                            <a
                              href={user.receiptUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-800 underline text-sm block text-center"
                            >
                              Abrir comprobante
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
                  <button
                    onClick={() => handleApprove(user.id)}
                    disabled={processing === user.id}
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    {processing === user.id ? (
                      <>⏳ Procesando...</>
                    ) : (
                      <>✓ Aprobar Plan PRO</>
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleReject(user.id)}
                    disabled={processing === user.id}
                    className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    {processing === user.id ? (
                      <>⏳ Procesando...</>
                    ) : (
                      <>✕ Rechazar</>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={loadPendingUsers}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            🔄 Actualizar lista
          </button>
        </div>
      </div>
    </div>
  )
}
