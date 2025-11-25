import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { tipo, texto = '', rubro = 'Otros', puesto = '' } = await request.json()

    let sugerencias = []
    let esTextoValido = true
    const tieneTexto = texto && texto.trim().length > 0

    // Validar que el texto tenga sentido si fue proporcionado
    if (tieneTexto) {
      const palabrasReales = texto.match(/[a-záéíóúñ]{3,}/gi)
      if (!palabrasReales || palabrasReales.length < 2) {
        esTextoValido = false
      }
    }

    // CASO 1: Usuario escribió texto sin sentido (basura)
    if (tieneTexto && !esTextoValido) {
      if (tipo === 'perfil') {
        // Devolver 3 sugerencias aleatorias de la lista de 30
        const todasLasSugerencias = obtenerSugerenciasProfesionales()
        const seleccionadas = seleccionarAleatorias(todasLasSugerencias, 3)
        return NextResponse.json({ 
          sugerencias: seleccionadas,
          advertencia: true 
        })
      }
    }

    // CASO 2: Usuario NO escribió nada - generar desde cero
    if (!tieneTexto && tipo === 'perfil') {
      const todasLasSugerencias = obtenerSugerenciasProfesionales()
      const seleccionadas = seleccionarAleatorias(todasLasSugerencias, 3)
      return NextResponse.json({ sugerencias: seleccionadas })
    }

    // CASO 3: Usuario escribió texto válido - expandir y mejorar
    if (tieneTexto && esTextoValido && tipo === 'perfil') {
      sugerencias = expandirPerfilProfesional(texto, rubro, puesto)
      return NextResponse.json({ sugerencias })
    }

    // Lógica para otros tipos de sugerencias
    switch (tipo) {
      case 'perfil':
        sugerencias = generarSugerenciasPerfil(rubro, puesto)
        break
      case 'experiencia':
        sugerencias = generarSugerenciasExperiencia(rubro, puesto)
        break
      case 'educacion':
        sugerencias = generarSugerenciasEducacion(rubro, puesto)
        break
      case 'skills':
        sugerencias = generarSugerenciasSkills(rubro, puesto)
        break
      case 'extras':
        sugerencias = generarSugerenciasExtras(rubro, puesto)
        break
      default:
        sugerencias = ['Tipo de sugerencia no válido']
    }

    return NextResponse.json({ sugerencias })

  } catch (error) {
    return NextResponse.json({
      sugerencias: ['Error al generar sugerencias']
    })
  }
}

function seleccionarAleatorias(array, cantidad) {
  const shuffled = [...array].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, cantidad)
}

function expandirPerfilProfesional(textoOriginal, rubro, puesto) {
  // Expandir el texto del usuario en 3-5 frases profesionales
  const palabrasClave = textoOriginal.toLowerCase()
  const expansiones = []
  
  // Crear 3 versiones expandidas basadas en el texto original
  if (palabrasClave.includes('experiencia') || palabrasClave.includes('trabajo')) {
    expansiones.push(
      `${textoOriginal} Cuento con capacidad demostrada para integrarme rápidamente a equipos de trabajo y aportar soluciones efectivas. Me caracterizo por mi compromiso, responsabilidad y orientación a resultados. Busco continuar desarrollándome profesionalmente en entornos que valoren la calidad y la mejora continua. Enfocado en generar valor en cada proyecto que emprendo.`
    )
  } else {
    expansiones.push(
      `${textoOriginal} Poseo habilidades interpersonales que facilitan la comunicación efectiva y el trabajo colaborativo. Me adapto rápidamente a nuevos desafíos y mantengo una actitud proactiva ante las responsabilidades asignadas. Orientado al aprendizaje constante y al cumplimiento de objetivos con excelencia. Comprometido con aportar dedicación y profesionalismo en cada tarea.`
    )
  }
  
  if (palabrasClave.includes('aprend') || palabrasClave.includes('estudio')) {
    expansiones.push(
      `${textoOriginal} Mi capacidad de aprendizaje me permite adquirir nuevas competencias de forma rápida y efectiva. Mantengo una actitud de mejora continua y adaptabilidad a diferentes contextos laborales. Me destaco por mi organización, puntualidad y compromiso con los resultados. Busco oportunidades que promuevan el crecimiento personal y profesional.`
    )
  } else {
    expansiones.push(
      `${textoOriginal} Me caracterizo por una sólida ética de trabajo y la capacidad de gestionar múltiples responsabilidades simultáneamente. Poseo excelentes habilidades de comunicación que facilitan la interacción con clientes y compañeros. Orientado a brindar un desempeño eficiente y confiable. Motivado por contribuir al éxito del equipo y la organización.`
    )
  }
  
  expansiones.push(
    `${textoOriginal} Destaco por mi predisposición para asumir nuevos retos y trabajar en entornos dinámicos. Cuento con habilidades analíticas y capacidad para resolver problemas de manera efectiva. Mantengo una actitud positiva, responsable y enfocada en la excelencia. Comprometido con generar impacto positivo y alcanzar los objetivos propuestos.`
  )
  
  return expansiones
}

function obtenerSugerenciasProfesionales() {
  return [
    'Profesional con sólida motivación para desarrollarse en entornos dinámicos y diversos. Poseo gran capacidad para aprender nuevas herramientas y adaptarme rápidamente a distintos equipos de trabajo. Me caracterizo por la responsabilidad, la constancia y la orientación a resultados, siempre buscando aportar valor en cada proyecto. Comprometido con el crecimiento personal y profesional.',
    
    'Persona proactiva y organizada, con fuerte enfoque en la mejora continua y la resolución eficiente de problemas. Cuento con habilidades interpersonales que facilitan la comunicación y el trabajo en equipo. Me desempeño con compromiso, autonomía y predisposición para asumir nuevos desafíos. Oriento mis esfuerzos a cumplir objetivos y superar expectativas.',
    
    'Profesional orientado al logro, con vocación por ofrecer un servicio de calidad y mantener relaciones laborales positivas. Tengo facilidad para trabajar bajo presión y adaptarme a nuevas responsabilidades sin perder el foco en los resultados. Mantengo una actitud flexible, responsable y colaborativa. Busco oportunidades que promuevan el aprendizaje constante.',
    
    'Con fuerte ética laboral y capacidad para gestionar múltiples tareas en simultáneo, me destaco por mi organización y atención al detalle. Disfruto trabajar con equipos diversos y aportar ideas que optimicen los procesos internos. Soy una persona comprometida, puntual y con alta predisposición para resolver problemas. Enfocado en alcanzar metas con excelencia.',
    
    'Profesionista en crecimiento, con pasión por aprender y mejorar en cada experiencia laboral. Tengo gran adaptabilidad para integrarme a nuevos entornos y asumir desafíos con una actitud positiva. Poseo habilidades comunicativas y de trabajo colaborativo que aportan valor a cualquier grupo de trabajo. Orientado a ofrecer resultados consistentes y de calidad.',
    
    'Empleado responsable y enfocado en la calidad del trabajo, con buena capacidad de organización y gestión del tiempo. Me adapto fácilmente a diferentes ritmos de trabajo y puedo desempeñarme tanto de forma autónoma como en equipo. Mantengo una actitud respetuosa, comprometida y abierta al aprendizaje. Busco contribuir al crecimiento de la organización.',
    
    'Profesional con pensamiento analítico y orientación a la eficiencia. Experiencia demostrada trabajando en contextos exigentes donde se valoran la precisión y la iniciativa. Destaco mi predisposición para aprender, aportar ideas y colaborar con distintas áreas. Comprometido con el cumplimiento de plazos y estándares de calidad.',
    
    'Trabajador responsable con excelente disposición para asumir tareas nuevas y formarme en diferentes áreas. Cuento con habilidades para relacionarme de manera efectiva con clientes, superiores y compañeros. Soy puntual, ordenado y atento a las necesidades del entorno laboral. Enfocado en brindar un desempeño confiable y profesional.',
    
    'Perfil dinámico y orientado a resultados, con capacidad para adaptarse a cambios y trabajar en entornos demandantes. Poseo habilidades de comunicación que facilitan la interacción con equipos diversos. Destaco mi actitud positiva, compromiso y deseos de crecimiento profesional. Busco oportunidades que permitan aportar mis conocimientos y seguir aprendiendo.',
    
    'Profesional autodidacta y curioso, con facilidad para comprender rápidamente nuevas herramientas y metodologías de trabajo. Me caracterizo por ser ordenado, responsable y confiable en la ejecución de tareas. Tengo buenas habilidades para trabajar en equipo y mantener un clima laboral positivo. Motivado por aportar valor y enfrentar nuevos desafíos.',
    
    'Persona orientada al cliente y a la calidad del servicio, con habilidades blandas desarrolladas que facilitan la comunicación efectiva. Trabajo con paciencia, empatía y compromiso, manteniendo siempre una actitud profesional. Interesado en integrarme a equipos donde pueda aprender y aportar soluciones prácticas. Enfocado en la mejora continua y la puntualidad.',
    
    'Responsable, dedicado y con capacidad para gestionar múltiples tareas sin descuidar los detalles. Disfruto trabajar en equipo, compartir conocimientos y aprender de otras personas. Mantengo una actitud positiva incluso ante desafíos o entornos cambiantes. Motivado por alcanzar objetivos organizacionales con eficiencia.',
    
    'Profesional confiable con habilidades para la resolución rápida de problemas y la organización de tareas. Puedo integrarme fácilmente a distintos equipos de trabajo y mantener una comunicación clara y respetuosa. Me caracterizo por mi actitud proactiva, constancia y compromiso. Busco oportunidades donde pueda seguir creciendo y aportar valor real.',
    
    'Empleado disciplinado, con capacidad de trabajo bajo presión y en entornos de ritmo acelerado. Poseo buena atención al detalle y capacidad para seguir procedimientos de manera eficiente. Considero la responsabilidad y la puntualidad pilares fundamentales de mi desempeño. Orientado a mejorar continuamente y cumplir con las expectativas del puesto.',
    
    'Profesional orientado al aprendizaje constante, con interés en mejorar mis habilidades técnicas y laborales. Tengo predisposición para asumir nuevos retos y adaptarme a los cambios. Mi enfoque se basa en la colaboración, el respeto y el compromiso con los resultados. Busco aportar mis capacidades en un entorno que valore el crecimiento.',
    
    'Perfil motivado y resiliente, con experiencia en ambientes que requieren rapidez de respuesta y buena organización. Me destaco por mi responsabilidad, compromiso y orientación al servicio. Poseo habilidades interpersonales que facilitan la integración con distintos equipos de trabajo. Busco oportunidades donde pueda aportar dedicación y profesionalismo.',
    
    'Persona ordenada, metódica y con capacidad para priorizar tareas de acuerdo a los requerimientos del puesto. Me caracterizo por mantener una comunicación clara y respetuosa con clientes y compañeros. Estoy motivado por aprender y sumar experiencia en entornos laborales diversos. Enfocado en contribuir al buen funcionamiento de la organización.',
    
    'Profesional con actitud propositiva, siempre en búsqueda de nuevas formas de mejorar procesos y optimizar resultados. Poseo buena capacidad para trabajar bajo presión y adaptarme a cambios repentinos. Disfruto el trabajo colaborativo y los desafíos que implican nuevas responsabilidades. Comprometido con la excelencia y la mejora continua.',
    
    'Empleado orientado a la calidad del trabajo y al cumplimiento de objetivos. Cuento con habilidades para comunicarme de manera eficaz y respetuosa. Me adapto a distintos estilos de liderazgo y dinámicas de equipo. Enfocado en desarrollar nuevas competencias y aportar valor al área donde me desempeñe.',
    
    'Profesional con motivación por el desarrollo personal y la adquisición de nuevas habilidades. Poseo capacidad para trabajar en contextos diversos, manteniendo un enfoque responsable y organizado. Destaco mi comunicación efectiva, compromiso y facilidad para incorporarme a equipos heterogéneos. Busco aportar dedicación y mejorar continuamente mis capacidades laborales.',
    
    'Persona con actitud colaborativa, acostumbrada a trabajar en ambientes donde se requiere flexibilidad y buena gestión del tiempo. Tengo facilidad para comprender nuevas tareas y ejecutar mis responsabilidades con precisión. Me caracterizo por la responsabilidad y el compromiso con los objetivos del área. Enfocado en seguir creciendo profesionalmente.',
    
    'Profesional orientado al cliente, con habilidades para el trato interpersonal y la resolución eficiente de consultas. Me adapto con facilidad a diferentes entornos laborales y mantengo una actitud positiva incluso en situaciones de alta demanda. Establezco relaciones laborales respetuosas y colaborativas. Motivado por aportar un servicio de calidad.',
    
    'Empleado confiable y organizado, con capacidad para gestionar tareas múltiples sin perder el foco en la calidad. Disfruto trabajar con equipos diversos y aprender nuevas habilidades relacionadas con mi área. Me describo como una persona responsable, respetuosa y comprometida con los resultados. Interesado en aportar valor a largo plazo.',
    
    'Profesional con habilidades para analizar situaciones complejas y proponer soluciones prácticas. Mantengo una comunicación clara y asertiva con compañeros y superiores. Me adapto a distintos ritmos de trabajo y disfruto aprender nuevas metodologías. Enfocado en cumplir plazos y alcanzar objetivos con eficiencia.',
    
    'Persona perseverante y disciplinada, con interés en desarrollarse dentro de entornos laborales estables. Cuento con habilidades para seguir instrucciones detalladas y realizar tareas operativas con precisión. Me destaco por la puntualidad, el respeto y el compromiso con mis responsabilidades. Busco contribuir al crecimiento colectivo del equipo.',
    
    'Profesional orientado a la calidad del servicio, con habilidad para relacionarme de forma cordial y profesional con clientes y compañeros. Me adapto rápidamente a nuevos contextos y disfruto trabajar en equipo. Mantengo una actitud proactiva y responsable en cada tarea asignada. Enfocado en seguir aprendiendo y creciendo dentro de la organización.',
    
    'Empleado con capacidad para gestionar altos volúmenes de trabajo manteniendo la organización y la calma. Tengo facilidad para aprender nuevos procesos y herramientas digitales. Me caracterizo por mi responsabilidad, respeto y compromiso con los objetivos del puesto. Enfocado en brindar un desempeño eficiente y confiable.',
    
    'Persona con fuerte vocación de servicio y alto sentido de responsabilidad. Poseo buena capacidad de comunicación y predisposición para ayudar en tareas que requieran cooperación. Me adapto a distintos estilos de trabajo y mantengo una actitud positiva ante los desafíos. Busco oportunidades donde pueda aportar compromiso y dedicación.',
    
    'Profesional con enfoque en la mejora continua y el aprendizaje constante. Disfruto asumir tareas diversas y colaborar en un entorno de trabajo positivo. Tengo capacidad para trabajar bajo presión y cumplir plazos exigentes. Orientado a aportar soluciones prácticas y contribuir al crecimiento de la organización.',
    
    'Persona responsable y orientada al logro, con habilidades para adaptarse a distintos equipos y culturas de trabajo. Mantengo una comunicación clara, respetuosa y profesional en todo momento. Me caracterizo por mi compromiso, puntualidad y actitud positiva frente a los desafíos. Motivado por generar aportes reales dentro de un entorno laboral estable.'
  ]
}

function generarSugerenciasGenericas(tipo, rubro, puesto) {
  if (tipo === 'perfil') {
    return [
      'Joven profesional con ganas de incorporarse al mercado laboral, responsable y con buena predisposición.',
      'Perfil adaptable con capacidad de aprendizaje y enfoque en el trabajo en equipo.',
      'Busco desarrollarme profesionalmente aportando compromiso, actitud positiva y dedicación.'
    ]
  }
  
  // Para otros tipos, usar la lógica normal
  switch (tipo) {
    case 'experiencia':
      return generarSugerenciasExperiencia(rubro, puesto)
    case 'educacion':
      return generarSugerenciasEducacion(rubro, puesto)
    case 'skills':
      return generarSugerenciasSkills(rubro, puesto)
    case 'extras':
      return generarSugerenciasExtras(rubro, puesto)
    default:
      return ['No se pudieron generar sugerencias']
  }
}

function generarSugerenciasPerfil(rubro, puesto) {
  const puestoLower = puesto.toLowerCase()
  
  // Mapeos específicos por puesto (prioridad sobre rubro)
  const perfilesPorPuesto = {
    'mozo': [
      'Profesional en atención al cliente con experiencia en servicio de salón y gestión de mesas en ambientes de alta demanda.',
      'Persona dinámica especializada en toma de pedidos, recomendación de platos y coordinación con cocina.',
      'Orientado a brindar experiencias gastronómicas excepcionales con atención personalizada y eficiente.'
    ],
    'recepcionista': [
      'Profesional en atención al público con habilidades excepcionales de comunicación y gestión de consultas.',
      'Especialista en recepción con capacidad para coordinar agendas, llamadas y primera atención.',
      'Persona organizada enfocada en brindar una excelente primera impresión y experiencia al cliente.'
    ],
    'repositor': [
      'Profesional orientado a la reposición de mercadería, control de stock y rotación de productos.',
      'Persona responsable con experiencia en exhibición de productos y mantenimiento de góndolas.',
      'Especialista en logística de piso de venta con enfoque en orden y disponibilidad de productos.'
    ],
    'vendedor': [
      'Vendedor orientado a resultados con habilidades destacadas en atención al cliente y cierre de ventas.',
      'Profesional comercial con capacidad para identificar necesidades y ofrecer soluciones efectivas.',
      'Especialista en ventas con enfoque en el cumplimiento de metas y fidelización de clientes.'
    ],
    'programador frontend': [
      'Desarrollador Frontend especializado en la creación de interfaces modernas y responsivas con React.',
      'Profesional del desarrollo web con enfoque en experiencia de usuario y optimización de rendimiento.',
      'Especialista en tecnologías frontend (HTML, CSS, JavaScript) con capacidad para trabajar en equipos ágiles.'
    ],
    'programador backend': [
      'Desarrollador Backend con experiencia en APIs RESTful, bases de datos y arquitecturas escalables.',
      'Profesional del desarrollo orientado a la lógica de negocio, seguridad y optimización de servidores.',
      'Especialista en Node.js, Python o Java con enfoque en soluciones robustas y mantenibles.'
    ],
    'call center': [
      'Profesional en atención telefónica con capacidad para gestionar consultas, reclamos y ventas.',
      'Especialista en contact center enfocado en métricas de calidad, FCR y satisfacción del cliente.',
      'Persona con excelente comunicación verbal, empatía y resolución de conflictos en tiempo real.'
    ],
    'telemarketer': [
      'Profesional en telemarketing orientado a la prospección, venta telefónica y cumplimiento de objetivos.',
      'Especialista en comunicación persuasiva con capacidad para generar interés y cerrar ventas.',
      'Persona persistente con habilidades en manejo de objeciones y técnicas de venta consultiva.'
    ],
    'cajero': [
      'Profesional en atención al cliente con experiencia en operación de caja, cobros y arqueos.',
      'Persona responsable con habilidades numéricas, atención al detalle y manejo de efectivo.',
      'Especialista en punto de venta con enfoque en rapidez, precisión y cordialidad.'
    ],
    'cocinero': [
      'Profesional gastronómico con experiencia en preparación de platos, mise en place y trabajo en equipo.',
      'Cocinero especializado en técnicas culinarias, presentación y cumplimiento de estándares de calidad.',
      'Persona apasionada por la cocina con capacidad para trabajar bajo presión y mantener higiene.'
    ],
    'administrador': [
      'Profesional administrativo con experiencia en gestión de oficina, documentación y coordinación.',
      'Especialista en tareas administrativas con dominio de herramientas ofimáticas y organización.',
      'Persona proactiva con capacidad para gestionar múltiples tareas y apoyar operaciones.'
    ]
  }

  // Si hay coincidencia exacta con el puesto
  for (const [key, value] of Object.entries(perfilesPorPuesto)) {
    if (puestoLower.includes(key)) {
      return value
    }
  }

  // Si no hay match de puesto, usar rubro
  const perfiles = {
    'Tecnología / Software': [
      'Desarrollador con experiencia en tecnologías modernas, orientado a la mejora continua y la innovación tecnológica.',
      'Profesional del software con capacidad para trabajar en equipos ágiles, resolviendo problemas complejos de manera eficiente.',
      'Especialista en desarrollo con enfoque en código limpio, escalabilidad y mejores prácticas de la industria.'
    ],
    'Atención al Cliente': [
      'Profesional orientado al cliente con habilidades excepcionales de comunicación y resolución de conflictos.',
      'Especialista en atención al cliente comprometido con brindar experiencias positivas y superar expectativas.',
      'Persona empática con capacidad demostrada para gestionar consultas, reclamos y fidelizar clientes.'
    ],
    'Ventas y Comercial': [
      'Vendedor orientado a resultados con habilidades destacadas en negociación y cierre de ventas exitosas.',
      'Profesional comercial con capacidad para identificar oportunidades de negocio y construir relaciones duraderas.',
      'Especialista en ventas con enfoque en el cumplimiento de objetivos y crecimiento de cartera de clientes.'
    ],
    'Logística / Depósito': [
      'Profesional de logística con experiencia en gestión de inventarios y optimización de procesos de almacenamiento.',
      'Especialista en operaciones de depósito comprometido con la eficiencia, seguridad y cumplimiento de plazos.',
      'Persona organizada con capacidad para coordinar despachos, recepciones y control de stock.'
    ],
    'Administración / Oficina': [
      'Profesional administrativo con habilidades en gestión documental, organización y atención multitarea.',
      'Especialista en tareas de oficina con dominio de herramientas ofimáticas y atención al detalle.',
      'Persona responsable y proactiva con capacidad para apoyar la gestión administrativa de manera eficiente.'
    ],
    'Gastronomía': [
      'Profesional gastronómico con pasión por la cocina, atención al detalle y trabajo en equipo.',
      'Especialista en servicios de alimentos y bebidas comprometido con la calidad y la satisfacción del cliente.',
      'Persona dinámica con experiencia en ambientes de alta demanda, manteniendo estándares de excelencia.'
    ],
    'Diseño / Creativo': [
      'Diseñador creativo con habilidades en desarrollo visual, innovación y comunicación de ideas impactantes.',
      'Profesional del diseño con enfoque en la experiencia del usuario y la estética funcional.',
      'Especialista creativo con capacidad para transformar conceptos en soluciones visuales efectivas.'
    ],
    'Salud': [
      'Profesional de la salud comprometido con el bienestar del paciente y la excelencia en el cuidado.',
      'Especialista en servicios de salud con enfoque en la empatía, el profesionalismo y la ética.',
      'Persona dedicada con capacidad para trabajar bajo presión y brindar atención de calidad.'
    ],
    'Educación': [
      'Educador apasionado por la enseñanza, con habilidades para motivar y guiar el aprendizaje de estudiantes.',
      'Profesional de la educación comprometido con la formación integral y el desarrollo de capacidades.',
      'Especialista pedagógico con enfoque en metodologías innovadoras y atención personalizada.'
    ],
    'Construcción': [
      'Profesional de la construcción con experiencia en obras, seguridad y cumplimiento de plazos.',
      'Especialista en trabajos de construcción comprometido con la calidad y las normativas vigentes.',
      'Persona responsable con capacidad para trabajar en equipo y coordinar tareas en obra.'
    ]
  }

  return perfiles[rubro] || [
    'Profesional orientado a resultados con capacidad demostrada para trabajar en equipo y alcanzar objetivos.',
    'Especialista enfocado en la mejora continua y el desarrollo de soluciones que generen impacto positivo.',
    'Persona proactiva con habilidades destacadas en comunicación y resolución de problemas.'
  ]
}

function generarSugerenciasExperiencia(rubro, puesto) {
  const puestoLower = puesto.toLowerCase()
  
  // Experiencias específicas por puesto
  const experienciasPorPuesto = {
    'mozo': [
      'Atención de mesas en salón con capacidad para 50+ comensales, toma de pedidos y recomendaciones personalizadas.',
      'Coordinación con cocina y barra para garantizar tiempos de servicio óptimos y satisfacción del cliente.',
      'Manejo de bandeja, servicio de vinos y atención de eventos especiales con alto volumen de trabajo.'
    ],
    'recepcionista': [
      'Gestión de recepción, atención telefónica y coordinación de agendas para equipo de 10+ personas.',
      'Primera atención al cliente, registro de visitas y derivación de consultas a áreas correspondientes.',
      'Manejo de sistemas de reservas, email corporativo y documentación administrativa.'
    ],
    'repositor': [
      'Reposición de góndolas en supermercado con control de fechas de vencimiento y rotación de productos.',
      'Mantenimiento de orden y limpieza en piso de venta, exhibición de mercadería según planogramas.',
      'Control de stock, registro de faltantes y coordinación con depósito para abastecimiento.'
    ],
    'vendedor': [
      'Atención personalizada al cliente, identificación de necesidades y cierre de ventas con objetivos cumplidos.',
      'Gestión de cartera de clientes, seguimiento post-venta y fidelización mediante excelente servicio.',
      'Manejo de caja, facturación y cross-selling de productos complementarios.'
    ],
    'programador frontend': [
      'Desarrollo de interfaces responsivas con React, implementando componentes reutilizables y hooks.',
      'Optimización de performance con lazy loading, code splitting y mejores prácticas de rendering.',
      'Integración con APIs REST, manejo de estados globales (Redux, Zustand) y testing con Jest.'
    ],
    'programador backend': [
      'Desarrollo de APIs RESTful con Node.js/Express, autenticación JWT y validación de datos.',
      'Diseño de bases de datos SQL/NoSQL, optimización de queries y gestión de migraciones.',
      'Implementación de microservicios, integración con servicios cloud (AWS, Azure) y CI/CD.'
    ],
    'call center': [
      'Atención de consultas telefónicas con resolución en primera llamada (FCR >80%).',
      'Gestión de reclamos, seguimiento de casos y escalamiento a áreas técnicas cuando es necesario.',
      'Registro de interacciones en CRM, cumplimiento de scripts y métricas de calidad (QA >90%).'
    ],
    'telemarketer': [
      'Realización de llamadas outbound para prospección, generación de leads y cierre de ventas telefónicas.',
      'Aplicación de técnicas de venta consultiva, manejo de objeciones y seguimiento de clientes potenciales.',
      'Cumplimiento de objetivos diarios/mensuales de ventas y actualización de base de datos.'
    ],
    'cajero': [
      'Operación de caja registradora, cobro en efectivo y medios electrónicos con arqueos diarios.',
      'Atención al cliente en punto de venta, resolución de consultas y devoluciones.',
      'Manejo de fondo fijo, cierre de caja y registro de operaciones con precisión.'
    ],
    'cocinero': [
      'Preparación de platos según recetas estandarizadas, mise en place y control de calidad.',
      'Trabajo en equipo de cocina, coordinación con mozos y cumplimiento de tiempos de servicio.',
      'Gestión de inventario de insumos, control de higiene y limpieza según normativas ANMAT.'
    ],
    'administrador': [
      'Gestión administrativa de oficina, archivo documental, correspondencia y atención telefónica.',
      'Coordinación de agendas, organización de reuniones y elaboración de informes ejecutivos.',
      'Manejo de sistemas de gestión, control de proveedores y procesamiento de facturas.'
    ]
  }

  for (const [key, value] of Object.entries(experienciasPorPuesto)) {
    if (puestoLower.includes(key)) {
      return value
    }
  }

  // Si no hay match de puesto, usar rubro
  const experiencias = {
    'Tecnología / Software': [
      'Desarrollé soluciones de software que mejoraron la eficiencia de procesos en un 40%, utilizando tecnologías modernas.',
      'Lideré equipos técnicos en proyectos ágiles, garantizando entregas de calidad y cumplimiento de sprints.',
      'Implementé arquitecturas escalables que redujeron tiempos de respuesta y optimizaron el rendimiento del sistema.'
    ],
    'Atención al Cliente': [
      'Resolví consultas y reclamos de clientes con un índice de satisfacción superior al 95%.',
      'Gestioné eficientemente casos complejos, logrando retención de clientes y mejora en la experiencia.',
      'Promocioné productos y servicios adicionales, contribuyendo al incremento de ventas del área.'
    ],
    'Ventas y Comercial': [
      'Superé objetivos de ventas mensuales en un 30%, aplicando técnicas de negociación y cierre efectivas.',
      'Desarrollé cartera de clientes B2B/B2C, estableciendo relaciones comerciales duraderas.',
      'Implementé estrategias de prospección que incrementaron conversiones y generaron nuevos negocios.'
    ],
    'Logística / Depósito': [
      'Coordiné operaciones de depósito con precisión, asegurando el control de stock y trazabilidad.',
      'Optimicé procesos de recepción y despacho, reduciendo tiempos de carga en un 25%.',
      'Implementé sistemas de inventario que mejoraron la eficiencia y redujeron pérdidas de mercadería.'
    ],
    'Administración / Oficina': [
      'Gestioné documentación administrativa, archivos y correspondencia con alta precisión y confidencialidad.',
      'Coordiné agendas, reuniones y tareas operativas que mejoraron la eficiencia del equipo.',
      'Implementé procesos digitales que redujeron el uso de papel y agilizaron trámites internos.'
    ],
    'Gastronomía': [
      'Preparé y presenté platos cumpliendo estándares de calidad, higiene y tiempos de servicio.',
      'Colaboré en equipos de cocina de alta demanda, garantizando satisfacción del cliente.',
      'Gestioné inventarios de insumos y optimicé procesos para reducir desperdicios.'
    ],
    'Diseño / Creativo': [
      'Diseñé piezas gráficas y materiales visuales que mejoraron la identidad de marca de clientes.',
      'Lideré proyectos creativos desde la conceptualización hasta la entrega final con excelentes resultados.',
      'Implementé soluciones de diseño UX/UI que incrementaron la conversión en plataformas digitales.'
    ],
    'Salud': [
      'Brindé atención de calidad a pacientes, siguiendo protocolos de seguridad y ética profesional.',
      'Colaboré en equipos multidisciplinarios para garantizar el bienestar integral de los pacientes.',
      'Gestioné historias clínicas y registros con precisión, cumpliendo normativas de confidencialidad.'
    ],
    'Educación': [
      'Diseñé e implementé planes de clase que mejoraron el rendimiento académico de estudiantes.',
      'Apliqué metodologías innovadoras que fomentaron la participación activa y el aprendizaje significativo.',
      'Realicé seguimiento personalizado de estudiantes con necesidades educativas especiales.'
    ],
    'Construcción': [
      'Participé en obras de construcción cumpliendo normativas de seguridad y calidad.',
      'Coordiné equipos de trabajo en campo, garantizando cumplimiento de plazos y objetivos.',
      'Implementé mejoras en procesos constructivos que redujeron tiempos y costos de obra.'
    ]
  }

  return experiencias[rubro] || [
    'Lideré proyectos estratégicos que incrementaron la eficiencia operativa en un 30%.',
    'Coordiné equipos multidisciplinarios, garantizando la entrega oportuna de proyectos clave.',
    'Implementé soluciones innovadoras que redujeron costos y mejoraron la satisfacción del cliente.'
  ]
}

function generarSugerenciasEducacion(rubro, puesto) {
  const puestoLower = puesto.toLowerCase()
  
  // Educación específica por puesto
  const educacionPorPuesto = {
    'mozo': [
      'Capacitación en servicio de mesa y atención al cliente en gastronomía.',
      'Curso de sommelier básico - conocimientos de vinos y maridaje.',
      'Formación en manipulación higiénica de alimentos (ANMAT).'
    ],
    'programador frontend': [
      'Bootcamp de Desarrollo Web Frontend - HTML, CSS, JavaScript, React (400 horas).',
      'Certificación en React y Redux - desarrollo de aplicaciones modernas.',
      'Curso de Diseño UX/UI - Figma, prototipado y experiencia de usuario.'
    ],
    'programador backend': [
      'Tecnicatura en Programación - enfoque en desarrollo de software y bases de datos.',
      'Certificación en Node.js y Express - desarrollo de APIs RESTful.',
      'Curso de arquitectura de microservicios y cloud computing (AWS/Azure).'
    ],
    'call center': [
      'Capacitación en atención telefónica y servicio al cliente.',
      'Curso de técnicas de comunicación efectiva y resolución de conflictos.',
      'Formación en manejo de CRM y herramientas de contact center.'
    ]
  }

  for (const [key, value] of Object.entries(educacionPorPuesto)) {
    if (puestoLower.includes(key)) {
      return value
    }
  }

  // Si no hay match de puesto, usar rubro
  const educacion = {
    'Tecnología / Software': [
      'Proyecto final sobre desarrollo de aplicación web con arquitectura escalable y mejores prácticas.',
      'Participación en hackathons universitarios con proyectos destacados en innovación tecnológica.',
      'Promedio académico destacado (8.5/10) con especialización en programación y bases de datos.'
    ],
    'Gastronomía': [
      'Capacitación en manipulación higiénica de alimentos (ANMAT) y buenas prácticas de manufactura.',
      'Cursos de cocina internacional y técnicas culinarias avanzadas.',
      'Certificación en gestión de servicios gastronómicos y atención al cliente.'
    ],
    'Administración / Oficina': [
      'Capacitación en Microsoft Office 365 y Google Workspace nivel avanzado.',
      'Curso de gestión administrativa y archivo documental.',
      'Formación en atención al público y comunicación efectiva en entornos corporativos.'
    ],
    'Salud': [
      'Formación en primeros auxilios y soporte vital básico (RCP).',
      'Capacitación en normativas de bioseguridad y control de infecciones.',
      'Cursos de actualización en protocolos de atención sanitaria.'
    ],
    'Diseño / Creativo': [
      'Proyecto final de diseño gráfico con enfoque en branding e identidad corporativa.',
      'Curso de Adobe Creative Suite (Photoshop, Illustrator, InDesign) nivel avanzado.',
      'Formación en diseño UX/UI y prototipado de interfaces digitales.'
    ]
  }

  return educacion[rubro] || [
    'Proyecto final destacado con enfoque en innovación y aplicación práctica de conocimientos.',
    'Participación activa en grupos de estudio, contribuyendo al desarrollo de trabajos colaborativos.',
    'Reconocimiento académico por excelencia en promedio general y dedicación.'
  ]
}

function generarSugerenciasSkills(rubro, puesto) {
  const puestoLower = puesto.toLowerCase()
  
  // Skills específicas por puesto
  const skillsPorPuesto = {
    'mozo': [
      'Velocidad en servicio, Manejo de bandeja, Memorización de pedidos',
      'Atención al cliente, Empatía, Trabajo bajo presión',
      'Conocimiento de vinos, Servicio de mesa, Comunicación efectiva'
    ],
    'recepcionista': [
      'Atención telefónica, Gestión de agendas, Manejo de sistemas de reservas',
      'Microsoft Office, Email corporativo, Organización',
      'Comunicación, Primera impresión, Resolución de consultas'
    ],
    'repositor': [
      'Reposición de góndolas, Control de stock, Rotación de productos',
      'Lectura de planogramas, Organización, Atención al detalle',
      'Trabajo en equipo, Resistencia física, Cumplimiento de horarios'
    ],
    'vendedor': [
      'Técnicas de venta, Cierre de ventas, Atención al cliente',
      'Negociación, Persuasión, Manejo de objeciones',
      'Manejo de caja, Facturación, Cross-selling'
    ],
    'programador frontend': [
      'HTML, CSS, JavaScript, React, TypeScript',
      'Git, Webpack, Responsive Design, Tailwind CSS',
      'Testing (Jest, RTL), Debugging, Performance optimization'
    ],
    'programador backend': [
      'Node.js, Express, Python, Django, Java',
      'SQL, MongoDB, Redis, PostgreSQL',
      'APIs REST, Autenticación JWT, Docker, Microservicios'
    ],
    'call center': [
      'Atención telefónica, Escucha activa, Empatía',
      'Manejo de CRM (Salesforce, Zendesk), Typing rápido',
      'Resolución de conflictos, Gestión de reclamos, Comunicación clara'
    ],
    'telemarketer': [
      'Venta telefónica, Prospección, Manejo de objeciones',
      'Persuasión, Persistencia, Comunicación verbal efectiva',
      'CRM, Scripts de venta, Técnicas de cierre'
    ],
    'cajero': [
      'Operación de caja, Manejo de efectivo, Arqueos',
      'Atención al cliente, Precisión numérica, Rapidez',
      'Sistemas de punto de venta, Medios de pago electrónicos'
    ],
    'cocinero': [
      'Técnicas culinarias, Preparación de platos, Mise en place',
      'Trabajo bajo presión, Trabajo en equipo, Higiene y seguridad',
      'Conocimiento de ingredientes, Presentación, Cocina internacional'
    ],
    'administrador': [
      'Microsoft Office (Excel, Word, PowerPoint), Google Workspace',
      'Gestión documental, Organización, Atención al detalle',
      'Comunicación escrita, Multitarea, Resolución de problemas'
    ]
  }

  for (const [key, value] of Object.entries(skillsPorPuesto)) {
    if (puestoLower.includes(key)) {
      return value
    }
  }

  // Si no hay match de puesto, usar rubro
  const skills = {
    'Tecnología / Software': [
      'JavaScript, React, Node.js, Python, SQL, Git, Docker, AWS, TypeScript',
      'Resolución de problemas técnicos, Pensamiento lógico, Trabajo en equipo ágil',
      'Metodologías ágiles (Scrum, Kanban), Testing, CI/CD, Arquitectura de software'
    ],
    'Atención al Cliente': [
      'Comunicación efectiva, Empatía, Resolución de conflictos',
      'Gestión de reclamos, Técnicas de negociación, Escucha activa',
      'CRM (Salesforce, Zendesk), Atención telefónica, Chat en vivo'
    ],
    'Ventas y Comercial': [
      'Negociación, Cierre de ventas, Prospección de clientes',
      'Gestión de objeciones, Persuasión, Técnicas de venta consultiva',
      'CRM, Análisis de mercado, Presentaciones comerciales'
    ],
    'Logística / Depósito': [
      'Gestión de inventarios, Control de stock, Trazabilidad',
      'Manejo de carretilla elevadora, Sistemas WMS, Picking y packing',
      'Organización, Atención al detalle, Trabajo bajo presión'
    ],
    'Administración / Oficina': [
      'Microsoft Office (Excel, Word, PowerPoint), Google Workspace',
      'Gestión documental, Archivo, Atención telefónica',
      'Organización, Multitarea, Comunicación escrita profesional'
    ],
    'Gastronomía': [
      'Técnicas culinarias, Presentación de platos, Manipulación de alimentos',
      'Trabajo en equipo, Gestión del tiempo, Resistencia al estrés',
      'Cocina internacional, Pastelería, Enología'
    ],
    'Diseño / Creativo': [
      'Adobe Creative Suite (Photoshop, Illustrator, InDesign)',
      'Figma, Sketch, Diseño UX/UI, Prototipado',
      'Creatividad, Pensamiento visual, Gestión de proyectos creativos'
    ],
    'Salud': [
      'Atención al paciente, Primeros auxilios, RCP',
      'Bioseguridad, Ética profesional, Empatía',
      'Gestión de historias clínicas, Protocolos sanitarios'
    ],
    'Educación': [
      'Planificación curricular, Evaluación pedagógica, Didáctica',
      'Manejo de aulas virtuales (Moodle, Classroom), Herramientas digitales',
      'Comunicación efectiva, Paciencia, Motivación de estudiantes'
    ],
    'Construcción': [
      'Lectura de planos, Uso de herramientas manuales y eléctricas',
      'Normativas de seguridad, Trabajo en alturas, Albañilería',
      'Trabajo en equipo, Resistencia física, Cumplimiento de plazos'
    ]
  }

  return skills[rubro] || [
    'Comunicación efectiva, Liderazgo, Trabajo en equipo, Resolución de problemas',
    'Organización, Gestión del tiempo, Adaptabilidad, Pensamiento crítico',
    'Proactividad, Atención al detalle, Orientación a resultados'
  ]
}

function generarSugerenciasExtras(rubro, puesto) {
  const puestoLower = puesto.toLowerCase()
  
  // Extras específicos por puesto
  const extrasPorPuesto = {
    'mozo': [
      'Certificación en manipulación de alimentos (ANMAT) - Vigente.',
      'Disponibilidad horaria completa, incluyendo fines de semana y feriados.',
      'Experiencia en eventos corporativos y catering de gran escala.'
    ],
    'programador frontend': [
      'Portfolio online con proyectos destacados: www.miportfolio.com',
      'Contribuciones open source en GitHub - 15+ repositorios públicos.',
      'Inglés técnico avanzado (B2/C1) - Lectura de documentación y comunicación.'
    ],
    'call center': [
      'Certificación en Atención al Cliente de Excelencia (Coderhouse, 2023).',
      'Disponibilidad para turnos rotativos (mañana, tarde, noche).',
      'Experiencia en métricas de calidad (QA >90%, FCR >80%).'
    ],
    'vendedor': [
      'Registro de conducir tipo B - Disponibilidad para movilidad.',
      'Certificación en Técnicas de Venta Profesional (LinkedIn Learning).',
      'Experiencia en ventas B2B y B2C con cumplimiento de objetivos.'
    ]
  }

  for (const [key, value] of Object.entries(extrasPorPuesto)) {
    if (puestoLower.includes(key)) {
      return value
    }
  }

  // Si no hay match de puesto, usar rubro
  const extras = {
    'Tecnología / Software': [
      'Certificación AWS Cloud Practitioner - Conocimientos en servicios cloud y arquitectura.',
      'Inglés técnico avanzado (B2/C1) - Lectura de documentación y comunicación en equipos globales.',
      'Contribuciones open source en GitHub - Participación activa en proyectos comunitarios.'
    ],
    'Atención al Cliente': [
      'Certificación en Atención al Cliente de Excelencia (Coderhouse, 2023).',
      'Inglés conversacional (B1) - Capacidad para atender clientes internacionales.',
      'Voluntariado en programas de asistencia comunitaria y ayuda social.'
    ],
    'Ventas y Comercial': [
      'Certificación en Técnicas de Venta Profesional (LinkedIn Learning).',
      'Curso de Negociación Estratégica (Universidad de Michigan).',
      'Registro de Conductor - Licencia tipo B, disponibilidad para movilidad.'
    ],
    'Administración / Oficina': [
      'Certificación Excel Avanzado (tablas dinámicas, macros, análisis de datos).',
      'Capacitación en gestión documental y archivo digital.',
      'Inglés intermedio (B1) - Redacción de emails y comunicación profesional.'
    ],
    'Gastronomía': [
      'Certificación en Manipulación Higiénica de Alimentos (ANMAT).',
      'Curso de Cocina Internacional (Instituto Argentino de Gastronomía).',
      'Disponibilidad horaria completa, incluyendo fines de semana y feriados.'
    ]
  }

  return extras[rubro] || [
    'Certificación profesional en áreas relacionadas al rubro de interés.',
    'Inglés intermedio/avanzado - Capacidad para comunicarse en entornos profesionales.',
    'Cursos de formación continua y actualización en tendencias del sector.'
  ]
}
