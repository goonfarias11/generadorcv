// Configuración de Puppeteer para producción (Vercel)
// Detecta automáticamente si está en desarrollo o en serverless

let chrome;
let puppeteer;

if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
  // Producción: usar chrome-aws-lambda
  try {
    chrome = require('chrome-aws-lambda');
    puppeteer = require('puppeteer-core');
  } catch (error) {
    console.warn('chrome-aws-lambda no disponible, usando puppeteer estándar');
    puppeteer = require('puppeteer');
  }
} else {
  // Desarrollo: usar puppeteer normal
  puppeteer = require('puppeteer');
}

export async function getBrowser() {
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    if (chrome) {
      // Vercel/Production con chrome-aws-lambda
      return await puppeteer.launch({
        args: chrome.args,
        defaultViewport: chrome.defaultViewport,
        executablePath: await chrome.executablePath,
        headless: chrome.headless,
        ignoreHTTPSErrors: true,
      });
    }
  }
  
  // Desarrollo local
  return await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ]
  });
}

export { puppeteer };
