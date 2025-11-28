import { NextResponse } from 'next/server'
import { templates } from '@/lib/templates'

// NOTA: Exportación de imágenes deshabilitada temporalmente
// Requiere Puppeteer que no funciona bien en Vercel
export async function POST(request) {
  try {
    const { resume, format = 'png' } = await request.json()

    // Validar plan PRO
    if (!resume || resume.subscriptionStatus !== 'active') {
      if (resume?.subscriptionStatus === 'pending') {
        return new NextResponse('Tu comprobante está en validación. Te notificaremos cuando tu Plan PRO esté activo.', { status: 403 })
      }
      return new NextResponse('Plan Profesional requerido para exportar a imagen', { status: 403 })
    }

    // Por ahora, retornar error indicando que está en desarrollo
    return NextResponse.json(
      { 
        error: 'Exportación de imágenes temporalmente deshabilitada',
        message: 'Por favor usa la exportación a PDF (Ctrl+P) mientras trabajamos en esta función.'
      },
      { status: 501 } // Not Implemented
    )

  } catch (error) {
    console.error('Error in image export:', error)
    return NextResponse.json(
      { error: 'Error al exportar imagen', details: error.message },
      { status: 500 }
    )
  }
}
    console.error('Error generating image:', error)
    return NextResponse.json(
      { error: 'Error generating image', details: error.message },
      { status: 500 }
    )
  }
}
