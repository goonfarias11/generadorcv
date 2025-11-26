import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  // Performance Monitoring
  tracesSampleRate: 0.05,
  
  // Environment
  environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
  
  // Release tracking
  release: process.env.SENTRY_RELEASE,
  
  // Session Tracking
  autoSessionTracking: true,
});
