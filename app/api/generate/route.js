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

    // Configuración optimizada de Chromium para Vercel
    const isProduction = process.env.NODE_ENV === 'production'
    
    const launchOptions = {
      args: isProduction ? chromium.args : [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-software-rasterizer',
        '--disable-dev-tools',
      ],
      defaultViewport: {
        width: 1920,
        height: 1080,
        deviceScaleFactor: 2, // Para mejor calidad de PDF
      },
      executablePath: isProduction 
        ? await chromium.executablePath()
        : process.platform === 'win32'
        ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
        : process.platform === 'linux'
        ? '/usr/bin/google-chrome'
        : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      headless: chromium.headless || true,
      timeout: 30000, // 30 segundos timeout
    }
    
    browser = await puppeteer.launch(launchOptions)
    const page = await browser.newPage()
    
    // Configurar el HTML con wait mejorado
    await page.setContent(html, {
      waitUntil: ['networkidle0', 'domcontentloaded'],
      timeout: 30000
    })
    
    // Esperar a que las imágenes carguen
    await page.evaluateHandle('document.fonts.ready')
    await page.waitForTimeout(1000) // Dar tiempo adicional para renderizado
    
    // Generar PDF con configuración optimizada
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      },
      displayHeaderFooter: false,
      scale: 1, // Escala 1:1 para precisión
    })

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
    console.error('Error generating PDF:', error)
    
    // Asegurar que el browser se cierre en caso de error
    if (browser) {
      try {
        await browser.close()
      } catch (closeError) {
        console.error('Error closing browser:', closeError)
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Error generating PDF', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
