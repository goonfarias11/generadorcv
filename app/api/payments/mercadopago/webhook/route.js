import { NextResponse } from 'next/server'
import { verifyPaymentStatus } from '@/lib/payments/mercadopago'

/**
 * API Route: Webhook de Mercado Pago
 * POST /api/payments/mercadopago/webhook
 */
export async function POST(request) {
  try {
    const { type, data } = await request.json()

    // Mercado Pago envía notificaciones de tipo "payment"
    if (type === 'payment') {
      const paymentId = data.id

      // Verificar estado del pago
      const paymentStatus = await verifyPaymentStatus(paymentId)

      console.log('Estado de pago:', paymentStatus)

      // TODO: Activar plan PRO en la base de datos si está aprobado
      if (paymentStatus.approved) {
        // await activateProPlan(paymentStatus.email)
        console.log(`✅ Pago aprobado para: ${paymentStatus.email}`)
      }

      return NextResponse.json({ received: true })
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Error en webhook de Mercado Pago:', error)
    return NextResponse.json(
      { error: 'Error procesando webhook' },
      { status: 400 }
    )
  }
}

/**
 * GET handler para verificar estado
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const paymentId = searchParams.get('payment_id')
  const status = searchParams.get('status')

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL}/builder?payment=${status}&payment_id=${paymentId}`
  )
}
