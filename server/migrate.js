/**
 * Script de migración inicial
 * Ejecutar con: node server/migrate.js
 * 
 * Este script:
 * 1. Crea las tablas si no existen
 * 2. Inserta datos iniciales (departamentos, usuarios, etc.)
 */

import 'dotenv/config'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { query, testConnection } from './database.js'
import { USERS, HASHED_CREDENTIALS } from './authData.js'
import { DEPARTMENTS } from '../src/data/employees.js'
import bcrypt from 'bcrypt'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function runMigration() {
  console.log('🚀 Iniciando migración de base de datos...\n')

  // 1. Verificar conexión
  console.log('1️⃣ Verificando conexión...')
  const connected = await testConnection()
  if (!connected) {
    console.error('❌ No se pudo conectar a la base de datos')
    console.error('💡 Verifica las variables de entorno: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD')
    process.exit(1)
  }

  // 2. Crear esquema
  console.log('\n2️⃣ Creando esquema...')
  try {
    const schemaSQL = readFileSync(join(__dirname, 'schema.sql'), 'utf8')
    await query(schemaSQL)
    await query('ALTER TABLE vacation_requests ADD COLUMN IF NOT EXISTS backup_employee_id VARCHAR(50) REFERENCES users(id)')
    console.log('✅ Esquema creado correctamente')
  } catch (error) {
    console.error('❌ Error creando esquema:', error.message)
    process.exit(1)
  }

  // 3. Insertar departamentos
  console.log('\n3️⃣ Insertando departamentos...')
  try {
    for (const dept of DEPARTMENTS) {
      await query(
        `INSERT INTO departments (id, name, color, icon) 
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO NOTHING`,
        [dept.id, dept.name, dept.color, dept.icon]
      )
    }
    console.log(`✅ ${DEPARTMENTS.length} departamentos insertados`)
  } catch (error) {
    console.error('❌ Error insertando departamentos:', error.message)
  }

  // 4. Insertar usuarios
  console.log('\n4️⃣ Insertando usuarios...')
  try {
    let inserted = 0
    for (const user of USERS) {
      const passwordHash = HASHED_CREDENTIALS[user.email.toLowerCase()] || null
      
      await query(
        `INSERT INTO users (id, name, email, dept_id, role, start_date, password_hash) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           email = EXCLUDED.email,
           dept_id = EXCLUDED.dept_id,
           role = EXCLUDED.role,
           start_date = EXCLUDED.start_date,
           password_hash = COALESCE(EXCLUDED.password_hash, users.password_hash)`,
        [
          user.id,
          user.name,
          user.email,
          user.deptId,
          user.role,
          user.startDate || null,
          passwordHash,
        ]
      )
      inserted++
    }
    console.log(`✅ ${inserted} usuarios insertados/actualizados`)
  } catch (error) {
    console.error('❌ Error insertando usuarios:', error.message)
  }

  // 5. Verificar datos
  console.log('\n5️⃣ Verificando datos...')
  try {
    const deptCount = await query('SELECT COUNT(*) FROM departments')
    const userCount = await query('SELECT COUNT(*) FROM users')
    console.log(`✅ Departamentos: ${deptCount.rows[0].count}`)
    console.log(`✅ Usuarios: ${userCount.rows[0].count}`)
  } catch (error) {
    console.error('❌ Error verificando datos:', error.message)
  }

  console.log('\n✅ Migración completada exitosamente!')
  process.exit(0)
}

runMigration().catch((error) => {
  console.error('❌ Error fatal en migración:', error)
  process.exit(1)
})
