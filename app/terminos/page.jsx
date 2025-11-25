'use client'

import { useRouter } from 'next/navigation'

export default function TerminosPage() {
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-neutral-700 font-semibold text-xs md:text-sm">Legal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-neutral-900 mb-3 md:mb-6 px-2">
            Términos y Condiciones
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
              <h2>1. Aceptación de los términos</h2>
              <p>
                Bienvenido a GeneradorCV. Al acceder y utilizar nuestra plataforma de creación de currículums vitae, aceptás quedar vinculado por estos Términos y Condiciones, nuestra Política de Privacidad y todas las leyes y regulaciones aplicables. Si no estás de acuerdo con alguno de estos términos, te pedimos que no utilices nuestro servicio.
              </p>
              <p>
                Estos términos constituyen un acuerdo legal entre vos (el "Usuario") y GeneradorCV (el "Servicio", "nosotros", "nuestro"). Al crear una cuenta, utilizar nuestras herramientas o acceder a cualquier parte de la plataforma, confirmás que has leído, entendido y aceptado estos términos en su totalidad.
              </p>

              <h2>2. Descripción del servicio</h2>
              <p>
                GeneradorCV es una plataforma web que proporciona herramientas para crear, editar, personalizar y descargar currículums vitae profesionales. Ofrecemos:
              </p>
              <ul>
                <li><strong>Plan Gratuito:</strong> Acceso a plantillas básicas, creación ilimitada de CVs y descarga en formato PDF con marca de agua.</li>
                <li><strong>Plan PRO:</strong> Acceso completo a todas las plantillas premium, descarga sin marca de agua, personalización avanzada, múltiples CVs guardados en la nube, cartas de presentación y soporte prioritario.</li>
              </ul>
              <p>
                Nos reservamos el derecho de modificar, suspender o discontinuar cualquier aspecto del servicio en cualquier momento, con o sin previo aviso, aunque nos esforzaremos por comunicar cambios significativos con antelación.
              </p>

              <h2>3. Registro y cuenta de usuario</h2>
              <h3>3.1. Elegibilidad</h3>
              <p>
                Para utilizar GeneradorCV, debés tener al menos 16 años de edad. Al crear una cuenta, declarás que cumplís con este requisito de edad y que toda la información que proporcionás es veraz, precisa y completa.
              </p>
              <h3>3.2. Responsabilidad de la cuenta</h3>
              <p>
                Sos responsable de mantener la confidencialidad de tus credenciales de acceso y de todas las actividades que ocurran bajo tu cuenta. Debés notificarnos inmediatamente sobre cualquier uso no autorizado de tu cuenta o cualquier otra violación de seguridad. No seremos responsables por pérdidas derivadas del uso no autorizado de tu cuenta.
              </p>
              <h3>3.3. Información exacta</h3>
              <p>
                Debés proporcionar información de contacto válida y actualizada. Nos reservamos el derecho de suspender o cancelar cuentas con información falsa o desactualizada.
              </p>

              <h2>4. Plan PRO y pagos</h2>
              <h3>4.1. Suscripción</h3>
              <p>
                El plan PRO es un pago único que te otorga acceso de por vida a las funcionalidades premium de la plataforma. Al adquirir el plan PRO, aceptás pagar el precio vigente al momento de la compra.
              </p>
              <h3>4.2. Métodos de pago</h3>
              <p>
                Aceptamos pagos a través de Mercado Pago y transferencias bancarias. El procesamiento de pagos se realiza a través de proveedores externos seguros. No almacenamos información de tarjetas de crédito en nuestros servidores.
              </p>
              <h3>4.3. Activación del plan PRO</h3>
              <ul>
                <li><strong>Mercado Pago:</strong> Activación automática tras confirmación del pago.</li>
                <li><strong>Transferencia bancaria:</strong> Activación manual en un plazo máximo de 24 horas hábiles tras la verificación del comprobante.</li>
                <li><strong>Código de activación:</strong> Activación inmediata al ingresar un código válido.</li>
              </ul>
              <h3>4.4. Política de reembolsos</h3>
              <p>
                Debido a la naturaleza digital del servicio y el acceso inmediato a contenido premium, <strong>no ofrecemos reembolsos una vez activado el plan PRO</strong>. Sin embargo, evaluaremos solicitudes excepcionales caso por caso si:
              </p>
              <ul>
                <li>Experimentaste problemas técnicos significativos que te impidieron usar el servicio</li>
                <li>Se produjo un cargo duplicado o erróneo</li>
                <li>Solicitás el reembolso dentro de las primeras 48 horas y no has utilizado las funciones PRO</li>
              </ul>
              <p>
                Para solicitar un reembolso, contactanos a: <strong>soporte@generadorcv.com</strong>
              </p>

              <h2>5. Uso aceptable</h2>
              <p>
                Al utilizar GeneradorCV, te comprometes a:
              </p>
              <ul>
                <li><strong>Uso personal y profesional:</strong> Utilizar el servicio únicamente para crear tus propios CVs con fines legítimos de búsqueda de empleo o desarrollo profesional.</li>
                <li><strong>Información veraz:</strong> Ser responsable de la exactitud y veracidad de la información que incluís en tus CVs.</li>
                <li><strong>No reventa:</strong> No revender, redistribuir o comercializar los servicios o plantillas de GeneradorCV sin autorización expresa.</li>
                <li><strong>No abuso:</strong> No utilizar el servicio para propósitos ilegales, fraudulentos, difamatorios o que violen derechos de terceros.</li>
                <li><strong>No ingeniería inversa:</strong> No intentar descompilar, realizar ingeniería inversa o extraer el código fuente de nuestra plataforma.</li>
                <li><strong>No automatización:</strong> No utilizar bots, scrapers o herramientas automatizadas para acceder al servicio sin nuestro consentimiento.</li>
              </ul>

              <h2>6. Propiedad intelectual</h2>
              <h3>6.1. Propiedad de GeneradorCV</h3>
              <p>
                Todo el contenido de la plataforma, incluyendo plantillas, diseños, código, textos, gráficos, logotipos, iconos y software, es propiedad de GeneradorCV o sus licenciantes y está protegido por leyes de derechos de autor y propiedad intelectual.
              </p>
              <h3>6.2. Licencia de uso</h3>
              <p>
                Te otorgamos una licencia limitada, no exclusiva, no transferible y revocable para:
              </p>
              <ul>
                <li>Acceder y utilizar las plantillas para crear tus CVs personales</li>
                <li>Descargar los CVs que creaste para tu uso personal o profesional</li>
                <li>Compartir y distribuir tus CVs creados con la plataforma con potenciales empleadores</li>
              </ul>
              <h3>6.3. Propiedad de tu contenido</h3>
              <p>
                Vos mantenés todos los derechos sobre el contenido que creás en la plataforma (información personal, experiencia laboral, etc.). Al utilizar GeneradorCV, nos otorgás una licencia mundial, libre de regalías y no exclusiva para almacenar, procesar y mostrar tu contenido únicamente con el propósito de brindarte el servicio.
              </p>

              <h2>7. Limitación de responsabilidad</h2>
              <p>
                En la máxima medida permitida por la ley:
              </p>
              <ul>
                <li><strong>Servicio "tal cual está":</strong> GeneradorCV se proporciona "tal cual está" y "según disponibilidad", sin garantías de ningún tipo, expresas o implícitas.</li>
                <li><strong>No garantizamos resultados:</strong> No garantizamos que el uso de nuestro servicio resultará en obtención de empleo o entrevistas laborales.</li>
                <li><strong>Limitación de daños:</strong> No seremos responsables por daños indirectos, incidentales, especiales, consecuentes o punitivos, incluyendo pérdida de beneficios, datos o uso.</li>
                <li><strong>Máximo de responsabilidad:</strong> Nuestra responsabilidad total hacia vos por cualquier reclamo no excederá el monto que hayas pagado por el plan PRO en los últimos 12 meses, o $1000 ARS si no has realizado ningún pago.</li>
                <li><strong>Disponibilidad:</strong> No garantizamos que el servicio esté disponible sin interrupciones, sea seguro o esté libre de errores.</li>
              </ul>

              <h2>8. Indemnización</h2>
              <p>
                Aceptás indemnizar, defender y mantener indemne a GeneradorCV, sus directores, empleados y colaboradores de cualquier reclamo, daño, obligación, pérdida, responsabilidad, costo o deuda, y gastos (incluyendo honorarios de abogados) que surjan de:
              </p>
              <ul>
                <li>Tu uso del servicio</li>
                <li>Violación de estos términos</li>
                <li>Violación de derechos de terceros</li>
                <li>Contenido falso, engañoso o ilegal en tus CVs</li>
              </ul>

              <h2>9. Privacidad y protección de datos</h2>
              <p>
                Tu privacidad es importante para nosotros. El uso que hacemos de tu información personal está regido por nuestra <a href="/privacidad">Política de Privacidad</a>. Al utilizar GeneradorCV, aceptás que recopilemos, usemos y compartamos tu información según lo descrito en dicha política.
              </p>

              <h2>10. Terminación</h2>
              <h3>10.1. Por tu parte</h3>
              <p>
                Podés dejar de usar el servicio en cualquier momento. Si tenés una cuenta PRO, podés solicitar la eliminación de tu cuenta contactándonos.
              </p>
              <h3>10.2. Por nuestra parte</h3>
              <p>
                Nos reservamos el derecho de suspender o cancelar tu acceso al servicio en cualquier momento, con o sin causa, incluyendo por violación de estos términos. En caso de terminación por uso indebido, no tendrás derecho a reembolso.
              </p>

              <h2>11. Modificaciones a los términos</h2>
              <p>
                Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. Los cambios significativos serán notificados a través del sitio web o por email con al menos 15 días de antelación. Tu uso continuado del servicio después de la entrada en vigencia de los cambios constituye tu aceptación de los términos modificados.
              </p>

              <h2>12. Jurisdicción y ley aplicable</h2>
              <p>
                Estos términos se rigen por las leyes de la República Argentina. Cualquier disputa relacionada con estos términos o el uso del servicio será sometida a la jurisdicción exclusiva de los tribunales competentes de la Ciudad Autónoma de Buenos Aires, Argentina.
              </p>

              <h2>13. Disposiciones generales</h2>
              <h3>13.1. Acuerdo completo</h3>
              <p>
                Estos términos, junto con la Política de Privacidad, constituyen el acuerdo completo entre vos y GeneradorCV respecto al uso del servicio.
              </p>
              <h3>13.2. Divisibilidad</h3>
              <p>
                Si alguna disposición de estos términos se considera inválida o inexigible, las disposiciones restantes continuarán en pleno vigor y efecto.
              </p>
              <h3>13.3. No renuncia</h3>
              <p>
                Nuestra falta de ejercicio de cualquier derecho o disposición de estos términos no constituye una renuncia a dicho derecho o disposición.
              </p>
              <h3>13.4. Cesión</h3>
              <p>
                No podés ceder o transferir estos términos sin nuestro consentimiento previo por escrito. Podemos ceder nuestros derechos en cualquier momento.
              </p>

              <h2>14. Contacto</h2>
              <p>
                Si tenés preguntas sobre estos Términos y Condiciones, podés contactarnos:
              </p>
              <ul>
                <li><strong>Email:</strong> legal@generadorcv.com</li>
                <li><strong>Soporte:</strong> A través del formulario en /soporte</li>
                <li><strong>Tiempo de respuesta:</strong> Respondemos todas las consultas en un plazo máximo de 5 días hábiles</li>
              </ul>
              <p>
                Al utilizar GeneradorCV, reconocés que has leído, comprendido y aceptado estos Términos y Condiciones en su totalidad.
              </p>
            </div>
          </article>
        </div>
      </section>
    </div>
  )
}
