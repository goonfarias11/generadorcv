'use client'

import { useRouter } from 'next/navigation'

export default function PrivacidadPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="fixed w-full bg-white/90 backdrop-blur-xl border-b-2 border-neutral-200 shadow-sm z-50">
        <nav className="container mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-4">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl flex items-center justify-center shadow-glow">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-xl md:text-2xl font-display font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              GeneradorCV
            </span>
          </button>
          <button
            onClick={() => router.push('/builder')}
            className="btn-primary flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-2 md:py-3 text-sm md:text-base whitespace-nowrap"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Crear CV Gratis</span>
            <span className="sm:hidden">Crear CV</span>
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-8 md:pb-16 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 mb-3 md:mb-6 px-3 md:px-5 py-1.5 md:py-2.5 bg-white/80 backdrop-blur-sm rounded-full border-2 border-primary-200 shadow-md">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-neutral-700 font-semibold text-xs md:text-sm">Legal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-neutral-900 mb-3 md:mb-6 px-2">
            Política de Privacidad
          </h1>
          <p className="text-sm md:text-base text-neutral-600">
            Última actualización: 15 de noviembre de 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 md:py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl">
          <article className="prose prose-sm md:prose-base lg:prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-neutral-900 prose-p:text-neutral-600 prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-neutral-900 prose-ul:text-neutral-600 prose-ol:text-neutral-600">
            <div className="bg-white rounded-xl md:rounded-3xl shadow-lg border-2 border-neutral-100 p-4 md:p-8 lg:p-10">
              <h2>1. Introducción</h2>
              <p>
                En GeneradorCV valoramos y respetamos tu privacidad. Esta Política de Privacidad describe cómo recopilamos, usamos, almacenamos y protegemos la información personal que nos proporcionás al utilizar nuestra plataforma de creación de currículums vitae en línea. Al usar nuestro servicio, aceptás las prácticas descritas en este documento.
              </p>

              <h2>2. Información que recopilamos</h2>
              <p>
                Recopilamos diferentes tipos de información para brindarte un servicio de calidad y mejorar tu experiencia:
              </p>
              <h3>2.1. Información proporcionada por vos</h3>
              <ul>
                <li><strong>Datos personales del CV:</strong> Nombre completo, datos de contacto (email, teléfono, dirección), experiencia laboral, educación, habilidades, idiomas, certificaciones y cualquier otra información que decidas incluir en tu currículum.</li>
                <li><strong>Información de cuenta:</strong> Si creás una cuenta PRO, podemos recopilar tu email, nombre de usuario y preferencias de servicio.</li>
                <li><strong>Datos de pago:</strong> Cuando realizás una compra del plan PRO, procesamos información de pago a través de Mercado Pago. No almacenamos datos sensibles de tarjetas de crédito en nuestros servidores.</li>
                <li><strong>Comunicaciones:</strong> Cuando nos contactás a través del formulario de soporte o por email, almacenamos tu mensaje y datos de contacto para poder responderte.</li>
              </ul>

              <h3>2.2. Información recopilada automáticamente</h3>
              <ul>
                <li><strong>Datos de uso:</strong> Información sobre cómo usás nuestra plataforma, incluyendo páginas visitadas, tiempo de permanencia, acciones realizadas y características utilizadas.</li>
                <li><strong>Datos técnicos:</strong> Dirección IP, tipo de navegador, sistema operativo, resolución de pantalla, dispositivo utilizado y datos de geolocalización aproximada.</li>
                <li><strong>Cookies y tecnologías similares:</strong> Utilizamos cookies para mejorar tu experiencia, recordar tus preferencias y analizar el uso del sitio.</li>
              </ul>

              <h2>3. Cómo utilizamos tu información</h2>
              <p>
                Utilizamos la información recopilada para los siguientes propósitos:
              </p>
              <ul>
                <li><strong>Prestación del servicio:</strong> Crear, almacenar y permitirte editar tus CVs en nuestra plataforma.</li>
                <li><strong>Procesamiento de pagos:</strong> Gestionar suscripciones al plan PRO y procesar transacciones de manera segura.</li>
                <li><strong>Mejora del servicio:</strong> Analizar el uso de la plataforma para identificar mejoras, desarrollar nuevas funcionalidades y optimizar la experiencia del usuario.</li>
                <li><strong>Comunicación:</strong> Enviarte notificaciones importantes sobre tu cuenta, cambios en nuestros términos o políticas, y responder tus consultas de soporte.</li>
                <li><strong>Marketing (con tu consentimiento):</strong> Enviarte ofertas especiales, novedades y contenido relevante sobre nuestros servicios. Podés darte de baja en cualquier momento.</li>
                <li><strong>Seguridad:</strong> Detectar y prevenir fraudes, proteger nuestros sistemas y garantizar el cumplimiento de nuestros términos de servicio.</li>
                <li><strong>Cumplimiento legal:</strong> Cumplir con obligaciones legales, responder a requerimientos judiciales o gubernamentales legítimos.</li>
              </ul>

              <h2>4. Almacenamiento y conservación de datos</h2>
              <p>
                Tus datos se almacenan de la siguiente manera:
              </p>
              <ul>
                <li><strong>Almacenamiento local:</strong> Los datos de tu CV se guardan principalmente en el almacenamiento local de tu navegador (localStorage). Esto significa que permanecen en tu dispositivo y no se envían automáticamente a nuestros servidores.</li>
                <li><strong>Servidores seguros:</strong> Si tenés una cuenta PRO, tu información se almacena en servidores seguros con cifrado y medidas de protección avanzadas.</li>
                <li><strong>Período de conservación:</strong> Conservamos tus datos personales mientras mantengas activa tu cuenta o mientras sea necesario para brindarte el servicio. Podés solicitar la eliminación de tu información en cualquier momento contactándonos.</li>
              </ul>

              <h2>5. Compartir información con terceros</h2>
              <p>
                No vendemos ni alquilamos tu información personal a terceros. Compartimos información únicamente en estas circunstancias limitadas:
              </p>
              <ul>
                <li><strong>Proveedores de servicios:</strong> Mercado Pago para procesamiento de pagos, servicios de hosting y análisis de datos. Estos proveedores están obligados contractualmente a proteger tu información.</li>
                <li><strong>Cumplimiento legal:</strong> Cuando sea requerido por ley, orden judicial o regulación gubernamental.</li>
                <li><strong>Protección de derechos:</strong> Para proteger nuestros derechos legales, prevenir fraudes o responder a emergencias de seguridad.</li>
                <li><strong>Transferencia de negocio:</strong> En caso de fusión, adquisición o venta de activos, tu información podría ser transferida al nuevo propietario.</li>
              </ul>

              <h2>6. Seguridad de la información</h2>
              <p>
                Implementamos medidas técnicas y organizativas para proteger tu información:
              </p>
              <ul>
                <li>Cifrado SSL/TLS para todas las comunicaciones</li>
                <li>Autenticación segura y control de acceso</li>
                <li>Monitoreo continuo de sistemas para detectar vulnerabilidades</li>
                <li>Backups regulares y planes de recuperación ante desastres</li>
                <li>Capacitación del personal en prácticas de seguridad</li>
              </ul>
              <p>
                Sin embargo, ningún sistema es completamente seguro. Te recomendamos mantener tus credenciales de acceso en privado y notificarnos inmediatamente si sospechás un acceso no autorizado.
              </p>

              <h2>7. Tus derechos</h2>
              <p>
                De acuerdo con la legislación de protección de datos, tenés los siguientes derechos:
              </p>
              <ul>
                <li><strong>Acceso:</strong> Podés solicitar una copia de los datos personales que tenemos sobre vos.</li>
                <li><strong>Rectificación:</strong> Podés corregir información inexacta o incompleta.</li>
                <li><strong>Eliminación:</strong> Podés solicitar la eliminación de tus datos personales (derecho al olvido).</li>
                <li><strong>Portabilidad:</strong> Podés solicitar tus datos en un formato estructurado y de uso común.</li>
                <li><strong>Oposición:</strong> Podés oponerte al procesamiento de tus datos para ciertos propósitos.</li>
                <li><strong>Limitación:</strong> Podés solicitar que limitemos el procesamiento de tu información en ciertos casos.</li>
              </ul>
              <p>
                Para ejercer cualquiera de estos derechos, contactanos a: <strong>privacidad@generadorcv.com</strong>
              </p>

              <h2>8. Cookies y tecnologías de seguimiento</h2>
              <p>
                Utilizamos cookies y tecnologías similares para:
              </p>
              <ul>
                <li><strong>Cookies esenciales:</strong> Necesarias para el funcionamiento básico del sitio</li>
                <li><strong>Cookies de preferencias:</strong> Recordar tus ajustes y personalizaciones</li>
                <li><strong>Cookies analíticas:</strong> Entender cómo los usuarios interactúan con la plataforma</li>
                <li><strong>Cookies de marketing:</strong> Mostrar contenido relevante (solo con tu consentimiento)</li>
              </ul>
              <p>
                Podés configurar tu navegador para rechazar cookies, aunque esto puede afectar la funcionalidad del servicio.
              </p>

              <h2>9. Cambios en esta política</h2>
              <p>
                Nos reservamos el derecho de modificar esta Política de Privacidad en cualquier momento. Te notificaremos sobre cambios significativos a través del sitio web o por email. La fecha de "Última actualización" al inicio del documento indica cuándo se realizó la última modificación. Tu uso continuado del servicio después de los cambios constituye tu aceptación de la política actualizada.
              </p>

              <h2>10. Contacto</h2>
              <p>
                Si tenés preguntas, inquietudes o deseos ejercer tus derechos sobre tus datos personales, podés contactarnos:
              </p>
              <ul>
                <li><strong>Email:</strong> privacidad@generadorcv.com</li>
                <li><strong>Soporte:</strong> A través del formulario en /soporte</li>
                <li><strong>Tiempo de respuesta:</strong> Respondemos todas las consultas en un plazo máximo de 15 días hábiles</li>
              </ul>
              <p>
                Esta Política de Privacidad se rige por las leyes de la República Argentina, específicamente la Ley N° 25.326 de Protección de Datos Personales y sus modificatorias.
              </p>
            </div>
          </article>
        </div>
      </section>
    </div>
  )
}
