import { NextResponse } from 'next/server'

/**
 * API Route: Crear preferencia de Mercado Pago
 * POST /api/payments/mercadopago/create-preference
 */
export async function POST(request) {
  try {
    const { email, name } = await request.json()

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email y nombre son requeridos' },
        { status: 400 }
      )
    }

    // Verificar si Mercado Pago está configurado
    const mpToken = process.env.MERCADOPAGO_ACCESS_TOKEN
    
    console.log('🔑 Verificando token de Mercado Pago...')
    console.log('Token presente:', !!mpToken)
    console.log('Token length:', mpToken?.length || 0)
    console.log('Token primeros 10 chars:', mpToken?.substring(0, 10) || 'N/A')
    
    if (!mpToken || mpToken.trim() === '' || mpToken.includes('TEST-your_') || mpToken.includes('your_')) {
      console.error('❌ Mercado Pago NO configurado correctamente')
      return NextResponse.json(
        { 
          success: false,
          error: 'Mercado Pago temporalmente no disponible',
          message: 'El servicio de pago no está disponible. Por favor, usá el método de transferencia manual.'
        },
        { status: 503 }
      )
    }
    
    console.log('✅ Token de Mercado Pago válido')

    // Importar función dinámicamente
    const { createProPlanPreference } = await import('@/lib/payments/mercadopago')
    
    // Crear preferencia de pago
    const paymentUrl = await createProPlanPreference({ email, name })

    return NextResponse.json({ 
      success: true, 
      url: paymentUrl 
    })

  } catch (error) {
    console.error('Error creando preferencia de Mercado Pago:', error)
    return NextResponse.json(
      { 
        error: 'Error al crear preferencia de pago',
        message: error.message || 'Por favor, intenta con otro método de pago.'
      },
      { status: 500 }
    )
  }
}
