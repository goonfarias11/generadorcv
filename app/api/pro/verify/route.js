import { NextResponse } from 'next/server'
import { getPendingUsers, updateUserSubscription, getUserById } from '@/lib/db'

// GET: Obtener usuarios pendientes
export async function GET(request) {
  try {
    const pending = await getPendingUsers()
    
    return NextResponse.json({
      pending,
      total: pending.length
    })
  } catch (error) {
    console.error('Error getting pending users:', error)
    return NextResponse.json(
      { error: 'Error al obtener usuarios pendientes' },
      { status: 500 }
    )
  }
}

// POST: Aprobar o rechazar
export async function POST(request) {
  try {
    const { userId, action } = await request.json() // action: 'approve' o 'reject'

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'userId y action son requeridos' },
        { status: 400 }
      )
    }

    const user = await getUserById(userId)

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    let newStatus
    if (action === 'approve') {
      newStatus = 'active'
    } else if (action === 'reject') {
      newStatus = 'rejected'
    } else {
      return NextResponse.json(
        { error: 'Acción inválida. Use approve o reject' },
        { status: 400 }
      )
    }

    const updatedUser = await updateUserSubscription(userId, newStatus)

    return NextResponse.json({
      success: true,
      user: updatedUser
    })

  } catch (error) {
    console.error('Error processing verification:', error)
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
}
