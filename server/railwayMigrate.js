/**
 * Script de migración para Railway
 * Se ejecuta automáticamente después del deploy
 * También se puede ejecutar manualmente: railway run node server/railwayMigrate.js
 */

import 'dotenv/config'
import { testConnection } from './database.js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { query } from './database.js'
import { DEPARTMENTS } from '../src/data/employees.js'
import { USERS, HASHED_CREDENTIALS } from './authData.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function runMigration() {
  console.log('🚀 Iniciando migración en Railway...\n')

  // 1. Verificar conexión
  console.log('1️⃣ Verificando conexión a PostgreSQL...')
  const connected = await testConnection()
  if (!connected) {
    console.error('❌ No se pudo conectar a PostgreSQL')
    console.error('💡 Verifica las variables de entorno: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD')
    process.exit(1)
  }
  console.log('✅ Conectado a PostgreSQL\n')

  // 2. Crear esquema
  console.log('2️⃣ Creando esquema de base de datos...')
  try {
    const schemaSQL = readFileSync(join(__dirname, 'schema.sql'), 'utf8')
    await query(schemaSQL)
    await query('ALTER TABLE vacation_requests ADD COLUMN IF NOT EXISTS backup_employee_id VARCHAR(50) REFERENCES users(id)')
    console.log('✅ Esquema creado correctamente\n')
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('ℹ️  Esquema ya existe, continuando...\n')
    } else {
      console.error('❌ Error creando esquema:', error.message)
      process.exit(1)
    }
  }

  // 3. Insertar departamentos
  console.log('3️⃣ Insertando departamentos...')
  try {
    let deptCount = 0
    for (const dept of DEPARTMENTS) {
      const result = await query(
        `INSERT INTO departments (id, name, color, icon) 
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO NOTHING`,
        [dept.id, dept.name, dept.color, dept.icon]
      )
      if (result.rowCount > 0) deptCount++
    }
    console.log(`✅ ${deptCount} departamentos insertados\n`)
  } catch (error) {
    console.error('❌ Error insertando departamentos:', error.message)
  }

  // 4. Insertar usuarios
  console.log('4️⃣ Insertando usuarios...')
  try {
    let userCount = 0
    for (const user of USERS) {
      const passwordHash = HASHED_CREDENTIALS[user.email.toLowerCase()] || null
      
      const result = await query(
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
      if (result.rowCount > 0) userCount++
    }
    console.log(`✅ ${userCount} usuarios insertados/actualizados\n`)
  } catch (error) {
    console.error('❌ Error insertando usuarios:', error.message)
  }

  // 5. Verificar datos
  console.log('5️⃣ Verificando datos...')
  try {
    const deptResult = await query('SELECT COUNT(*) FROM departments')
    const userResult = await query('SELECT COUNT(*) FROM users')
    console.log(`✅ Departamentos: ${deptResult.rows[0].count}`)
    console.log(`✅ Usuarios: ${userResult.rows[0].count}\n`)
  } catch (error) {
    console.error('❌ Error verificando datos:', error.message)
  }

  console.log('✅ Migración completada exitosamente!')
  process.exit(0)
}

runMigration().catch((error) => {
  console.error('❌ Error fatal en migración:', error)
  process.exit(1)
})
