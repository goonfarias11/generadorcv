'use client'

import { useState } from 'react'

export default function BotonSugerenciasExperiencia({ cargo, empresa, textoActual, onSeleccionar }) {
  const [sugerencias, setSugerencias] = useState([])
  const [mostrarAdvertencia, setMostrarAdvertencia] = useState(false)

  const esTextoValido = (texto) => {
    if (!texto || texto.trim().length === 0) return true // Vacío es válido
    const palabrasReales = texto.match(/[a-záéíóúñ]{3,}/gi)
    return palabrasReales && palabrasReales.length >= 2
  }

  const generarSugerencia = () => {
    setMostrarAdvertencia(false)

    // Verificar si el texto actual es basura
    if (textoActual && textoActual.trim().length > 0 && !esTextoValido(textoActual)) {
      setMostrarAdvertencia(true)
      setSugerencias(obtenerSugerenciasGenericas())
      return
    }

    // CASO A: Tiene cargo + empresa
    if (cargo && empresa) {
      setSugerencias(generarConCargoYEmpresa(cargo, empresa))
      return
    }

    // CASO B: Solo tiene cargo
    if (cargo) {
      setSugerencias(generarConSoloCargo(cargo))
      return
    }

    // CASO C: No tiene nada
    setSugerencias(obtenerSugerenciasGenericas())
  }

  const generarConCargoYEmpresa = (cargo, empresa) => {
    const cargoLower = cargo.toLowerCase()
    const empresaLower = empresa.toLowerCase()

    // Detectar tipo de empresa por nombre
    const esSuperMercado = empresaLower.includes('día') || empresaLower.includes('carrefour') || 
                          empresaLower.includes('coto') || empresaLower.includes('walmart')
    const esRestaurante = empresaLower.includes('restaurant') || empresaLower.includes('café') || 
                         empresaLower.includes('bar') || empresaLower.includes('parrilla')
    const esTech = empresaLower.includes('tech') || empresaLower.includes('software') || 
                   empresaLower.includes('sistemas')

    // Sugerencias específicas por combinación cargo + empresa
    if (cargoLower.includes('cajero') || cargoLower.includes('cajera')) {
      if (esSuperMercado) {
        return [
          `Me desempeñé como ${cargo} en ${empresa}, gestionando operaciones de caja y atención al cliente en un entorno de alto volumen. Procesé transacciones de forma precisa, manejé efectivo y diferentes medios de pago, y mantuve el orden en el sector de cajas. Colaboré con el equipo para resolver consultas de clientes y asegurar una experiencia de compra satisfactoria. Demostré responsabilidad en el manejo de dinero y cumplí con los protocolos de seguridad establecidos.`,
          `Durante mi trabajo como ${cargo} en ${empresa}, realicé cobros, devoluciones y gestión de comprobantes fiscales de manera eficiente. Brindé atención cordial a los clientes, resolví consultas sobre productos y promociones, y mantuve mi sector de trabajo organizado. Participé en el cierre de caja diario con responsabilidad y precisión. Contribuí al funcionamiento fluido del área comercial con actitud proactiva.`,
          `Como ${cargo} en ${empresa}, atendí un alto volumen de clientes diarios manteniendo precisión en cada transacción. Manejé caja registradora, efectivo, tarjetas y sistemas de facturación. Apoyé en tareas de reposición y orden del sector cuando fue necesario. Mantuve un trato amable y profesional con todos los clientes, resolviendo sus necesidades de forma ágil.`
        ]
      }
    }

    if (cargoLower.includes('mozo') || cargoLower.includes('moza') || cargoLower.includes('camarero')) {
      if (esRestaurante) {
        return [
          `Me desempeñé como ${cargo} en ${empresa}, brindando atención personalizada a los comensales y garantizando una experiencia gastronómica de calidad. Tomé pedidos, serví platos y bebidas, y mantuve las mesas en perfectas condiciones. Coordiné con la cocina para asegurar tiempos de servicio adecuados y resolví consultas sobre el menú. Contribuí a mantener un ambiente acogedor y profesional.`,
          `Como ${cargo} en ${empresa}, atendí mesas, gestioné pedidos y aseguré la satisfacción de los clientes durante todo el servicio. Mantuve limpieza y orden en el salón, colaboré con el equipo de cocina y caja, y manejé situaciones de alta demanda con eficiencia. Demostré habilidades de comunicación y trato cordial con clientes de diversos perfiles.`,
          `Durante mi experiencia como ${cargo} en ${empresa}, realicé servicio de mesa completo, desde la bienvenida hasta el cobro. Asesoré a los clientes sobre opciones del menú y sugerencias del día. Mantuve estándares de higiene y presentación en todo momento. Trabajé en equipo para garantizar un servicio fluido y de calidad.`
        ]
      }
    }

    if (cargoLower.includes('repositor') || cargoLower.includes('repositora')) {
      if (esSuperMercado) {
        return [
          `Trabajé como ${cargo} en ${empresa}, realizando reposición de mercadería en distintos sectores del local. Mantuve góndolas ordenadas, etiquetadas y abastecidas según planogramas establecidos. Colaboré en la recepción de mercadería, control de stock y rotación de productos. Aseguré la correcta presentación del punto de venta y apoyé a clientes en la ubicación de productos.`,
          `Como ${cargo} en ${empresa}, me encargué de abastecer las góndolas, verificar precios, y mantener el orden del depósito. Realicé control de fechas de vencimiento y rotación de productos perecederos. Trabajé en equipo con compañeros de distintas áreas para garantizar disponibilidad de productos. Demostré proactividad y compromiso con las tareas asignadas.`,
          `Durante mi experiencia como ${cargo} en ${empresa}, gestioné la reposición diaria de mercadería, asegurando que no faltaran productos en las góndolas. Mantuve espacios de venta limpios y organizados, y colaboré en inventarios periódicos. Apoyé en tareas de limpieza y orden general del sector. Cumplí con los horarios y objetivos establecidos con responsabilidad.`
        ]
      }
    }

    if (cargoLower.includes('program') || cargoLower.includes('desarrollador') || cargoLower.includes('developer')) {
      if (esTech) {
        return [
          `Me desempeñé como ${cargo} en ${empresa}, participando en el desarrollo de aplicaciones web y mantenimiento de sistemas. Colaboré con el equipo en la implementación de nuevas funcionalidades, resolución de bugs y optimización de código. Participé en reuniones de planificación y revisión de código. Contribuí al cumplimiento de plazos y estándares de calidad establecidos.`,
          `Como ${cargo} en ${empresa}, trabajé en proyectos de desarrollo utilizando tecnologías modernas y mejores prácticas de la industria. Realicé tareas de codificación, testing y documentación de funcionalidades. Colaboré con otros desarrolladores y áreas para garantizar la entrega de soluciones efectivas. Demostré capacidad de aprendizaje continuo y adaptación a nuevas herramientas.`,
          `Durante mi experiencia como ${cargo} en ${empresa}, desarrollé y mantuve componentes de software siguiendo los requerimientos del equipo. Participé en procesos de revisión de código y debugging colaborativo. Aporté ideas para mejorar la arquitectura y eficiencia de las aplicaciones. Mantuve comunicación fluida con el equipo técnico y coordiné tareas de forma autónoma.`
        ]
      }
    }

    // Sugerencia genérica con cargo y empresa
    return [
      `Me desempeñé como ${cargo} en ${empresa}, donde desarrollé tareas propias del puesto con responsabilidad y compromiso. Colaboré activamente con el equipo de trabajo para alcanzar los objetivos del área. Mantuve una actitud proactiva y orientada a la mejora continua. Contribuí al buen funcionamiento de la organización a través de mi dedicación y profesionalismo.`,
      `Como ${cargo} en ${empresa}, realicé mis funciones asegurando calidad y eficiencia en cada tarea asignada. Trabajé de forma coordinada con distintas áreas, demostrando habilidades de comunicación y adaptabilidad. Cumplí con los procedimientos establecidos y aporté soluciones ante situaciones diversas. Me destaqué por mi puntualidad, responsabilidad y compromiso con los resultados.`,
      `Durante mi experiencia como ${cargo} en ${empresa}, asumí responsabilidades clave del puesto y colaboré en el logro de metas del equipo. Mantuve un desempeño constante y orientado a la calidad. Demostré capacidad para trabajar bajo presión y resolver problemas de forma efectiva. Aporté dedicación y una actitud positiva al ambiente laboral.`
    ]
  }

  const generarConSoloCargo = (cargo) => {
    const cargoLower = cargo.toLowerCase()

    if (cargoLower.includes('cajero') || cargoLower.includes('cajera')) {
      return [
        `Me desempeñé como ${cargo}, gestionando transacciones de caja, atención al cliente y manejo de efectivo con precisión. Procesé cobros, devoluciones y diferentes medios de pago. Mantuve mi sector ordenado y colaboré con el equipo para brindar un servicio eficiente. Demostré responsabilidad en el manejo de dinero y cumplimiento de procedimientos.`,
        `Como ${cargo}, atendí clientes, realicé operaciones de caja y mantuve control de los ingresos diarios. Brindé información sobre productos y promociones. Colaboré en el cierre de caja con exactitud. Trabajé con compromiso y orientación al cliente.`
      ]
    }

    if (cargoLower.includes('vendedor') || cargoLower.includes('vendedora')) {
      return [
        `Como ${cargo}, me encargué de la atención personalizada a clientes, asesoramiento sobre productos y cierre de ventas. Mantuve el sector ordenado, realicé exhibición de mercadería y colaboré en el logro de objetivos comerciales. Demostré habilidades de comunicación, empatía y orientación a resultados.`,
        `Me desempeñé como ${cargo}, brindando asesoramiento profesional a clientes y gestionando todo el proceso de venta. Mantuve conocimiento actualizado sobre productos y promociones. Colaboré con el equipo para alcanzar metas del área. Trabajé con actitud positiva y enfoque en la satisfacción del cliente.`
      ]
    }

    if (cargoLower.includes('repositor') || cargoLower.includes('repositora')) {
      return [
        `Trabajé como ${cargo}, realizando reposición de mercadería, control de stock y orden de góndolas. Mantuve los sectores limpios y organizados, y colaboré en la recepción de productos. Demostré proactividad, compromiso y capacidad para trabajar en equipo.`,
        `Como ${cargo}, me encargué de abastecer góndolas, verificar fechas de vencimiento y mantener la presentación del punto de venta. Apoyé en inventarios y tareas generales del depósito. Trabajé de forma responsable y ordenada.`
      ]
    }

    if (cargoLower.includes('admin')) {
      return [
        `Me desempeñé como ${cargo}, realizando tareas administrativas, gestión de documentación y atención telefónica. Mantuve archivos organizados, colaboré en la preparación de reportes y apoyé en la coordinación de actividades del área. Demostré organización, proactividad y manejo de herramientas ofimáticas.`,
        `Como ${cargo}, gestioné trámites internos, coordiné agendas y realicé seguimiento de tareas administrativas. Brindé soporte al equipo en diversas actividades operativas. Trabajé con responsabilidad y atención al detalle.`
      ]
    }

    // Genérico para cualquier cargo
    return [
      `Me desempeñé como ${cargo}, desarrollando tareas propias del puesto con responsabilidad y compromiso. Colaboré con el equipo de trabajo para alcanzar objetivos comunes. Mantuve una actitud proactiva y orientada a la calidad. Demostré capacidad de aprendizaje y adaptación a diferentes situaciones.`,
      `Como ${cargo}, realicé mis funciones asegurando eficiencia y cumplimiento de procedimientos. Trabajé de forma coordinada con compañeros y superiores. Aporté soluciones prácticas ante desafíos diarios. Me destaqué por mi responsabilidad y dedicación.`
    ]
  }

  const obtenerSugerenciasGenericas = () => {
    return [
      `Desarrollé tareas operativas propias del puesto, brindando apoyo diario al equipo y manteniendo el sector organizado. Aseguré la correcta atención de clientes, colaboré en la gestión de tareas internas y participé en la resolución de inconvenientes diarios. Contribuí al rendimiento general del área manteniendo una actitud proactiva y responsable.`,
      `Realicé funciones administrativas y operativas, apoyando en diversas actividades del área. Mantuve organización en la documentación y los procesos internos. Colaboré con compañeros para alcanzar los objetivos establecidos. Demostré compromiso, puntualidad y buena predisposición para aprender.`,
      `Participé activamente en las tareas del equipo, asegurando calidad y eficiencia en cada actividad asignada. Colaboré en la atención al cliente, gestión de información y mantenimiento del orden. Aporté soluciones prácticas y mantuve una comunicación fluida con el equipo. Me destaqué por mi responsabilidad y actitud positiva.`
    ]
  }

  const seleccionar = (texto) => {
    onSeleccionar(texto)
    setSugerencias([])
    setMostrarAdvertencia(false)
  }

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={generarSugerencia}
        className="text-xs px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors"
      >
        💡 Generar sugerencia
      </button>

      {mostrarAdvertencia && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-xs font-semibold text-yellow-800">
            ⚠️ No se pudo generar una sugerencia basada en este texto, pero aquí tienes alternativas recomendadas:
          </p>
        </div>
      )}

      {sugerencias.length > 0 && (
        <div className="mt-3 space-y-2 animate-fadeIn">
          {!mostrarAdvertencia && (
            <p className="text-xs font-semibold text-gray-600">Selecciona una sugerencia:</p>
          )}
          {sugerencias.map((sugerencia, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => seleccionar(sugerencia)}
              className="w-full text-left p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-indigo-300 cursor-pointer transition-all text-sm leading-relaxed"
            >
              {sugerencia}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
