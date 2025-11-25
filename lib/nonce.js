/**
 * Utilidad para generar nonces criptográficamente seguros para CSP
 * Compatible con Edge Runtime de Vercel
 */

/**
 * Genera un nonce aleatorio de 16 bytes codificado en base64
 * Usa Web Crypto API disponible en Edge Runtime
 * @returns {string} Nonce seguro para usar en CSP
 */
export function generateNonce() {
  // Para Edge Runtime: usar crypto global (Web Crypto API)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return btoa(String.fromCharCode(...bytes));
  }
  
  // Fallback para Node.js (no debería usarse en Edge)
  const { randomBytes } = require('crypto');
  return randomBytes(16).toString('base64');
}
