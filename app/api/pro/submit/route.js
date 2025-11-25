import { NextResponse } from 'next/server'
import { generateUserId, saveUserReceipt, getUserByEmail } from '@/lib/db'

export async function POST(request) {
  try {
    const { name, email, phone, receiptUrl } = await request.json()

    if (!email || !receiptUrl) {
      return NextResponse.json(
        { error: 'Email y comprobante son requeridos' },
        { status: 400 }
      )
    }

    // Verificar si el usuario ya existe
    let user = await getUserByEmail(email)
    
    if (user) {
      // Usuario ya existe, solo actualizar el comprobante
      return NextResponse.json({
        success: true,
        userId: user.id,
        message: 'Ya tenemos tu solicitud registrada. Te notificaremos cuando sea aprobada.',
        subscriptionStatus: user.subscriptionStatus
      })
    }

    // Crear nuevo usuario
    const userId = generateUserId()
    user = await saveUserReceipt(userId, {
      name,
      email,
      phone,
      receiptUrl
    })

    return NextResponse.json({
      success: true,
      userId: user.id,
      message: 'Comprobante enviado correctamente. Recibirás una notificación cuando sea aprobado.',
      subscriptionStatus: 'pending'
    })

  } catch (error) {
    console.error('Error submitting receipt:', error)
    return NextResponse.json(
      { error: 'Error al enviar el comprobante' },
      { status: 500 }
    )
  }
}
