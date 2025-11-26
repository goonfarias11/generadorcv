/**
 * Sentry Error Tracking Helpers
 * Wrapper functions para capturar errores, usuarios y breadcrumbs
 */

import * as Sentry from "@sentry/nextjs";

/**
 * Captura una excepción y la envía a Sentry con contexto adicional
 * @param err - Error capturado (puede ser Error, string, o unknown)
 * @param context - Información adicional para debugging
 * 
 * @example
 * try {
 *   await generatePDF();
 * } catch (err) {
 *   captureException(err, { step: "export_pdf", userId: user.id });
 * }
 */
export const captureException = (
  err: unknown,
  context?: Record<string, any>
) => {
  return Sentry.captureException(err, { extra: context });
};

/**
 * Asocia el usuario actual con los eventos de Sentry
 * @param user - Información del usuario (id, email, etc.)
 * 
 * @example
 * setUser({ id: "123", email: "user@example.com" });
 * setUser(null); // Para limpiar el usuario
 */
export const setUser = (user: { id?: string; email?: string } | null) => {
  return Sentry.setUser(user);
};

/**
 * Agrega un breadcrumb para tracking de flujo de usuario
 * @param info - Información del evento (mensaje, categoría, nivel, data)
 * 
 * @example
 * addBreadcrumb({
 *   category: "user_action",
 *   message: "User clicked export PDF",
 *   level: "info",
 *   data: { template: "modern" }
 * });
 */
export const addBreadcrumb = (info: Record<string, any>) => {
  return Sentry.addBreadcrumb(info);
};

/**
 * Captura un mensaje personalizado (no es un error)
 * @param message - Mensaje a registrar
 * @param level - Nivel de severidad
 */
export const captureMessage = (
  message: string,
  level: "fatal" | "error" | "warning" | "info" | "debug" = "info"
) => {
  return Sentry.captureMessage(message, level);
};

export default { captureException, setUser, addBreadcrumb, captureMessage };
