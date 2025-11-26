'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';
import NextError from 'next/error';

/**
 * Global Error Handler
 * Captura errores de rendering de React en App Router
 * https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#react-render-errors-in-app-router
 */
export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
