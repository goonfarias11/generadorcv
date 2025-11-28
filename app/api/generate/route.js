import { NextResponse } from 'next/server'

// NOTA: Esta ruta ahora simplemente valida el HTML
// La generación del PDF se hace en el cliente usando window.print()
export async function POST(request) {
  try {
    const { html } = await request.json()

    if (!html) {
      return NextResponse.json(
        { error: 'HTML is required' },
        { status: 400 }
      )
    }

    console.log('PDF validation - HTML length:', html.length)

    // Simplemente devolver éxito
    // El cliente manejará la generación del PDF
    return NextResponse.json(
      { 
        success: true,
        message: 'HTML validated successfully. Use client-side PDF generation.'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('=== ERROR VALIDATING HTML ===')
    console.error('Error:', error.message)
    
    return NextResponse.json(
      { 
        error: 'Error validating HTML', 
        details: error.message
      },
      { status: 500 }
    )
  }
}
