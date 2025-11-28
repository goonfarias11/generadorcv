import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium'

export async function POST(request) {
  let browser = null
  
  try {
    const { html } = await request.json()

    if (!html) {
      return NextResponse.json(
        { error: 'HTML is required' },
        { status: 400 }
      )
    }

    console.log('PDF Generation - HTML length:', html.length)
    console.log('PDF Generation - HTML preview:', html.substring(0, 200))

    // Configuración optimizada de Chromium para Vercel
    const isProduction = process.env.NODE_ENV === 'production'
    
    console.log('Environment:', { isProduction, NODE_ENV: process.env.NODE_ENV })
    
    // Configurar args de chromium
    const chromiumArgs = [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--single-process',
      '--no-zygote',
      '--disable-dev-tools',
    ]
    
    const launchOptions = {
      args: isProduction ? [...chromium.args, ...chromiumArgs] : chromiumArgs,
      defaultViewport: {
        width: 1920,
        height: 1080,
        deviceScaleFactor: 2,
      },
      executablePath: isProduction 
        ? await chromium.executablePath('/tmp')  // CLAVE: Especificar /tmp para Vercel
        : process.platform === 'win32'
        ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
        : process.platform === 'linux'
        ? '/usr/bin/google-chrome'
        : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      headless: chromium.headless || true,
      timeout: 30000, // Reducir timeout
    }
    
    console.log('Launching browser with executablePath:', launchOptions.executablePath)
    browser = await puppeteer.launch(launchOptions)
    const page = await browser.newPage()
    
    console.log('Setting content...')
    // Configurar el HTML con wait más simple
    await page.setContent(html, {
      waitUntil: 'domcontentloaded',
      timeout: 30000 // Reducir a 30 segundos
    })
    
    console.log('Waiting for rendering...')
    // Esperar a que las imágenes y fuentes carguen
    await page.evaluateHandle('document.fonts.ready')
    await page.waitForTimeout(500) // Reducir a 500ms para evitar timeouts en Vercel
    
    console.log('Generating PDF...')
    // Generar PDF con configuración optimizada
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: false, // Cambiar a false
      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      },
      displayHeaderFooter: false,
      scale: 1,
    })

    console.log('PDF generated, size:', pdf.length)
    await browser.close()
    browser = null

    // Devolver el PDF
    return new NextResponse(pdf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=curriculum.pdf',
        'Content-Length': pdf.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      }
    })

  } catch (error) {
    console.error('=== ERROR GENERATING PDF ===')
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    console.error('Error code:', error.code)
    
    // Asegurar que el browser se cierre en caso de error
    if (browser) {
      try {
        await browser.close()
        console.log('Browser closed after error')
      } catch (closeError) {
        console.error('Error closing browser:', closeError)
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Error generating PDF', 
        details: error.message,
        errorName: error.name,
        errorCode: error.code,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
