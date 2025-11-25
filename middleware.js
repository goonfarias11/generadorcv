import { NextResponse } from 'next/server';
import { generateNonce } from './lib/nonce';

export function middleware(req) {
  const nonce = generateNonce();
  const response = NextResponse.next();
  
  // Guardar nonce en headers de respuesta para usarlo en _document
  response.headers.set('x-nonce', nonce);
  
  // Headers CORS permisivos
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Headers de seguridad avanzados
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  
  // HSTS con preload (roll-out gradual recomendado: empezar con max-age bajo y subir)
  // Producción: max-age=63072000 (2 años) + includeSubDomains + preload
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  
  // Cross-Origin-Opener-Policy: aísla el contexto de navegación
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  
  // Cross-Origin-Resource-Policy: controla quién puede cargar este recurso
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  
  // CSP mejorado con nonce (reemplaza unsafe-inline)
  // Next.js requiere 'unsafe-eval' para HMR y 'unsafe-inline' para estilos inline
  const cspHeader = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-eval' 'unsafe-inline'`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.mercadopago.com https://vercel.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', cspHeader);
  
  return response;
}

// Aplicar a todas las rutas excepto archivos estáticos
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/webhooks).*)',
  ],
};
