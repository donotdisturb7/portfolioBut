export const validatePassword = (password) => {
  if (!password) return 'Le mot de passe est requis'
  
  const minLength = 6
  
  if (password.length < minLength) {
    return 'Le mot de passe doit contenir au moins 6 caractères'
  }
  
  return ''
}

export const validateEmail = (email) => {
  if (!email) return 'L\'email est requis'
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return 'Format d\'email invalide'
  }
  
  return ''
}

export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} est requis`
  }
  return ''
}
