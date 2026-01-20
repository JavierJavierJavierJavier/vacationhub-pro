/**
 * Configuración y conexión a PostgreSQL
 */

import pg from 'pg'
const { Pool } = pg

const envTrim = (value) => (typeof value === 'string' ? value.trim() : value)

const resolvedPort = Number.parseInt(envTrim(process.env.DB_PORT) || '5432', 10)
const safePort = Number.isFinite(resolvedPort) ? resolvedPort : 5432

// Configuración de la conexión
const pool = new Pool({
  host: envTrim(process.env.DB_HOST) || 'localhost',
  port: safePort,
  database: envTrim(process.env.DB_NAME) || 'vacationhub',
  user: envTrim(process.env.DB_USER) || 'postgres',
  password: envTrim(process.env.DB_PASSWORD) || 'postgres',
  ssl: envTrim(process.env.DB_SSL) === 'true' ? { rejectUnauthorized: false } : false,
  max: 20, // Máximo de conexiones en el pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Manejo de errores del pool
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

/**
 * Ejecuta una query
 */
export async function query(text, params) {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    if (process.env.NODE_ENV === 'development') {
      console.log('Executed query', { text, duration, rows: res.rowCount })
    }
    return res
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

/**
 * Obtiene un cliente del pool para transacciones
 */
export async function getClient() {
  const client = await pool.connect()
  return client
}

/**
 * Verifica la conexión a la base de datos
 */
export async function testConnection() {
  try {
    const result = await query('SELECT NOW()')
    console.log('✅ Database connected:', result.rows[0].now)
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    return false
  }
}

export default pool
