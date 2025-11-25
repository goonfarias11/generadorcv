// Helpers para optimizar automáticamente el contenido del CV

export function autoFormatExperience(text) {
  if (!text) return text
  
  // Capitalizar primera letra de cada oración
  let formatted = text.replace(/(^\w|[.!?]\s+\w)/g, match => match.toUpperCase())
  
  // Asegurar punto final
  if (!formatted.match(/[.!?]$/)) {
    formatted += '.'
  }
  
  // Eliminar espacios múltiples
  formatted = formatted.replace(/\s+/g, ' ').trim()
  
  return formatted
}

export function expandExperience(text) {
  if (!text || text.length > 100) return text
  
  // Sugerencias de expansión
  const suggestions = [
    'Describe las tecnologías y herramientas que utilizaste.',
    'Menciona logros cuantificables (ej: aumenté X en Y%).',
    'Indica el tamaño del equipo o alcance del proyecto.'
  ]
  
  return {
    original: text,
    suggestion: suggestions[Math.floor(Math.random() * suggestions.length)],
    needsExpansion: text.length < 50
  }
}

export function improveProfile(text) {
  if (!text) return text
  
  // Palabras profesionales para sugerir
  const professionalWords = {
    'trabajo': 'colaboro',
    'hago': 'desarrollo',
    'sé': 'domino',
    'puedo': 'capacitado para',
    'quiero': 'orientado a',
    'me gusta': 'apasionado por'
  }
  
  let improved = text
  
  // Reemplazar palabras informales
  Object.entries(professionalWords).forEach(([informal, formal]) => {
    const regex = new RegExp(`\\b${informal}\\b`, 'gi')
    improved = improved.replace(regex, formal)
  })
  
  // Asegurar que comience con mayúscula
  improved = improved.charAt(0).toUpperCase() + improved.slice(1)
  
  // Asegurar punto final
  if (!improved.match(/[.!?]$/)) {
    improved += '.'
  }
  
  return improved
}

export function detectMetrics(text) {
  if (!text) return { hasMetrics: false, metrics: [] }
  
  // Detectar números, porcentajes, y palabras clave de logros
  const metricPatterns = [
    /\d+%/g,                          // Porcentajes
    /\d+\+/g,                         // Números con +
    /\$\d+/g,                         // Valores monetarios
    /\d+\s*(clientes|usuarios|proyectos|equipos)/gi,  // Cantidades
    /(aumenté|reduje|mejoré|optimicé|incrementé)/gi   // Verbos de logro
  ]
  
  const metrics = []
  metricPatterns.forEach(pattern => {
    const matches = text.match(pattern)
    if (matches) {
      metrics.push(...matches)
    }
  })
  
  return {
    hasMetrics: metrics.length > 0,
    metrics,
    score: Math.min(metrics.length * 10, 50)
  }
}

export function suggestKeywords(position, industry = '') {
  const keywordsByRole = {
    'developer': ['JavaScript', 'React', 'Node.js', 'Git', 'API REST', 'Testing'],
    'designer': ['Figma', 'Adobe XD', 'UI/UX', 'Prototipado', 'Design Thinking'],
    'manager': ['Liderazgo', 'Gestión de equipos', 'Planificación', 'KPIs', 'Scrum'],
    'marketing': ['SEO', 'Google Analytics', 'Redes sociales', 'Campañas', 'Métricas'],
    'sales': ['CRM', 'Negociación', 'Prospección', 'Cierre de ventas', 'B2B']
  }
  
  const positionLower = position.toLowerCase()
  
  for (const [role, keywords] of Object.entries(keywordsByRole)) {
    if (positionLower.includes(role) || positionLower.includes(role.slice(0, -2))) {
      return keywords
    }
  }
  
  return ['Trabajo en equipo', 'Comunicación', 'Resolución de problemas', 'Adaptabilidad']
}

export function analyzeReadability(text) {
  if (!text) return { score: 0, suggestions: [] }
  
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const words = text.split(/\s+/).filter(w => w.length > 0)
  const avgWordsPerSentence = words.length / Math.max(sentences.length, 1)
  
  const suggestions = []
  
  if (avgWordsPerSentence > 25) {
    suggestions.push('Tus oraciones son muy largas. Intenta dividirlas.')
  }
  
  if (avgWordsPerSentence < 5) {
    suggestions.push('Tus oraciones son muy cortas. Combina algunas ideas.')
  }
  
  // Detectar palabras repetidas
  const wordCount = {}
  words.forEach(word => {
    const w = word.toLowerCase().replace(/[^a-záéíóúñ]/g, '')
    if (w.length > 4) {
      wordCount[w] = (wordCount[w] || 0) + 1
    }
  })
  
  const repeated = Object.entries(wordCount)
    .filter(([_, count]) => count > 3)
    .map(([word]) => word)
  
  if (repeated.length > 0) {
    suggestions.push(`Palabras repetidas: ${repeated.join(', ')}. Usa sinónimos.`)
  }
  
  const score = Math.max(0, 100 - suggestions.length * 20 - Math.abs(15 - avgWordsPerSentence) * 2)
  
  return {
    score: Math.round(score),
    avgWordsPerSentence: Math.round(avgWordsPerSentence),
    suggestions
  }
}

export function generateProfileSuggestion(resume) {
  const { experience, education, skills } = resume
  
  const hasExperience = experience && experience.length > 0
  const hasEducation = education && education.length > 0
  const hasSkills = skills && skills.length > 0
  
  const suggestions = []
  
  if (hasExperience) {
    const latestExp = experience[0]
    suggestions.push(`Profesional ${latestExp.position || 'con experiencia'} en ${latestExp.company || 'el sector'}`)
  }
  
  if (hasEducation) {
    const latestEdu = education[0]
    suggestions.push(`con formación en ${latestEdu.degree || 'su área'}`)
  }
  
  if (hasSkills && skills.length >= 3) {
    suggestions.push(`especializado en ${skills.slice(0, 3).join(', ')}`)
  }
  
  if (suggestions.length > 0) {
    return suggestions.join(', ') + '. Orientado a resultados y con capacidad de trabajo en equipo.'
  }
  
  return 'Profesional comprometido con experiencia en [tu área]. Orientado a resultados y con habilidades en [tus principales competencias].'
}
