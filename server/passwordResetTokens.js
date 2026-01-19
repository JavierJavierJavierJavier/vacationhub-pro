/**
 * Gestión de tokens de reset de contraseña
 * En producción, esto debería estar en base de datos
 */

const resetTokens = new Map() // email -> { token, expiresAt }

const TOKEN_EXPIRY_HOURS = 1 // Token válido por 1 hora

/**
 * Genera un token aleatorio seguro
 */
function generateToken() {
  return require('crypto').randomBytes(32).toString('hex')
}

/**
 * Crea un token de reset para un email
 */
export function createResetToken(email) {
  const token = generateToken()
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000)
  
  resetTokens.set(email.toLowerCase(), {
    token,
    expiresAt,
  })
  
  return token
}

/**
 * Verifica si un token es válido
 */
export function verifyResetToken(email, token) {
  const emailLower = email.toLowerCase()
  const tokenData = resetTokens.get(emailLower)
  
  if (!tokenData) {
    return false
  }
  
  if (tokenData.token !== token) {
    return false
  }
  
  if (new Date() > tokenData.expiresAt) {
    resetTokens.delete(emailLower)
    return false
  }
  
  return true
}

/**
 * Elimina un token después de usarlo
 */
export function deleteResetToken(email) {
  resetTokens.delete(email.toLowerCase())
}

/**
 * Limpia tokens expirados (ejecutar periódicamente)
 */
export function cleanupExpiredTokens() {
  const now = new Date()
  for (const [email, tokenData] of resetTokens.entries()) {
    if (now > tokenData.expiresAt) {
      resetTokens.delete(email)
    }
  }
}
