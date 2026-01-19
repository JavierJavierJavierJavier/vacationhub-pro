/**
 * Repositorio de tokens de reset de contraseña - PostgreSQL
 */

import { query } from './database.js'
import crypto from 'crypto'

const TOKEN_EXPIRY_HOURS = 1

/**
 * Genera un token aleatorio seguro
 */
function generateToken() {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Crea un token de reset para un email
 */
export async function createResetToken(email) {
  const token = generateToken()
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000)
  
  await query(
    `INSERT INTO password_reset_tokens (email, token, expires_at)
     VALUES ($1, $2, $3)
     ON CONFLICT (token) DO NOTHING`,
    [email.toLowerCase(), token, expiresAt]
  )
  
  return token
}

/**
 * Verifica si un token es válido
 */
export async function verifyResetToken(email, token) {
  const result = await query(
    `SELECT * FROM password_reset_tokens 
     WHERE email = $1 AND token = $2 AND expires_at > NOW() AND used = FALSE
     LIMIT 1`,
    [email.toLowerCase(), token]
  )
  
  return result.rows.length > 0
}

/**
 * Marca un token como usado
 */
export async function markTokenAsUsed(email, token) {
  await query(
    'UPDATE password_reset_tokens SET used = TRUE WHERE email = $1 AND token = $2',
    [email.toLowerCase(), token]
  )
}

/**
 * Elimina tokens expirados
 */
export async function cleanupExpiredTokens() {
  await query(
    'DELETE FROM password_reset_tokens WHERE expires_at < NOW() OR used = TRUE'
  )
}
