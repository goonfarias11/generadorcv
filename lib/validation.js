export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return {
    isValid: emailRegex.test(email),
    message: emailRegex.test(email) ? '' : 'Email inválido'
  }
}

export function validatePhone(phone) {
  // Acepta formatos: +54 11 1234-5678, 1234567890, etc
  const phoneRegex = /^[\d\s\-\+\(\)]{7,20}$/
  return {
    isValid: phoneRegex.test(phone),
    message: phoneRegex.test(phone) ? '' : 'Teléfono inválido (mínimo 7 dígitos)'
  }
}

export function validateRequiredField(value, fieldName = 'Campo') {
  const isValid = value && value.toString().trim().length > 0
  return {
    isValid,
    message: isValid ? '' : `${fieldName} es requerido`
  }
}

export function validateMinLength(value, minLength, fieldName = 'Campo') {
  const isValid = value && value.toString().trim().length >= minLength
  return {
    isValid,
    message: isValid ? '' : `${fieldName} debe tener al menos ${minLength} caracteres`
  }
}

export function validateExperienceStructure(experience) {
  const errors = []
  
  if (!experience.position || experience.position.trim().length === 0) {
    errors.push('La posición es requerida')
  }
  
  if (!experience.company || experience.company.trim().length === 0) {
    errors.push('La empresa es requerida')
  }
  
  if (!experience.startDate || experience.startDate.trim().length === 0) {
    errors.push('La fecha de inicio es requerida')
  }
  
  if (experience.description && experience.description.length < 20) {
    errors.push('La descripción debería tener al menos 20 caracteres')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export function validateEducationStructure(education) {
  const errors = []
  
  if (!education.degree || education.degree.trim().length === 0) {
    errors.push('El título es requerido')
  }
  
  if (!education.institution || education.institution.trim().length === 0) {
    errors.push('La institución es requerida')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export function validateUrl(url) {
  try {
    new URL(url)
    return { isValid: true, message: '' }
  } catch {
    return { isValid: false, message: 'URL inválida' }
  }
}
