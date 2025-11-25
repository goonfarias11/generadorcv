/**
 * Utilidad para generar nonces criptográficamente seguros para CSP
 * Se usa en middleware para crear un nonce único por request
 */

import { randomBytes } from 'crypto'

/**
 * Genera un nonce aleatorio de 16 bytes codificado en base64
 * @returns {string} Nonce seguro para usar en CSP
 */
export function generateNonce() {
  return randomBytes(16).toString('base64')
}
