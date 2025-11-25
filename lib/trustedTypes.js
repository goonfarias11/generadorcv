/**
 * Configuración de Trusted Types para prevenir ataques XSS
 * mediante DOM sinks inseguros (innerHTML, insertAdjacentHTML, etc.)
 * 
 * Uso:
 * - Activado mediante CSP: require-trusted-types-for 'script'
 * - Crea políticas de sanitización para contenido HTML dinámico
 * 
 * Nota: Si la aplicación no usa manipulación DOM directa (innerHTML, etc.),
 * esta directiva CSP funcionará sin cambios adicionales.
 */

/**
 * Crea una política de Trusted Types para sanitizar HTML
 * Solo necesario si usás innerHTML o similar en el código
 */
export function createTrustedTypePolicy() {
  if (typeof window === 'undefined') return null;
  
  // Verificar si el navegador soporta Trusted Types
  if (!window.trustedTypes) {
    console.warn('Trusted Types no soportado en este navegador');
    return null;
  }

  try {
    // Crear política con nombre único
    const policy = window.trustedTypes.createPolicy('default', {
      createHTML: (input) => {
        // Aquí podrías agregar sanitización con DOMPurify si fuera necesario
        // Por ahora, solo documentamos que debe evitarse innerHTML
        console.warn('Uso de createHTML detectado:', input);
        return input;
      },
      createScript: (input) => {
        console.warn('Uso de createScript detectado:', input);
        return input;
      },
      createScriptURL: (input) => {
        console.warn('Uso de createScriptURL detectado:', input);
        return input;
      },
    });

    return policy;
  } catch (e) {
    console.error('Error creando política de Trusted Types:', e);
    return null;
  }
}

/**
 * Ejemplo de uso seguro:
 * 
 * // ❌ EVITAR (viola Trusted Types):
 * element.innerHTML = userInput;
 * 
 * // ✅ USAR en su lugar:
 * const policy = createTrustedTypePolicy();
 * element.innerHTML = policy.createHTML(sanitize(userInput));
 * 
 * // ✅ MEJOR AÚN (React):
 * return <div>{userInput}</div>  // React escapa automáticamente
 */
