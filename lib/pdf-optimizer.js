/**
 * Optimizador de plantillas para generación de PDF
 * Ajusta estilos y estructura para maximizar contenido en 1 página
 */

import { makeUltraCompact } from './pdf-compact'

/**
 * Envuelve el HTML de la plantilla con estructura HTML completa
 */
export function wrapTemplateForPDF(templateHTML, templateName = 'default', isPreview = false) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Curriculum Vitae</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    
    @page {
      size: A4;
      margin: 15mm;
    }
    
    @media print {
      body {
        width: 210mm;
        min-height: 297mm;
        margin: 0;
        padding: 0;
        background: white;
      }
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.5;
      color: #000;
      background: white;
      max-width: 210mm;
      margin: 0 auto;
      ${isPreview ? 'transform: scale(0.8); transform-origin: top center; width: 125%; margin-left: -12.5%;' : ''}
    }
    
    ${isPreview ? `
    /* Indicador visual de salto de página cada 297mm (A4) */
    body::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 297mm;
      height: 2px;
      background: repeating-linear-gradient(
        90deg,
        #ef4444 0px,
        #ef4444 10px,
        transparent 10px,
        transparent 20px
      );
      z-index: 9999;
      pointer-events: none;
    }
    ` : ''}
    
    /* Prevenir saltos de página */
    h1, h2, h3, h4, h5, h6 {
      page-break-after: avoid;
      page-break-inside: avoid;
    }
    
    section, article {
      page-break-inside: avoid;
    }
    
    #cover-letter {
      page-break-before: always;
    }
  </style>
</head>
<body>
${templateHTML}
</body>
</html>`
}

/**
 * Optimiza el tamaño de las imágenes en el HTML
 */
export function optimizeImages(html) {
  // Forzar tamaño de 80x80px para fotos de perfil (ultra compacto)
  return html
    .replace(
      /(<img[^>]*alt="[Ff]oto[^"]*"[^>]*style="[^"]*)(width:\s*\d+px[^;]*;?\s*height:\s*\d+px[^;]*;?)/gi,
      '$1width: 80px !important; height: 80px !important;'
    )
    .replace(/width:\s*120px/gi, 'width: 80px')
    .replace(/height:\s*120px/gi, 'height: 80px')
    .replace(/width:\s*100px/gi, 'width: 80px')
    .replace(/height:\s*100px/gi, 'height: 80px')
}

/**
 * Compacta estilos para reducir espacio vertical - DESHABILITADO
 * Los estilos originales se mantienen para mejor legibilidad
 */
export function compactStyles(html) {
  // Ya no compactamos - devolvemos el HTML original
  // Los usuarios pueden ajustar el zoom al imprimir si necesitan
  return html
}

/**
 * Genera HTML optimizado para PDF desde una plantilla
 */
export function generatePDFHTML(resume, template) {
  console.log('=== generatePDFHTML START ===')
  
  // 1. Renderizar la plantilla
  let html = template.render(resume)
  console.log('After render - HTML length:', html.length)
  
  // 2. Ya no aplicamos compactación ultra agresiva
  // Los estilos originales se mantienen para mejor legibilidad
  console.log('Skipping ultra compact - maintaining original styles')
  
  // 3. Envolver con estructura HTML completa
  html = wrapTemplateForPDF(html, template.name)
  console.log('After wrapTemplateForPDF - HTML length:', html.length)
  
  console.log('=== generatePDFHTML END ===')
  return html
}
