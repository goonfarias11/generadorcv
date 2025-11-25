import { NextResponse } from 'next/server'

/**
 * Sistema temporal de activación con códigos
 * Válido hasta que implementes Vercel KV del Marketplace
 */

// Códigos de activación generados (cambiar después de cada uso)
const ACTIVATION_CODES = new Set([
  'PRO2024-A1B2C3',
  'PRO2024-D4E5F6',
  'PRO2024-G7H8I9',
  // Agregar más códigos según necesites
])

export async function POST(request) {
  try {
    const { code, email } = await request.json()

    if (!code || !email) {
      return NextResponse.json(
        { error: 'Código y email requeridos' },
        { status: 400 }
      )
    }

    // Validar código
    if (ACTIVATION_CODES.has(code)) {
      return NextResponse.json({
        success: true,
        subscriptionStatus: 'active',
        message: '¡Plan PRO activado! Todas las funciones desbloqueadas.'
      })
    }

    return NextResponse.json(
      { error: 'Código inválido o ya utilizado' },
      { status: 403 }
    )

  } catch (error) {
    console.error('Error activating code:', error)
    return NextResponse.json(
      { error: 'Error al activar código' },
      { status: 500 }
    )
  }
}
