export function calculateScore(resume) {
  let score = 0
  const tips = []
  
  // Información personal básica (30 puntos)
  if (resume.name && resume.name.length > 0) {
    score += 10
  } else {
    tips.push('Agrega tu nombre completo')
  }
  
  if (resume.email && resume.email.includes('@')) {
    score += 10
  } else {
    tips.push('Completa tu email')
  }
  
  if (resume.phone && resume.phone.length > 0) score += 5
  else tips.push('Agrega tu teléfono')
  
  if (resume.location && resume.location.length > 0) score += 5
  else tips.push('Indica tu ubicación')
  
  // Perfil profesional (15 puntos) - Análisis avanzado
  if (resume.profile) {
    const words = resume.profile.split(/\s+/).filter(w => w.length > 0)
    const sentences = resume.profile.split(/[.!?]+/).filter(s => s.trim().length > 0)
    
    if (resume.profile.length > 100) {
      score += 15
      
      // Bonus por palabras clave profesionales
      const keywords = ['responsable', 'proactivo', 'liderazgo', 'experiencia', 'gestión', 
                       'desarrollo', 'orientado', 'resultados', 'equipo', 'innovación']
      const hasKeywords = keywords.some(kw => resume.profile.toLowerCase().includes(kw))
      if (hasKeywords) score += 3
    } else if (resume.profile.length > 50) {
      score += 10
      tips.push('Amplía tu perfil profesional (mínimo 100 caracteres)')
    } else {
      score += 5
      tips.push('Escribe un perfil profesional más completo')
    }
    
    // Penalizar oraciones muy cortas
    const shortSentences = sentences.filter(s => s.split(/\s+/).length < 4)
    if (shortSentences.length > 0) {
      score -= 2
      tips.push('Evita oraciones demasiado cortas en tu perfil')
    }
  } else {
    tips.push('Escribe un perfil profesional destacado')
  }
  
  // Experiencia laboral (30 puntos) - Análisis avanzado
  if (resume.experience && resume.experience.length > 0) {
    score += 15
    
    if (resume.experience.length >= 2) score += 8
    if (resume.experience.length >= 3) score += 2
    
    // Verificar que cada experiencia tenga descripción detallada
    const withGoodDescription = resume.experience.filter(exp => 
      exp.description && exp.description.length > 50
    )
    if (withGoodDescription.length === resume.experience.length) {
      score += 5
    } else {
      tips.push('Completa las descripciones de todas tus experiencias')
    }
    
    // Bonus por métricas (números, porcentajes)
    const hasMetrics = resume.experience.some(exp => 
      exp.description && /\d+%|\d+\+|aumentó|redujo|mejoró|incrementó/i.test(exp.description)
    )
    if (hasMetrics) {
      score += 5
      tips.push('¡Excelente! Incluiste métricas en tu experiencia')
    } else {
      tips.push('Agrega métricas y resultados cuantificables (ej: "aumenté ventas 25%")')
    }
    
    // Verificar fechas completas
    const withDates = resume.experience.filter(exp => exp.startDate && exp.endDate)
    if (withDates.length < resume.experience.length) {
      tips.push('Completa las fechas en todas tus experiencias')
    }
    
  } else {
    tips.push('Agrega al menos una experiencia laboral')
  }
  
  // Educación (15 puntos)
  if (resume.education && resume.education.length > 0) {
    score += 10
    if (resume.education.length >= 2) score += 5
  } else {
    tips.push('Agrega tu formación académica')
  }
  
  // Habilidades (20 puntos) - Detección de duplicados
  if (resume.skills && resume.skills.length > 0) {
    score += 10
    
    // Detectar duplicados (case insensitive)
    const uniqueSkills = new Set(resume.skills.map(s => s.toLowerCase()))
    if (uniqueSkills.size < resume.skills.length) {
      score -= 3
      tips.push('Tienes habilidades duplicadas, elimínalas')
    }
    
    if (resume.skills.length >= 4) score += 5
    if (resume.skills.length >= 8) score += 5
    if (resume.skills.length >= 12) score += 3
    
    if (resume.skills.length < 4) {
      tips.push('Agrega más habilidades (mínimo 4 recomendadas)')
    }
  } else {
    tips.push('Agrega tus habilidades técnicas y blandas')
  }
  
  // Extras (10 puntos bonus)
  if (resume.extras && resume.extras.length > 0) {
    score += Math.min(resume.extras.length * 3, 10)
    if (resume.extras.length >= 3) {
      tips.push('¡Perfecto! Información adicional completa')
    }
  } else {
    tips.push('Considera agregar información adicional (idiomas, certificaciones, etc.)')
  }
  
  return {
    score: Math.min(score, 100),
    tips: tips.slice(0, 5) // Máximo 5 tips
  }
}

export function getScoreLevel(score) {
  if (score >= 90) return { level: 'Excelente', color: 'green', text: 'Tu CV está completo y optimizado' }
  if (score >= 70) return { level: 'Muy Bueno', color: 'blue', text: 'Tu CV está bien, agrega más detalles' }
  if (score >= 50) return { level: 'Bueno', color: 'yellow', text: 'Tu CV necesita más información' }
  if (score >= 30) return { level: 'Regular', color: 'orange', text: 'Completa más secciones' }
  return { level: 'Incompleto', color: 'red', text: 'Completa la información básica' }
}
