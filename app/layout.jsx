import './globals.css'
import { Inter, Lexend } from 'next/font/google'
import { headers } from 'next/headers'

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
  metadataBase: new URL("https://generadorcv.online"),
  title: {
    default: "GeneradorCV – Crea tu CV profesional en minutos",
    template: "%s | GeneradorCV"
  },
  description: "Crea tu CV profesional en minutos con plantillas modernas, exportación a PDF y un editor fácil de usar.",
  keywords: [
    "crear CV",
    "generar CV",
    "curriculum vitae",
    "plantillas de CV",
    "CV profesional",
    "hacer currículum online",
    "cv gratis",
    "cv ats",
    "resume builder",
    "currículum online"
  ],
  authors: [{ name: "GeneradorCV" }],
  alternates: {
    canonical: "https://generadorcv.online"
  },
  openGraph: {
    title: "GeneradorCV – Crea tu CV profesional en minutos",
    description: "Crea tu CV profesional en minutos con plantillas modernas, exportación a PDF y un editor fácil de usar.",
    url: "https://generadorcv.online",
    siteName: "GeneradorCV",
    type: "website",
    locale: "es_ES",
    images: [
      {
        url: "https://generadorcv.online/og-image.png",
        width: 1200,
        height: 630,
        alt: "GeneradorCV - Crea tu CV profesional en minutos"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "GeneradorCV – Crea tu CV profesional en minutos",
    description: "Crea tu CV profesional en minutos con plantillas modernas, exportación a PDF y un editor fácil de usar.",
    images: ["https://generadorcv.online/og-image.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
}

export default function RootLayout({ children }) {
  // Obtener el nonce del middleware
  const headersList = headers();
  const nonce = headersList.get('x-nonce') || '';
  
  // JSON-LD para rich results (Schema.org)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "GeneradorCV",
    "applicationCategory": "BusinessApplication",
    "description": "Crea tu CV profesional en minutos con plantillas modernas, exportación a PDF y un editor fácil de usar.",
    "url": "https://generadorcv.online",
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
      "name": "GeneradorCV",
      "url": "https://generadorcv.online"
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
        
        {/* DNS Prefetch para recursos de terceros */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://api.mercadopago.com" />
        
        {/* Trusted Types initialization - debe cargarse primero */}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && window.trustedTypes) {
                try {
                  window.trustedTypes.createPolicy('nextjs', {
                    createHTML: (input) => input,
                    createScript: (input) => input,
                    createScriptURL: (input) => input,
                  });
                  window.trustedTypes.createPolicy('nextjs', {
                    createHTML: (input) => input,
                    createScript: (input) => input,
                    createScriptURL: (input) => input,
                  });
                  window.trustedTypes.createPolicy('nextjs#bundler', {
                    createHTML: (input) => input,
                    createScript: (input) => input,
                    createScriptURL: (input) => input,
                  });
                  if (!window.trustedTypes.defaultPolicy) {
                    window.trustedTypes.createPolicy('default', {
                      createHTML: (input) => input,
                      createScript: (input) => input,
                      createScriptURL: (input) => input,
                    });
                  }
                } catch (e) {}
              }
            `.trim()
          }}
        />
        
        {/* JSON-LD para rich results de Google */}
        <script
          nonce={nonce}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} bg-neutral-50 antialiased`}>
        <main>{children}</main>
      </body>
    </html>
  )
}
