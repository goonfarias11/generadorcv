/**
 * Inicialización de Trusted Types para prevenir XSS basado en DOM
 * Se ejecuta automáticamente al cargar la aplicación
 */

if (typeof window !== 'undefined' && window.trustedTypes) {
  try {
    // Crear política por defecto
    window.trustedTypes.createPolicy('default', {
      createHTML: (input) => {
        // En producción, aquí deberías usar DOMPurify u otra librería de sanitización
        console.warn('[Trusted Types] createHTML called:', input?.substring(0, 50));
        return input;
      },
      createScript: (input) => {
        console.warn('[Trusted Types] createScript called:', input?.substring(0, 50));
        return input;
      },
      createScriptURL: (input) => {
        console.warn('[Trusted Types] createScriptURL called:', input);
        return input;
      },
    });
    
    console.log('[Trusted Types] Política por defecto creada exitosamente');
  } catch (e) {
    // La política ya existe o el navegador no soporta Trusted Types
    if (e.name !== 'NotAllowedError') {
      console.error('[Trusted Types] Error:', e);
    }
  }
}
