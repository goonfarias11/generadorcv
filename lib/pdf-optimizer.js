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
    
    /* FORZAR PADDING DE PÁGINA MUY COMPACTO */
    body > div {
      padding: 15px !important;
      max-width: 100% !important;
    }
    
    /* TIPOGRAFÍAS - ULTRA COMPACTAS CON !important REFORZADO */
    h1, h1 * {
      font-size: 20px !important;
      line-height: 1.0 !important;
      margin: 0 0 3px 0 !important;
      padding: 0 !important;
      font-weight: 700 !important;
    }
    
    h2, h2 * {
      font-size: 11px !important;
      line-height: 1.0 !important;
      margin: 0 0 4px 0 !important;
      padding: 0 0 2px 0 !important;
      font-weight: 600 !important;
    }
    
    h3, h3 * {
      font-size: 10px !important;
      line-height: 1.0 !important;
      margin: 0 0 2px 0 !important;
      padding: 0 !important;
      font-weight: 600 !important;
    }
    
    p, div:not(body > div), span, li {
      font-size: 9px !important;
      line-height: 1.15 !important;
      margin: 2px 0 !important;
      padding: 0 !important;
    }
    
    strong {
      font-size: 9px !important;
      line-height: 1.15 !important;
    }
    
    /* FOTO - ULTRA COMPACTA 80x80 */
    img[alt*="Foto"], img[alt*="foto"], img[alt*="perfil"], img[alt*="Perfil"] {
      width: 80px !important;
      height: 80px !important;
      max-width: 80px !important;
      max-height: 80px !important;
      min-width: 80px !important;
      min-height: 80px !important;
      object-fit: cover !important;
      object-position: center !important;
      flex-shrink: 0 !important;
      margin: 0 auto 6px auto !important;
    }
    
    /* ENCABEZADO - COMPACTÍSIMO */
    [style*="text-align: center"] {
      margin-bottom: 8px !important;
      padding-bottom: 6px !important;
    }
    
    [style*="border-bottom: 2px"] {
      border-bottom: 1px solid #000 !important;
    }
    
    /* ESPACIADOS ENTRE SECCIONES - MÍNIMOS */
    div[style*="margin-bottom: 50px"],
    div[style*="margin-bottom: 40px"],
    div[style*="margin-bottom: 35px"],
    div[style*="margin-bottom: 30px"],
    div[style*="margin-bottom: 25px"] {
      margin-bottom: 8px !important;
    }
    
    div[style*="margin-bottom: 20px"],
    div[style*="margin-bottom: 15px"] {
      margin-bottom: 6px !important;
    }
    
    div[style*="margin-bottom: 12px"],
    div[style*="margin-bottom: 10px"],
    div[style*="margin-bottom: 8px"] {
      margin-bottom: 4px !important;
    }
    
    /* PADDING - MÍNIMOS */
    div[style*="padding: 60px"],
    div[style*="padding: 50px"],
    div[style*="padding: 40px"],
    div[style*="padding: 30px"] {
      padding: 12px !important;
    }
    
    div[style*="padding: 20px"] {
      padding: 10px !important;
    }
    
    div[style*="padding-bottom: 20px"],
    div[style*="padding-bottom: 15px"] {
      padding-bottom: 6px !important;
    }
    
    div[style*="padding-bottom: 10px"],
    div[style*="padding-bottom: 8px"],
    div[style*="padding-bottom: 5px"] {
      padding-bottom: 3px !important;
    }
    
    /* LINE-HEIGHT GLOBAL COMPACTO */
    * {
      line-height: 1.15 !important;
    }
    
    /* REDUCIR ESPACIOS EN LISTAS */
    ul, ol {
      margin: 0 !important;
      padding-left: 12px !important;
    }
    
    li {
      margin: 1px 0 !important;
      padding: 0 !important;
      font-size: 9px !important;
    }
    
    /* OPTIMIZACIÓN PARA UNA SOLA PÁGINA */
    section, article {
      page-break-inside: avoid;
    }
    
    h1, h2, h3, h4, h5, h6 {
      page-break-after: avoid;
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
 */
export function compactStyles(html) {
  return html
    // Reducir TODOS los font-size grandes
    .replace(/font-size:\s*32px/gi, 'font-size: 20px')
    .replace(/font-size:\s*28px/gi, 'font-size: 18px')
    .replace(/font-size:\s*26px/gi, 'font-size: 18px')
    .replace(/font-size:\s*24px/gi, 'font-size: 16px')
    .replace(/font-size:\s*20px/gi, 'font-size: 14px')
    .replace(/font-size:\s*18px/gi, 'font-size: 11px')
    .replace(/font-size:\s*16px/gi, 'font-size: 11px')
    .replace(/font-size:\s*15px/gi, 'font-size: 10px')
    .replace(/font-size:\s*14px/gi, 'font-size: 10px')
    .replace(/font-size:\s*13px/gi, 'font-size: 9px')
    .replace(/font-size:\s*12px/gi, 'font-size: 9px')
    
    // Reducir TODOS los márgenes
    .replace(/margin-bottom:\s*60px/gi, 'margin-bottom: 8px')
    .replace(/margin-bottom:\s*50px/gi, 'margin-bottom: 8px')
    .replace(/margin-bottom:\s*40px/gi, 'margin-bottom: 6px')
    .replace(/margin-bottom:\s*35px/gi, 'margin-bottom: 6px')
    .replace(/margin-bottom:\s*30px/gi, 'margin-bottom: 6px')
    .replace(/margin-bottom:\s*25px/gi, 'margin-bottom: 4px')
    .replace(/margin-bottom:\s*20px/gi, 'margin-bottom: 4px')
    .replace(/margin-bottom:\s*15px/gi, 'margin-bottom: 3px')
    .replace(/margin-bottom:\s*12px/gi, 'margin-bottom: 2px')
    .replace(/margin-bottom:\s*10px/gi, 'margin-bottom: 2px')
    .replace(/margin:\s*0\s+0\s+10px\s+0/gi, 'margin: 0 0 3px 0')
    .replace(/margin:\s*8px\s+0/gi, 'margin: 2px 0')
    .replace(/margin:\s*12px\s+0/gi, 'margin: 2px 0')
    .replace(/margin:\s*15px\s+0/gi, 'margin: 3px 0')
    
    // Reducir TODOS los paddings
    .replace(/padding:\s*60px/gi, 'padding: 15px')
    .replace(/padding:\s*50px/gi, 'padding: 15px')
    .replace(/padding:\s*40px/gi, 'padding: 12px')
    .replace(/padding:\s*30px/gi, 'padding: 10px')
    .replace(/padding:\s*20px/gi, 'padding: 8px')
    .replace(/padding-bottom:\s*20px/gi, 'padding-bottom: 6px')
    .replace(/padding-bottom:\s*15px/gi, 'padding-bottom: 4px')
    .replace(/padding-bottom:\s*10px/gi, 'padding-bottom: 3px')
    .replace(/padding-bottom:\s*5px/gi, 'padding-bottom: 2px')
    .replace(/padding:\s*8px\s+12px/gi, 'padding: 3px 6px')
    
    // Line-height ULTRA COMPACTO
    .replace(/line-height:\s*2\.\d+/gi, 'line-height: 1.15')
    .replace(/line-height:\s*1\.9/gi, 'line-height: 1.15')
    .replace(/line-height:\s*1\.8/gi, 'line-height: 1.15')
    .replace(/line-height:\s*1\.7/gi, 'line-height: 1.15')
    .replace(/line-height:\s*1\.6/gi, 'line-height: 1.15')
    .replace(/line-height:\s*1\.5/gi, 'line-height: 1.15')
    .replace(/line-height:\s*1\.4/gi, 'line-height: 1.15')
    .replace(/line-height:\s*1\.3/gi, 'line-height: 1.15')
    
    // Reducir bordes gruesos
    .replace(/border:\s*3px/gi, 'border: 2px')
    .replace(/border:\s*4px/gi, 'border: 2px')
    .replace(/border-bottom:\s*2px/gi, 'border-bottom: 1px')
}

/**
 * Genera HTML optimizado para PDF desde una plantilla
 */
export function generatePDFHTML(resume, template) {
  // Renderizar la plantilla
  let html = template.render(resume)
  
  // SIEMPRE optimizar imágenes
  html = optimizeImages(html)
  
  // SIEMPRE compactar estilos para diseño profesional
  html = compactStyles(html)
  
  // Envolver con estructura HTML completa
  html = wrapTemplateForPDF(html, template.name)
  
  return html
}
