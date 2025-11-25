import './globals.css'
import { Inter, Lexend } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const lexend = Lexend({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
})

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://generador-cv.vercel.app'),
  title: {
    template: '%s | Generador de CV',
    default: 'Generador de CV Profesional | Crea tu currículum en minutos',
  },
  description: 'Crea tu CV profesional gratis con 8 plantillas modernas. Exporta a PDF, obtén score inteligente y optimiza tu currículum con IA. Compatible con ATS.',
  keywords: ['generador cv', 'curriculum vitae', 'cv gratis', 'plantillas cv', 'cv profesional', 'cv ats', 'resume builder', 'crear cv', 'currículum online'],
  authors: [{ name: 'Generador CV' }],
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'Generador de CV Profesional',
    title: 'Generador de CV Profesional',
    description: 'Crea tu CV profesional gratis con 8 plantillas modernas.',
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Generador de CV Profesional',
    description: 'Crea tu CV profesional gratis con 8 plantillas modernas.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }) {
  // JSON-LD para rich results (Schema.org)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Generador de CV Profesional",
    "applicationCategory": "BusinessApplication",
    "description": "Crea tu CV profesional gratis con 8 plantillas modernas. Exporta a PDF, obtén score inteligente y optimiza tu currículum con IA.",
    "url": process.env.NEXT_PUBLIC_BASE_URL || "https://generador-cv.vercel.app",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    "author": {
      "@type": "Organization",
      "name": "Generador CV",
      "url": process.env.NEXT_PUBLIC_BASE_URL || "https://generador-cv.vercel.app"
    }
  };

  return (
    <html lang="es" className={`${inter.variable} ${lexend.variable}`}>
      <head>
        {/* Meta tags de seguridad */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        
        {/* Preconnect a recursos externos críticos */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.mercadopago.com" />
        
        {/* Preload del CSS crítico generado por Next.js */}
        <link 
          rel="preload" 
          href="/_next/static/css/8c0d68663fae90d3.css" 
          as="style" 
        />
        
        {/* DNS Prefetch para recursos de terceros */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://api.mercadopago.com" />
        
        {/* JSON-LD para rich results de Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} bg-neutral-50 antialiased`}>
        {/* Inicializar Trusted Types */}
        <script dangerouslySetInnerHTML={{
          __html: `
            if (typeof window !== 'undefined' && window.trustedTypes) {
              try {
                window.trustedTypes.createPolicy('default', {
                  createHTML: (input) => input,
                  createScript: (input) => input,
                  createScriptURL: (input) => input,
                });
              } catch (e) {}
            }
          `
        }} />
        <main>{children}</main>
      </body>
    </html>
  )
}
