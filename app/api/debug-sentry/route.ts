/**
 * DEBUG ENDPOINT: Test Sentry error tracking
 * 
 * ⚠️ TEMPORAL - DEBE ELIMINARSE ANTES DE PRODUCCIÓN
 * 
 * Este endpoint sirve únicamente para verificar que Sentry
 * está capturando errores correctamente.
 * 
 * Visitar: https://generadorcv.online/api/debug-sentry
 * Resultado: Error capturado en Sentry dashboard
 * 
 * TODO: Eliminar este archivo después de verificar Sentry
 */

export function GET() {
  throw new Error("Sentry test error - This is intentional for testing");
}
