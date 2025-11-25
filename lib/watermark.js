/**
 * Agrega marca de agua al HTML del CV según el plan del usuario
 * @param {string} html - HTML del CV
 * @param {string} plan - Plan del usuario ('free' o 'professional')
 * @param {string} subscriptionStatus - Estado de suscripción ('none', 'pending', 'active')
 * @returns {string} HTML con o sin marca de agua
 */
export function addWatermarkIfNeeded(html, plan, subscriptionStatus) {
  // Solo aplicar marca de agua si NO es plan profesional activo
  const isProfessionalActive = plan === 'professional' && subscriptionStatus === 'active'
  
  if (isProfessionalActive) {
    // Sin marca de agua para usuarios PRO activos
    return html
  }
  
  // Determinar texto de marca de agua según estado
  let watermarkText = 'Creado con GeneradorCV.com'
  let watermarkColor = 'rgba(0, 0, 0, 0.3)'
  
  if (subscriptionStatus === 'pending') {
    watermarkText = 'Pago en validación - GeneradorCV.com'
    watermarkColor = 'rgba(255, 140, 0, 0.4)' // Naranja para pendiente
  }
  
  const watermarkStyles = `
    <style>
      @media print {
        .watermark-overlay {
          display: block !important;
        }
      }
      
      .watermark-overlay {
        position: fixed;
        bottom: 12px;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 9px;
        color: ${watermarkColor};
        font-weight: 400;
        pointer-events: none;
        user-select: none;
        z-index: 99999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        letter-spacing: 0.5px;
        line-height: 1;
      }
      
      .watermark-corner {
        position: fixed;
        bottom: 8px;
        right: 12px;
        font-size: 8px;
        color: ${watermarkColor};
        font-weight: 400;
        pointer-events: none;
        user-select: none;
        z-index: 99999;
        font-family: monospace;
        opacity: 0.7;
      }
      
      /* Marca de agua diagonal (opcional - descomenta para usar) */
      /*
      .watermark-diagonal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
        font-size: 48px;
        color: rgba(0, 0, 0, 0.03);
        font-weight: bold;
        pointer-events: none;
        user-select: none;
        z-index: 1;
        white-space: nowrap;
      }
      */
    </style>
  `
  
  const watermarkHTML = `
    <div class="watermark-overlay">${watermarkText}</div>
    <div class="watermark-corner">Free Plan</div>
  `
  
  // Insertar marca de agua al final del body
  html = html.replace('</body>', `${watermarkStyles}${watermarkHTML}</body>`)
  
  return html
}

/**
 * Verificar si el usuario tiene acceso PRO
 * @param {Object} resume - Objeto de currículum
 * @returns {boolean} True si tiene acceso PRO activo
 */
export function hasProAccess(resume) {
  return resume?.plan === 'professional' && resume?.subscriptionStatus === 'active'
}

/**
 * Obtener mensaje para funciones bloqueadas
 * @param {string} featureName - Nombre de la función
 * @returns {string} Mensaje descriptivo
 */
export function getProBlockedMessage(featureName = 'Esta función') {
  return `${featureName} requiere el Plan Profesional.\n\nCon el Plan PRO obtenés:\n✓ 8 plantillas premium\n✓ Exportación sin marca de agua\n✓ Formatos múltiples (PDF, DOCX, PNG, JPG)\n✓ Carta de presentación\n✓ Soporte prioritario\n\n¿Querés activar tu plan PRO ahora?`
}

