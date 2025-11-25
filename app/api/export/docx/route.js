import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { html, resume } = await request.json()

    // Validar plan PRO
    if (!resume || resume.subscriptionStatus !== 'active') {
      if (resume?.subscriptionStatus === 'pending') {
        return new NextResponse('Tu comprobante está en validación. Te notificaremos cuando tu Plan PRO esté activo.', { status: 403 })
      }
      return new NextResponse('Plan Profesional requerido para exportar a DOCX', { status: 403 })
    }

    if (!html) {
      return NextResponse.json(
        { error: 'HTML is required' },
        { status: 400 }
      )
    }

    // Convertir HTML a DOCX simplificado
    // Para una implementación completa, se necesitaría una librería como html-docx-js
    // Por ahora, creamos un documento RTF que Word puede abrir
    
    const rtfContent = `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0\\fswiss Arial;}}
{\\colortbl;\\red0\\green0\\blue0;}
\\pard\\plain\\f0\\fs24
${htmlToRtf(html)}
}`

    const buffer = Buffer.from(rtfContent, 'utf-8')

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/rtf',
        'Content-Disposition': `attachment; filename=CV-${resume?.name || 'curriculum'}.rtf`
      }
    })

  } catch (error) {
    console.error('Error generating DOCX:', error)
    return NextResponse.json(
      { error: 'Error generating DOCX', details: error.message },
      { status: 500 }
    )
  }
}

function htmlToRtf(html) {
  // Limpieza básica de HTML a texto
  let text = html
    .replace(/<style[^>]*>.*?<\/style>/gs, '')
    .replace(/<script[^>]*>.*?<\/script>/gs, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n\s*\n/g, '\\par\\par ')
    .replace(/\n/g, '\\par ')
  
  return text
}
