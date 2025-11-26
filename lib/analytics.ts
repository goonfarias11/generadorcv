/**
 * Plausible Analytics Integration
 * Privacy-friendly analytics without cookies
 * Docs: https://plausible.io/docs/custom-event-goals
 */

declare global {
  interface Window {
    plausible?: (eventName: string, options?: { props?: Record<string, any> }) => void;
  }
}

/**
 * Track custom events in Plausible Analytics
 * @param name - Event name (e.g., "cta_crear_cv", "descargar_pdf")
 * @param props - Optional event properties
 * 
 * @example
 * trackEvent("cta_crear_cv", { position: "hero" })
 * trackEvent("descargar_pdf", { format: "A4" })
 */
export const trackEvent = (name: string, props?: Record<string, any>) => {
  if (typeof window !== "undefined" && window.plausible) {
    window.plausible(name, { props });
    console.log(`[Analytics] Event tracked: ${name}`, props);
  }
};

/**
 * Track pageview manually (useful for SPAs)
 * Plausible auto-tracks pageviews by default
 */
export const trackPageview = (url?: string) => {
  if (typeof window !== "undefined" && window.plausible) {
    window.plausible("pageview", { props: { url: url || window.location.pathname } });
  }
};

export default trackEvent;
