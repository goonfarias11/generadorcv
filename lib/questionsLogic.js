// Lógica para preguntas adaptativas e inteligentes

export function shouldSkipStep(stepName, resume) {
  switch (stepName) {
    case 'experience':
      // Si el usuario explícitamente dijo que no tiene experiencia
      return resume.skipExperience === true
    
    case 'education':
      return resume.skipEducation === true
    
    case 'extras':
      // Nunca saltar extras, siempre es opcional
      return false
    
    default:
      return false
  }
}

export function getAdaptiveQuestions(stepName, currentData, resume) {
  const baseQuestions = getBaseQuestions(stepName)
  const adaptiveQuestions = []
  
  // Agregar preguntas base
  adaptiveQuestions.push(...baseQuestions)
  
  // Agregar preguntas contextuales según lo que ya se completó
  if (stepName === 'experience' && currentData.position) {
    // Si ya tiene posición, preguntar sobre logros
    if (!currentData.achievements) {
      adaptiveQuestions.push({
        label: '¿Cuáles fueron tus principales logros en este puesto?',
        field: 'achievements',
        type: 'textarea',
        placeholder: 'Ej: Aumenté las ventas en 30%, lideré equipo de 5 personas...',
        conditional: true
      })
    }
    
    // Preguntar sobre métricas si no las mencionó
    if (currentData.description && !hasMetrics(currentData.description)) {
      adaptiveQuestions.push({
        label: '¿Puedes agregar resultados medibles o métricas?',
        field: 'metrics',
        type: 'text',
        placeholder: 'Ej: 25% de aumento, 100+ clientes, etc.',
        hint: 'Los números mejoran mucho tu CV',
        conditional: true
      })
    }
    
    // Preguntar sobre herramientas
    if (!currentData.tools) {
      adaptiveQuestions.push({
        label: '¿Qué herramientas o tecnologías utilizaste?',
        field: 'tools',
        type: 'text',
        placeholder: 'Ej: JavaScript, Figma, Excel, etc.',
        conditional: true
      })
    }
  }
  
  // Para skills, sugerir si tiene muy pocas
  if (stepName === 'skills' && resume.skills && resume.skills.length < 3) {
    // Marcar que necesita más skills
    return {
      questions: adaptiveQuestions,
      warning: 'Te recomendamos agregar al menos 4 habilidades para mejorar tu CV',
      suggestedSkills: getSuggestedSkills(resume)
    }
  }
  
  return adaptiveQuestions
}

function getBaseQuestions(stepName) {
  const questions = {
    personal: [
      { label: '¿Cuál es tu nombre completo?', field: 'name', type: 'text' },
      { label: '¿Cuál es tu email?', field: 'email', type: 'email' },
      { label: '¿Cuál es tu teléfono?', field: 'phone', type: 'tel' },
      { label: '¿Dónde vives?', field: 'location', type: 'text' },
      { label: 'Escribe un breve perfil profesional', field: 'profile', type: 'textarea' }
    ],
    experience: [
      { label: '¿Cuál fue tu posición o cargo?', field: 'position', type: 'text' },
      { label: '¿En qué empresa trabajaste?', field: 'company', type: 'text' },
      { label: '¿Desde cuándo?', field: 'startDate', type: 'text' },
      { label: '¿Hasta cuándo?', field: 'endDate', type: 'text' },
      { label: 'Describe tus responsabilidades', field: 'description', type: 'textarea' }
    ],
    education: [
      { label: '¿Qué título obtuviste?', field: 'degree', type: 'text' },
      { label: '¿En qué institución?', field: 'institution', type: 'text' },
      { label: '¿En qué año?', field: 'year', type: 'text' }
    ],
    skills: [
      { label: 'Agrega una habilidad', field: 'skill', type: 'text' }
    ],
    extras: [
      { label: 'Información adicional (opcional)', field: 'extra', type: 'textarea' }
    ]
  }
  
  return questions[stepName] || []
}

function hasMetrics(text) {
  if (!text) return false
  return /\d+%|\d+\+|\$\d+|aumenté|reduje|mejoré|incrementé/i.test(text)
}

function getSuggestedSkills(resume) {
  const suggestions = []
  
  // Basado en experiencia
  if (resume.experience && resume.experience.length > 0) {
    const position = resume.experience[0].position?.toLowerCase() || ''
    
    if (position.includes('developer') || position.includes('desarrollador')) {
      suggestions.push('JavaScript', 'React', 'Git', 'API REST')
    } else if (position.includes('designer') || position.includes('diseñ')) {
      suggestions.push('Figma', 'Adobe XD', 'UI/UX', 'Photoshop')
    } else if (position.includes('manager') || position.includes('gerente')) {
      suggestions.push('Liderazgo', 'Gestión de equipos', 'Planificación', 'Scrum')
    } else if (position.includes('marketing')) {
      suggestions.push('SEO', 'Google Analytics', 'Redes sociales', 'Email marketing')
    }
  }
  
  // Skills generales si no hay específicas
  if (suggestions.length === 0) {
    suggestions.push(
      'Trabajo en equipo',
      'Comunicación efectiva',
      'Resolución de problemas',
      'Adaptabilidad',
      'Microsoft Office',
      'Inglés'
    )
  }
  
  return suggestions
}

export function getNextRecommendedStep(currentStep, resume) {
  // Lógica para recomendar el siguiente paso
  const stepOrder = ['personal', 'experience', 'education', 'skills', 'extras']
  
  const completionStatus = {
    personal: resume.name && resume.email && resume.profile,
    experience: resume.experience && resume.experience.length > 0,
    education: resume.education && resume.education.length > 0,
    skills: resume.skills && resume.skills.length >= 3,
    extras: true // Siempre opcional
  }
  
  // Encontrar el primer paso incompleto
  for (const step of stepOrder) {
    if (!completionStatus[step] && step !== currentStep) {
      return {
        step,
        reason: getReasonForStep(step, completionStatus)
      }
    }
  }
  
  return null
}

function getReasonForStep(step, status) {
  const reasons = {
    personal: 'Completa tu información personal para continuar',
    experience: 'Agrega tu experiencia laboral para destacar',
    education: 'Incluye tu formación académica',
    skills: 'Necesitas al menos 3 habilidades',
    extras: 'Agrega información adicional para mejorar'
  }
  
  return reasons[step] || ''
}

export function validateStepCompletion(stepName, data) {
  const validations = {
    personal: () => {
      return data.name && data.email && data.profile && data.profile.length > 50
    },
    experience: () => {
      return data.position && data.company && data.startDate
    },
    education: () => {
      return data.degree && data.institution
    },
    skills: () => {
      return data.length >= 3
    },
    extras: () => true // Siempre válido
  }
  
  return validations[stepName] ? validations[stepName]() : false
}

export function getProgressPercentage(resume) {
  let completed = 0
  const total = 5
  
  if (resume.name && resume.email) completed++
  if (resume.profile && resume.profile.length > 50) completed++
  if (resume.experience && resume.experience.length > 0) completed++
  if (resume.education && resume.education.length > 0) completed++
  if (resume.skills && resume.skills.length >= 3) completed++
  
  return Math.round((completed / total) * 100)
}
