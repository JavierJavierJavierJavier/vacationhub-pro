import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { PORT } from './config.js'
import { authRouter } from './authRoutes.js'
import { employeeRouter } from './employeeRoutes.js'
import { reportRouter } from './reportRoutes.js'
import { notificationRouter } from './notificationRoutes.js'
import { verifyEmailConnection } from './emailService.js'
import { startReminderScheduler } from './reminderScheduler.js'
import { testConnection } from './database.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api', authRouter)
app.use('/api', employeeRouter)
app.use('/api/reports', reportRouter)
app.use('/api/notifications', notificationRouter)

// Verificar conexión de base de datos al iniciar
testConnection().then(async (connected) => {
  if (connected) {
    console.log('✅ Database connection verified')
    // En Railway, ejecutar migración automáticamente si es necesario
    if (process.env.RAILWAY_ENVIRONMENT) {
      try {
        const { query } = await import('./database.js')
        const result = await query('SELECT COUNT(*) FROM users')
        if (result.rows[0].count === '0') {
          console.log('⚠️ Database empty, running migration...')
          // Ejecutar migración en background
          import('./railwayMigrate.js').catch(err => {
            console.error('Migration error:', err)
          })
        }
      } catch (error) {
        // Ignorar errores de migración automática
      }
    }
  } else {
    console.log('⚠️ Database not available, using in-memory data')
  }
}).catch(() => {
  console.log('⚠️ Database not available, using in-memory data')
})

// Verificar conexión de email al iniciar
verifyEmailConnection()

// Iniciar scheduler de recordatorios
startReminderScheduler()

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Auth API listening on http://localhost:${PORT}`)
})


