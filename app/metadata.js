export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://generador-cv.vercel.app'),
  title: {
    template: '%s | Generador de CV Profesional',
    default: 'Generador de CV Profesional | Crea tu currículum en minutos',
  },
  description: 'Crea tu CV profesional gratis con nuestras 8 plantillas modernas. Exporta a PDF, obtén score inteligente y optimiza tu currículum con IA. Compatible con ATS.',
  keywords: ['generador cv', 'curriculum vitae', 'cv gratis', 'plantillas cv', 'cv profesional', 'cv ats', 'resume builder', 'crear cv', 'currículum online'],
  authors: [{ name: 'Generador CV' }],
  creator: 'Generador CV',
  publisher: 'Generador CV',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: '/',
    siteName: 'Generador de CV Profesional',
    title: 'Generador de CV Profesional | Crea tu currículum en minutos',
    description: 'Crea tu CV profesional gratis con nuestras 8 plantillas modernas. Exporta a PDF, obtén score inteligente y optimiza tu currículum.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Generador de CV Profesional',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Generador de CV Profesional',
    description: 'Crea tu CV profesional gratis con 8 plantillas modernas. Exporta a PDF y optimiza con IA.',
    images: ['/opengraph-image'],
    creator: '@generadorcv',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
  },
  alternates: {
    canonical: '/',
    languages: {
      'es-ES': '/',
      'en-US': '/en',
      'pt-BR': '/pt',
    },
  },
};

export default function RootLayout({ children }) {
  return children;
}
