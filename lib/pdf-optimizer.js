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
    
    /* TIPOGRAFÍAS PROFESIONALES Y COMPACTAS */
    h1 {
      font-size: 24px !important;
      line-height: 1.1 !important;
      margin: 0 0 2px 0 !important;
      font-weight: 700 !important;
    }
    
    h2 {
      font-size: 13px !important;
      line-height: 1.1 !important;
      margin: 0 0 6px 0 !important;
      font-weight: 600 !important;
    }
    
    h3 {
      font-size: 11px !important;
      line-height: 1.1 !important;
      margin: 0 0 3px 0 !important;
      font-weight: 600 !important;
    }
    
    p, div, span, li {
      font-size: 10px !important;
      line-height: 1.2 !important;
      margin: 2px 0 !important;
    }
    
    /* FOTO DEL USUARIO - COMPACTA Y PROFESIONAL */
    img[alt*="Foto"], img[alt*="foto"], img[alt*="perfil"], img[alt*="Perfil"] {
      width: 100px !important;
      height: 100px !important;
      max-width: 100px !important;
      max-height: 100px !important;
      min-width: 100px !important;
      min-height: 100px !important;
      object-fit: cover !important;
      object-position: center !important;
      flex-shrink: 0 !important;
    }
    
    /* MÁRGENES DE PÁGINA COMPACTOS */
    body > div {
      padding: 20px !important;
    }
    
    /* ESPACIADOS ENTRE SECCIONES - MUY COMPACTOS */
    [style*="margin-bottom: 60px"] { margin-bottom: 10px !important; }
    [style*="margin-bottom: 50px"] { margin-bottom: 10px !important; }
    [style*="margin-bottom: 40px"] { margin-bottom: 8px !important; }
    [style*="margin-bottom: 35px"] { margin-bottom: 8px !important; }
    [style*="margin-bottom: 30px"] { margin-bottom: 6px !important; }
    [style*="margin-bottom: 25px"] { margin-bottom: 6px !important; }
    [style*="margin-bottom: 20px"] { margin-bottom: 4px !important; }
    [style*="margin-bottom: 15px"] { margin-bottom: 3px !important; }
    [style*="margin-bottom: 12px"] { margin-bottom: 2px !important; }
    [style*="margin-bottom: 10px"] { margin-bottom: 2px !important; }
    
    /* PADDING COMPACTO */
    [style*="padding: 60px"] { padding: 20px !important; }
    [style*="padding: 50px"] { padding: 18px !important; }
    [style*="padding: 40px"] { padding: 15px !important; }
    [style*="padding: 30px"] { padding: 12px !important; }
    [style*="padding: 20px"] { padding: 10px !important; }
    
    /* ENCABEZADO COMPACTO */
    [style*="padding: 40px 30px"] { padding: 15px 12px !important; }
    [style*="padding: 30px 20px"] { padding: 12px 10px !important; }
    
    /* LINE-HEIGHT COMPACTO GLOBAL */
    * {
      line-height: 1.2 !important;
    }
    
    h1, h2, h3, h4, h5, h6 {
      line-height: 1.1 !important;
    }
    
    /* REDUCIR ESPACIOS EN LISTAS */
    ul, ol {
      margin: 0 !important;
      padding-left: 15px !important;
    }
    
    li {
      margin: 1px 0 !important;
      padding: 0 !important;
    }
    
    /* OPTIMIZACIÓN PARA UNA SOLA PÁGINA */
    .avoid-break, section, article {
      page-break-inside: avoid;
    }
    
    /* Prevenir saltos de página innecesarios */
    h1, h2, h3, h4, h5, h6 {
      page-break-after: avoid;
      page-break-inside: avoid;
    }
    
    /* Carta de presentación en nueva página si existe */
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
  // Forzar tamaño de 100x100px para fotos de perfil
  return html
    .replace(
      /(<img[^>]*alt="[Ff]oto[^"]*"[^>]*style="[^"]*)(width:\s*\d+px[^;]*;?\s*height:\s*\d+px[^;]*;?)/gi,
      '$1width: 100px !important; height: 100px !important;'
    )
    .replace(/width:\s*120px/gi, 'width: 100px')
    .replace(/height:\s*120px/gi, 'height: 100px')
}

/**
 * Compacta estilos para reducir espacio vertical - MÁXIMA COMPRESIÓN
 */
export function compactStyles(html) {
  return html
    // Reducir márgenes AGRESIVAMENTE
    .replace(/margin-bottom:\s*60px/gi, 'margin-bottom: 10px')
    .replace(/margin-bottom:\s*50px/gi, 'margin-bottom: 8px')
    .replace(/margin-bottom:\s*40px/gi, 'margin-bottom: 8px')
    .replace(/margin-bottom:\s*35px/gi, 'margin-bottom: 6px')
    .replace(/margin-bottom:\s*30px/gi, 'margin-bottom: 6px')
    .replace(/margin-bottom:\s*25px/gi, 'margin-bottom: 4px')
    .replace(/margin-bottom:\s*20px/gi, 'margin-bottom: 4px')
    .replace(/margin-bottom:\s*15px/gi, 'margin-bottom: 3px')
    .replace(/margin-bottom:\s*12px/gi, 'margin-bottom: 2px')
    .replace(/margin-bottom:\s*10px/gi, 'margin-bottom: 2px')
    .replace(/margin:\s*8px\s+0/gi, 'margin: 2px 0')
    .replace(/margin:\s*12px\s+0/gi, 'margin: 2px 0')
    .replace(/margin:\s*15px\s+0/gi, 'margin: 3px 0')
    
    // Reducir paddings AGRESIVAMENTE  
    .replace(/padding:\s*60px/gi, 'padding: 20px')
    .replace(/padding:\s*50px/gi, 'padding: 18px')
    .replace(/padding:\s*40px\s+30px/gi, 'padding: 15px 12px')
    .replace(/padding:\s*40px/gi, 'padding: 15px')
    .replace(/padding:\s*30px/gi, 'padding: 12px')
    .replace(/padding:\s*20px/gi, 'padding: 10px')
    .replace(/padding:\s*8px\s+12px/gi, 'padding: 4px 8px')
    
    // Line-height COMPACTO para máxima densidad
    .replace(/line-height:\s*2\.\d+/gi, 'line-height: 1.2')
    .replace(/line-height:\s*1\.9/gi, 'line-height: 1.2')
    .replace(/line-height:\s*1\.8/gi, 'line-height: 1.2')
    .replace(/line-height:\s*1\.7/gi, 'line-height: 1.2')
    .replace(/line-height:\s*1\.6/gi, 'line-height: 1.2')
    .replace(/line-height:\s*1\.5/gi, 'line-height: 1.2')
    
    // Reducir tamaños de fuente si son muy grandes
    .replace(/font-size:\s*28px/gi, 'font-size: 24px')
    .replace(/font-size:\s*26px/gi, 'font-size: 22px')
    .replace(/font-size:\s*24px/gi, 'font-size: 20px')
    .replace(/font-size:\s*18px/gi, 'font-size: 13px')
    .replace(/font-size:\s*16px/gi, 'font-size: 12px')
    .replace(/font-size:\s*15px/gi, 'font-size: 11px')
    .replace(/font-size:\s*14px/gi, 'font-size: 11px')
    .replace(/font-size:\s*13px/gi, 'font-size: 10px')
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
