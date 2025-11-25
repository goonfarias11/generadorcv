import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { resume } = await request.json()

    // Validar plan PRO
    if (!resume || resume.subscriptionStatus !== 'active') {
      if (resume?.subscriptionStatus === 'pending') {
        return new NextResponse('Tu comprobante está en validación. Te notificaremos cuando tu Plan PRO esté activo.', { status: 403 })
      }
      return new NextResponse('Plan Profesional requerido para exportar a JSON', { status: 403 })
    }

    // Serializar el resume completo como JSON
    const jsonContent = JSON.stringify(resume, null, 2)
    const buffer = Buffer.from(jsonContent, 'utf-8')

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename=CV-${resume.name || 'curriculum'}.json`
      }
    })

  } catch (error) {
    console.error('Error generating JSON:', error)
    return NextResponse.json(
      { error: 'Error generating JSON', details: error.message },
      { status: 500 }
    )
  }
}
