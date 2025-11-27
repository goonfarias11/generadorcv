/**
 * Optimizador de plantillas para generación de PDF
 * Ajusta estilos y estructura para maximizar contenido en 1 página
 */

/**
 * Envuelve el HTML de la plantilla con estructura HTML completa
 */
export function wrapTemplateForPDF(templateHTML, templateName = 'default') {
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
      margin: 0;
    }
    
    body {
      width: 210mm;
      min-height: 297mm;
      margin: 0;
      padding: 0;
      background: white;
    }
    
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
 * Compacta estilos para reducir espacio vertical - ULTRA AGRESIVO
 * Reemplaza valores inline directamente en el HTML
 */
export function compactStyles(html) {
  return html
    // FOTO - Forzar 80x80px en todos los casos
    .replace(/width:\s*120px/gi, 'width: 80px')
    .replace(/height:\s*120px/gi, 'height: 80px')
    .replace(/width:\s*100px/gi, 'width: 80px')
    .replace(/height:\s*100px/gi, 'height: 80px')
    
    // FUENTES - Reducir todos los tamaños
    .replace(/font-size:\s*32px/gi, 'font-size: 18px')
    .replace(/font-size:\s*28px/gi, 'font-size: 18px')
    .replace(/font-size:\s*26px/gi, 'font-size: 16px')
    .replace(/font-size:\s*24px/gi, 'font-size: 16px')
    .replace(/font-size:\s*22px/gi, 'font-size: 14px')
    .replace(/font-size:\s*20px/gi, 'font-size: 14px')
    .replace(/font-size:\s*18px/gi, 'font-size: 11px')
    .replace(/font-size:\s*16px/gi, 'font-size: 10px')
    .replace(/font-size:\s*15px/gi, 'font-size: 10px')
    .replace(/font-size:\s*14px/gi, 'font-size: 9px')
    .replace(/font-size:\s*13px/gi, 'font-size: 9px')
    .replace(/font-size:\s*12px/gi, 'font-size: 9px')
    
    // PADDING - Reducir todos agresivamente
    .replace(/padding:\s*60px/gi, 'padding: 12px')
    .replace(/padding:\s*50px/gi, 'padding: 12px')
    .replace(/padding:\s*40px/gi, 'padding: 10px')
    .replace(/padding:\s*30px/gi, 'padding: 8px')
    .replace(/padding:\s*20px/gi, 'padding: 6px')
    .replace(/padding-bottom:\s*20px/gi, 'padding-bottom: 4px')
    .replace(/padding-bottom:\s*15px/gi, 'padding-bottom: 3px')
    .replace(/padding-bottom:\s*10px/gi, 'padding-bottom: 2px')
    .replace(/padding-bottom:\s*5px/gi, 'padding-bottom: 2px')
    
    // MARGIN - Reducir todos agresivamente
    .replace(/margin-bottom:\s*60px/gi, 'margin-bottom: 6px')
    .replace(/margin-bottom:\s*50px/gi, 'margin-bottom: 6px')
    .replace(/margin-bottom:\s*40px/gi, 'margin-bottom: 5px')
    .replace(/margin-bottom:\s*35px/gi, 'margin-bottom: 5px')
    .replace(/margin-bottom:\s*30px/gi, 'margin-bottom: 4px')
    .replace(/margin-bottom:\s*25px/gi, 'margin-bottom: 4px')
    .replace(/margin-bottom:\s*20px/gi, 'margin-bottom: 3px')
    .replace(/margin-bottom:\s*15px/gi, 'margin-bottom: 2px')
    .replace(/margin-bottom:\s*12px/gi, 'margin-bottom: 2px')
    .replace(/margin-bottom:\s*10px/gi, 'margin-bottom: 2px')
    .replace(/margin:\s*0\s+0\s+10px\s+0/gi, 'margin: 0 0 2px 0')
    .replace(/margin:\s*0\s+0\s+5px\s+0/gi, 'margin: 0 0 2px 0')
    .replace(/margin:\s*8px\s+0/gi, 'margin: 2px 0')
    .replace(/margin:\s*12px\s+0/gi, 'margin: 2px 0')
    
    // LINE-HEIGHT - Ultra compacto
    .replace(/line-height:\s*2\.\d+/gi, 'line-height: 1.1')
    .replace(/line-height:\s*1\.9/gi, 'line-height: 1.1')
    .replace(/line-height:\s*1\.8/gi, 'line-height: 1.1')
    .replace(/line-height:\s*1\.7/gi, 'line-height: 1.1')
    .replace(/line-height:\s*1\.6/gi, 'line-height: 1.1')
    .replace(/line-height:\s*1\.5/gi, 'line-height: 1.1')
    .replace(/line-height:\s*1\.4/gi, 'line-height: 1.1')
    .replace(/line-height:\s*1\.3/gi, 'line-height: 1.1')
    
    // BORDES - Más delgados
    .replace(/border:\s*4px/gi, 'border: 1px')
    .replace(/border:\s*3px/gi, 'border: 1px')
    .replace(/border-bottom:\s*2px/gi, 'border-bottom: 1px')
}

/**
 * Genera HTML optimizado para PDF desde una plantilla
 */
export function generatePDFHTML(resume, template) {
  console.log('=== generatePDFHTML START ===')
  
  // 1. Renderizar la plantilla
  let html = template.render(resume)
  console.log('After render - HTML length:', html.length)
  
  // 2. SIEMPRE compactar estilos PRIMERO (modifica valores inline)
  html = compactStyles(html)
  console.log('After compactStyles - HTML length:', html.length)
  
  // 3. Optimizar imágenes
  html = optimizeImages(html)
  console.log('After optimizeImages - HTML length:', html.length)
  
  // 4. Envolver con estructura HTML completa (solo agrega wrapper, no modifica estilos)
  html = wrapTemplateForPDF(html, template.name)
  console.log('After wrapTemplateForPDF - HTML length:', html.length)
  
  console.log('=== generatePDFHTML END ===')
  return html
}
