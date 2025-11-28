import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium'
import { templates } from '@/lib/templates'

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

    // Validar formato (png o jpg)
    if (!['png', 'jpg', 'jpeg'].includes(format.toLowerCase())) {
      return NextResponse.json(
        { error: 'Formato inválido. Use: png, jpg o jpeg' },
        { status: 400 }
      )
    }

    const template = templates[resume.template] || templates.ats
    const templateHTML = template.render(resume)

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
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
              width: 816px;
              background: white;
            }
          </style>
        </head>
        <body>
          ${templateHTML}
        </body>
      </html>
    `

    // Configuración de Chromium para Vercel
    const isProduction = process.env.NODE_ENV === 'production'
    
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    })

    const page = await browser.newPage()
    await page.setViewport({ width: 816, height: 1056, deviceScaleFactor: 2 })
    await page.setContent(html, { waitUntil: 'networkidle0' })

    // Capturar screenshot
    const screenshot = await page.screenshot({
      type: format.toLowerCase() === 'png' ? 'png' : 'jpeg',
      quality: format.toLowerCase() === 'png' ? undefined : 90,
      fullPage: true
    })

    await browser.close()

    const imageFormat = format.toLowerCase() === 'png' ? 'png' : 'jpeg'
    const mimeType = `image/${imageFormat}`
    const extension = format.toLowerCase() === 'png' ? 'png' : 'jpg'

    return new NextResponse(screenshot, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename=CV-${resume.name || 'curriculum'}.${extension}`
      }
    })

  } catch (error) {
    console.error('Error generating image:', error)
    return NextResponse.json(
      { error: 'Error generating image', details: error.message },
      { status: 500 }
    )
  }
}
