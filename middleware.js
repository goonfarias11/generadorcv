import { NextResponse } from 'next/server';
import { generateNonce } from './lib/nonce';

export function middleware(req) {
  const nonce = generateNonce();
  const response = NextResponse.next();
  
  // Inyectar nonce en los headers para que sea accesible en el layout
  response.headers.set('x-nonce', nonce);
  
  // Headers de seguridad básicos
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // HSTS
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains');
  
  return response;
}

// Aplicar solo a páginas HTML, no a archivos estáticos
export const config = {
  matcher: [
    '/((?!_next|api|.*\\..*).*)',
  ],
};
