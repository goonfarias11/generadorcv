import { NextResponse } from 'next/server';
import { generateNonce } from './lib/nonce';

export function middleware(req) {
  const nonce = generateNonce();
  const response = NextResponse.next();
  
  // Inyectar nonce en los headers para que sea accesible en el layout
  response.headers.set('x-nonce', nonce);
  
  // Headers CORS permisivos
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Headers de seguridad avanzados
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  
  // HSTS con preload
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  
  // Cross-Origin-Opener-Policy: aísla el contexto de navegación
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  
  // Cross-Origin-Resource-Policy: controla quién puede cargar este recurso
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  
  // CSP moderna con nonces y strict-dynamic (Lighthouse 100)
  // strict-dynamic: permite scripts cargados dinámicamente por scripts con nonce
  // unsafe-eval: necesario solo para Next.js HMR en desarrollo
  const cspHeader = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval'`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob:",
    "connect-src 'self' https://api.mercadopago.com https://vercel.com https://vercel.live",
    "worker-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "upgrade-insecure-requests",
    "require-trusted-types-for 'script'",
    "trusted-types nextjs nextjs#bundler default 'allow-duplicates'",
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
