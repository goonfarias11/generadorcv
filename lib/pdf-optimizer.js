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
    
    /* Forzar tamaño de imágenes de perfil */
    img[alt*="Foto"], img[alt*="foto"], img[alt*="perfil"] {
      width: 100px !important;
      height: 100px !important;
      max-width: 100px !important;
      max-height: 100px !important;
      object-fit: cover !important;
      object-position: center !important;
    }
    
    /* Prevenir saltos de página */
    h1, h2, h3, h4, h5, h6 {
      page-break-after: avoid;
      page-break-inside: avoid;
    }
    
    /* Carta de presentación en nueva página */
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
 * Asegura que todas las fotos tengan dimensiones fijas
 */
export function optimizeImages(html) {
  // Reemplazar todos los estilos de imágenes de perfil para forzar tamaño fijo
  return html
    .replace(
      /(<img[^>]*alt="Foto[^"]*"[^>]*style="[^"]*)(width:\s*\d+px[^;]*;?\s*height:\s*\d+px[^;]*;?)/gi,
      '$1width: 100px !important; height: 100px !important; max-width: 100px !important; max-height: 100px !important;'
    )
    .replace(
      /width:\s*120px/gi,
      'width: 100px'
    )
    .replace(
      /height:\s*120px/gi,
      'height: 100px'
    )
}

/**
 * Compacta estilos para reducir espacio vertical
 */
export function compactStyles(html) {
  return html
    // Reducir márgenes grandes
    .replace(/margin-bottom:\s*40px/gi, 'margin-bottom: 20px')
    .replace(/margin-bottom:\s*35px/gi, 'margin-bottom: 18px')
    .replace(/margin-bottom:\s*30px/gi, 'margin-bottom: 16px')
    .replace(/margin-bottom:\s*25px/gi, 'margin-bottom: 14px')
    
    // Reducir paddings grandes
    .replace(/padding:\s*60px/gi, 'padding: 30px')
    .replace(/padding:\s*50px/gi, 'padding: 25px')
    .replace(/padding:\s*40px/gi, 'padding: 20px')
    
    // Optimizar line-height
    .replace(/line-height:\s*1\.9/gi, 'line-height: 1.4')
    .replace(/line-height:\s*1\.8/gi, 'line-height: 1.35')
    .replace(/line-height:\s*1\.7/gi, 'line-height: 1.3')
    .replace(/line-height:\s*1\.6/gi, 'line-height: 1.25')
}

/**
 * Genera HTML optimizado para PDF desde una plantilla
 */
export function generatePDFHTML(resume, template) {
  // Renderizar la plantilla
  let html = template.render(resume)
  
  // Optimizar imágenes
  html = optimizeImages(html)
  
  // Compactar estilos si el contenido es extenso
  const hasExtensiveContent = 
    (resume.experience?.length || 0) > 3 ||
    (resume.education?.length || 0) > 3 ||
    (resume.skills?.length || 0) > 10 ||
    (resume.profile?.length || 0) > 300
  
  if (hasExtensiveContent) {
    html = compactStyles(html)
  }
  
  // Envolver con estructura HTML completa
  html = wrapTemplateForPDF(html, template.name)
  
  return html
}
