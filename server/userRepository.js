/**
 * Repositorio de usuarios - Acceso a datos de usuarios en PostgreSQL
 */

import { query } from './database.js'
import bcrypt from 'bcrypt'

/**
 * Obtiene un usuario por email
 */
export async function getUserByEmail(email) {
  const result = await query(
    'SELECT * FROM users WHERE email = $1',
    [email.toLowerCase()]
  )
  return result.rows[0] || null
}

/**
 * Obtiene un usuario por ID
 */
export async function getUserById(id) {
  const result = await query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  )
  return result.rows[0] || null
}

/**
 * Obtiene todos los usuarios
 */
export async function getAllUsers() {
  const result = await query(
    'SELECT id, name, email, dept_id as "deptId", role, start_date as "startDate", created_at, updated_at FROM users ORDER BY name'
  )
  return result.rows
}

/**
 * Obtiene usuarios por departamento
 */
export async function getUsersByDepartment(deptId) {
  const result = await query(
    'SELECT id, name, email, dept_id as "deptId", role, start_date as "startDate" FROM users WHERE dept_id = $1 ORDER BY name',
    [deptId]
  )
  return result.rows
}

/**
 * Verifica contraseña de un usuario
 */
export async function verifyPassword(email, password) {
  const user = await getUserByEmail(email)
  if (!user || !user.password_hash) {
    return false
  }

  return await bcrypt.compare(password, user.password_hash)
}

/**
 * Actualiza la contraseña de un usuario
 */
export async function updateUserPassword(email, passwordHash) {
  await query(
    'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE email = $2',
    [passwordHash, email.toLowerCase()]
  )
  return true
}

/**
 * Crea un nuevo usuario
 */
export async function createUser(userData) {
  const { id, name, email, deptId, role, startDate, passwordHash } = userData
  
  const result = await query(
    `INSERT INTO users (id, name, email, dept_id, role, start_date, password_hash)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, name, email, dept_id as "deptId", role, start_date as "startDate"`,
    [id, name, email.toLowerCase(), deptId, role || 'employee', startDate || null, passwordHash || null]
  )
  
  return result.rows[0]
}

/**
 * Actualiza un usuario
 */
export async function updateUser(id, updates) {
  const fields = []
  const values = []
  let paramIndex = 1

  if (updates.name !== undefined) {
    fields.push(`name = $${paramIndex++}`)
    values.push(updates.name)
  }
  if (updates.email !== undefined) {
    fields.push(`email = $${paramIndex++}`)
    values.push(updates.email.toLowerCase())
  }
  if (updates.deptId !== undefined) {
    fields.push(`dept_id = $${paramIndex++}`)
    values.push(updates.deptId)
  }
  if (updates.role !== undefined) {
    fields.push(`role = $${paramIndex++}`)
    values.push(updates.role)
  }
  if (updates.startDate !== undefined) {
    fields.push(`start_date = $${paramIndex++}`)
    values.push(updates.startDate)
  }

  if (fields.length === 0) {
    return await getUserById(id)
  }

  values.push(id)
  const result = await query(
    `UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex} RETURNING *`,
    values
  )

  return result.rows[0] || null
}

/**
 * Elimina un usuario
 */
export async function deleteUser(id) {
  await query('DELETE FROM users WHERE id = $1', [id])
  return true
}
