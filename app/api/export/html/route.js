import { NextResponse } from 'next/server'
import { templates } from '@/lib/templates'

export async function POST(request) {
  try {
    const { resume } = await request.json()

    // Validar plan PRO
    if (!resume || resume.subscriptionStatus !== 'active') {
      if (resume?.subscriptionStatus === 'pending') {
        return new NextResponse('Tu comprobante está en validación. Te notificaremos cuando tu Plan PRO esté activo.', { status: 403 })
      }
      return new NextResponse('Plan Profesional requerido para exportar a HTML', { status: 403 })
    }

    // Generar HTML completo con estilos inline
    const template = templates[resume.template] || templates.ats
    const templateHTML = template.render(resume)

    const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CV - ${resume.name || 'Curriculum Vitae'}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    @media print {
      body {
        margin: 0;
      }
      .page-break {
        page-break-before: always;
      }
    }
  </style>
</head>
<body>
${templateHTML}
</body>
</html>`

    const buffer = Buffer.from(htmlContent, 'utf-8')

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename=CV-${resume.name || 'curriculum'}.html`
      }
    })

  } catch (error) {
    console.error('Error generating HTML:', error)
    return NextResponse.json(
      { error: 'Error generating HTML', details: error.message },
      { status: 500 }
    )
  }
}
