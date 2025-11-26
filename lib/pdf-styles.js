/**
 * Estilos base optimizados para generación de PDF
 * Diseñados para maximizar contenido en 1 página A4
 */

export const pdfBaseStyles = `
  <style>
    /* Reset y configuración de página */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    @page {
      size: A4;
      margin: 0;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.3;
      color: #1f2937;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    
    /* Prevenir saltos de página innecesarios */
    h1, h2, h3, h4, h5, h6 {
      page-break-after: avoid;
      page-break-inside: avoid;
      orphans: 3;
      widows: 3;
    }
    
    p, div {
      orphans: 2;
      widows: 2;
    }
    
    /* Optimización de imágenes */
    img {
      max-width: 100%;
      height: auto;
      display: block;
    }
    
    .profile-photo {
      width: 120px !important;
      height: 120px !important;
      object-fit: cover;
      object-position: center;
      flex-shrink: 0;
    }
    
    .profile-photo-round {
      border-radius: 50%;
    }
    
    .profile-photo-square {
      border-radius: 8px;
    }
    
    /* Espaciado compacto optimizado */
    .section-spacing {
      margin-bottom: 12px;
    }
    
    .section-spacing-small {
      margin-bottom: 8px;
    }
    
    .item-spacing {
      margin-bottom: 10px;
    }
    
    /* Tipografía compacta */
    .text-compact {
      line-height: 1.2;
    }
    
    .text-xs { font-size: 10px; }
    .text-sm { font-size: 11px; }
    .text-base { font-size: 12px; }
    .text-md { font-size: 13px; }
    .text-lg { font-size: 14px; }
    .text-xl { font-size: 16px; }
    .text-2xl { font-size: 18px; }
    .text-3xl { font-size: 24px; }
    
    /* Evitar huérfanas/viudas */
    .avoid-break {
      page-break-inside: avoid;
    }
    
    /* Forzar salto de página (solo carta de presentación) */
    .page-break {
      page-break-before: always;
    }
    
    /* Utilities */
    .font-bold { font-weight: 700; }
    .font-semibold { font-weight: 600; }
    .font-medium { font-weight: 500; }
    .italic { font-style: italic; }
    .uppercase { text-transform: uppercase; }
    
    .text-center { text-align: center; }
    .text-justify { text-align: justify; }
    
    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .items-center { align-items: center; }
    .justify-between { justify-content: space-between; }
    .gap-2 { gap: 8px; }
    .gap-3 { gap: 12px; }
    
    /* Colores neutros */
    .text-gray-900 { color: #111827; }
    .text-gray-700 { color: #374151; }
    .text-gray-600 { color: #4b5563; }
    .text-gray-500 { color: #6b7280; }
    
    .bg-gray-50 { background-color: #f9fafb; }
    .bg-gray-100 { background-color: #f3f4f6; }
    
    /* Márgenes y padding compactos */
    .p-6 { padding: 24px; }
    .p-8 { padding: 32px; }
    .px-6 { padding-left: 24px; padding-right: 24px; }
    .py-4 { padding-top: 16px; padding-bottom: 16px; }
    .py-6 { padding-top: 24px; padding-bottom: 24px; }
    
    .mb-2 { margin-bottom: 8px; }
    .mb-3 { margin-bottom: 12px; }
    .mb-4 { margin-bottom: 16px; }
    .mb-6 { margin-bottom: 24px; }
    
    /* Contenedor principal A4 */
    .cv-container {
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      background: white;
      position: relative;
    }
    
    /* Prevenir overflow horizontal */
    .cv-container * {
      max-width: 100%;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
  </style>
`;

/**
 * Genera HTML optimizado para foto de perfil
 * @param {string} photoUrl - URL de la foto
 * @param {string} shape - 'round' | 'square'
 * @param {string} borderStyle - Estilo CSS para el borde
 * @returns {string} HTML de la imagen
 */
export function renderProfilePhoto(photoUrl, shape = 'round', borderStyle = '') {
  if (!photoUrl) return '';
  
  const shapeClass = shape === 'round' ? 'profile-photo-round' : 'profile-photo-square';
  
  return `
    <img 
      src="${photoUrl}" 
      alt="Foto de perfil" 
      class="profile-photo ${shapeClass}"
      style="${borderStyle}"
    />
  `;
}

/**
 * Calcula si el contenido cabrá en una página
 * Estimación basada en cantidad de secciones y longitud
 */
export function estimatePageCount(resume) {
  let contentUnits = 0;
  
  // Header + foto (si existe): 2 unidades
  contentUnits += 2;
  
  // Perfil: 1-2 unidades
  if (resume.profile) {
    contentUnits += resume.profile.length > 300 ? 2 : 1;
  }
  
  // Experiencia: 1.5 unidades por trabajo
  if (resume.experience?.length > 0) {
    contentUnits += resume.experience.length * 1.5;
  }
  
  // Sin experiencia pero con extras
  if (resume.experience?.length === 0 && resume.noExperienceExtras) {
    const extras = resume.noExperienceExtras;
    if (extras.volunteer) contentUnits += 1;
    if (extras.projects) contentUnits += 1;
    if (extras.achievements) contentUnits += 1;
  }
  
  // Educación: 1 unidad por título
  if (resume.education?.length > 0) {
    contentUnits += resume.education.length * 1;
  }
  
  // Habilidades: 0.5-1 unidad
  if (resume.skills?.length > 0) {
    contentUnits += resume.skills.length > 10 ? 1 : 0.5;
  }
  
  // Extras: 0.5 unidades
  if (resume.extras?.length > 0) {
    contentUnits += 0.5;
  }
  
  // Una página A4 puede contener ~15-18 unidades con diseño compacto
  // Si supera 16 unidades, probablemente necesite 2 páginas
  return contentUnits > 16 ? 2 : 1;
}

/**
 * Genera estilos compactos o normales según estimación de contenido
 */
export function getAdaptiveSpacing(resume) {
  const pageCount = estimatePageCount(resume);
  
  if (pageCount === 1) {
    // Diseño normal-compacto
    return {
      sectionMargin: '12px',
      itemMargin: '10px',
      fontSize: 'normal',
      padding: '24px'
    };
  } else {
    // Diseño extra-compacto
    return {
      sectionMargin: '8px',
      itemMargin: '6px',
      fontSize: 'compact',
      padding: '16px'
    };
  }
}
