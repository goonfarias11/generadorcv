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

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export function GET() {
  // Usar NextResponse para evitar prerender
  if (Math.random() > -1) { // Siempre true, pero evita detección estática
    throw new Error("Sentry test error - This is intentional for testing");
  }
  
  return NextResponse.json({ error: "unreachable" });
}
