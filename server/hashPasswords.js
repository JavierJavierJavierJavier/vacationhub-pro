/**
 * Script para hashear todas las contraseñas existentes
 * Ejecutar con: node server/hashPasswords.js
 */

import bcrypt from 'bcrypt'
import { CREDENTIALS } from './authData.js'

const SALT_ROUNDS = 10

console.log('🔐 Hasheando contraseñas...\n')

const hashedCredentials = {}

for (const [email, password] of Object.entries(CREDENTIALS)) {
  const hash = await bcrypt.hash(password, SALT_ROUNDS)
  hashedCredentials[email] = hash
  console.log(`✅ ${email}: ${hash.substring(0, 30)}...`)
}

console.log('\n📝 Contraseñas hasheadas:')
console.log(JSON.stringify(hashedCredentials, null, 2))

console.log('\n💡 Copia este objeto y reemplázalo en authData.js como HASHED_CREDENTIALS')
