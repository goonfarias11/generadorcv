import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  // Performance Monitoring
  tracesSampleRate: 0.05, // 5% de transacciones para no saturar
  
  // Environment
  environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
  
  // Release tracking (usando Git SHA de Vercel)
  release: process.env.SENTRY_RELEASE,
  
  // Session Tracking
  autoSessionTracking: true,
  
  // Configuración específica del cliente
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  
  // Replay para debugging (solo errores)
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,
});
