import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { resume } = await request.json()

    // Validar plan PRO
    if (!resume || resume.subscriptionStatus !== 'active') {
      if (resume?.subscriptionStatus === 'pending') {
        return new NextResponse('Tu comprobante está en validación. Te notificaremos cuando tu Plan PRO esté activo.', { status: 403 })
      }
      return new NextResponse('Plan Profesional requerido para exportar a TXT', { status: 403 })
    }

    // Generar contenido en texto plano
    let txtContent = ''

    // Información personal
    txtContent += `${resume.name || 'Sin nombre'}\n`
    if (resume.jobTitle) txtContent += `${resume.jobTitle}\n`
    txtContent += `\n`
    
    if (resume.email) txtContent += `Email: ${resume.email}\n`
    if (resume.phone) txtContent += `Teléfono: ${resume.phone}\n`
    if (resume.location) txtContent += `Ubicación: ${resume.location}\n`
    
    // Enlaces profesionales
    if (resume.linkedin) txtContent += `LinkedIn: ${resume.linkedin}\n`
    if (resume.portfolio) txtContent += `Portfolio: ${resume.portfolio}\n`
    if (resume.github) txtContent += `GitHub: ${resume.github}\n`
    txtContent += `\n`

    // Perfil profesional
    if (resume.profile && resume.profile.trim()) {
      txtContent += `${'='.repeat(50)}\n`
      txtContent += `PERFIL PROFESIONAL\n`
      txtContent += `${'='.repeat(50)}\n\n`
      txtContent += `${resume.profile}\n\n`
    }

    // Experiencia laboral
    if (resume.experience && resume.experience.length > 0) {
      txtContent += `${'='.repeat(50)}\n`
      txtContent += `EXPERIENCIA LABORAL\n`
      txtContent += `${'='.repeat(50)}\n\n`
      
      resume.experience.forEach((exp, index) => {
        txtContent += `${exp.position || 'Puesto'}\n`
        txtContent += `${exp.company || 'Empresa'}\n`
        if (exp.startDate || exp.endDate) {
          txtContent += `${exp.startDate || ''} - ${exp.endDate || 'Actualidad'}\n`
        }
        if (exp.description) {
          txtContent += `\n${exp.description}\n`
        }
        if (index < resume.experience.length - 1) txtContent += `\n${'-'.repeat(40)}\n\n`
      })
      txtContent += `\n`
    }

    // Educación
    if (resume.education && resume.education.length > 0) {
      txtContent += `${'='.repeat(50)}\n`
      txtContent += `EDUCACIÓN\n`
      txtContent += `${'='.repeat(50)}\n\n`
      
      resume.education.forEach((edu, index) => {
        txtContent += `${edu.degree || 'Título'}\n`
        txtContent += `${edu.institution || 'Institución'}\n`
        if (edu.startDate || edu.endDate) {
          txtContent += `${edu.startDate || ''} - ${edu.endDate || 'Actualidad'}\n`
        }
        if (index < resume.education.length - 1) txtContent += `\n`
      })
      txtContent += `\n`
    }

    // Habilidades
    if (resume.skills && resume.skills.length > 0) {
      txtContent += `${'='.repeat(50)}\n`
      txtContent += `HABILIDADES\n`
      txtContent += `${'='.repeat(50)}\n\n`
      txtContent += resume.skills.join(' • ') + '\n\n'
    }

    // Idiomas
    if (resume.languages && resume.languages.length > 0) {
      txtContent += `${'='.repeat(50)}\n`
      txtContent += `IDIOMAS\n`
      txtContent += `${'='.repeat(50)}\n\n`
      resume.languages.forEach(lang => {
        txtContent += `${lang.language}: ${lang.level}\n`
      })
      txtContent += `\n`
    }

    // Información adicional
    if (resume.extras && resume.extras.trim()) {
      txtContent += `${'='.repeat(50)}\n`
      txtContent += `INFORMACIÓN ADICIONAL\n`
      txtContent += `${'='.repeat(50)}\n\n`
      txtContent += `${resume.extras}\n\n`
    }

    // Carta de presentación (en página separada)
    if (resume.coverLetter && resume.coverLetter.trim()) {
      txtContent += `\n${'='.repeat(50)}\n`
      txtContent += `CARTA DE PRESENTACIÓN\n`
      txtContent += `${'='.repeat(50)}\n\n`
      txtContent += `${resume.coverLetter}\n`
    }

    const buffer = Buffer.from(txtContent, 'utf-8')

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename=CV-${resume.name || 'curriculum'}.txt`
      }
    })

  } catch (error) {
    console.error('Error generating TXT:', error)
    return NextResponse.json(
      { error: 'Error generating TXT', details: error.message },
      { status: 500 }
    )
  }
}
