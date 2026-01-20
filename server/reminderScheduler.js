import cron from 'node-cron'
import { sendEmail } from './emailService.js'
import { getReminderEmailTemplate } from './emailTemplates.js'
import {
  getRequestsNeedingReminder,
  markReminderSent,
  getRequestTracking,
  cleanupOldTracking,
} from './requestStorage.js'
import { query } from './database.js'

/**
 * Envía recordatorios a los admins sobre solicitudes pendientes
 */
async function sendReminders() {
  try {
    // Obtener todas las solicitudes pendientes desde el endpoint interno
    const port = process.env.PORT || 4000
    const schedulerToken = (process.env.INTERNAL_SCHEDULER_TOKEN || '').trim()
    const response = await fetch(`http://localhost:${port}/api/notifications/requests`, {
      headers: schedulerToken
        ? {
            Authorization: `Bearer ${schedulerToken}`,
            'x-internal-token': schedulerToken,
          }
        : undefined,
    })
    if (!response.ok) {
      console.error('Error obteniendo solicitudes:', response.statusText)
      return
    }
    const data = await response.json()
    const allRequests = data.requests || []
    
    // Obtener solicitudes que necesitan recordatorio
    const requestsNeedingReminder = getRequestsNeedingReminder(allRequests)
    
    if (requestsNeedingReminder.length === 0) {
      console.log('📧 No hay solicitudes que necesiten recordatorio')
      return
    }
    
    console.log(`📧 Enviando ${requestsNeedingReminder.length} recordatorio(s)...`)
    
    const usersResult = await query(
      'SELECT id, name, email, role FROM users'
    )
    const users = usersResult.rows
    const adminEmails = users.filter((u) => u.role === 'admin').map((u) => u.email)
    
    if (adminEmails.length === 0) {
      console.warn('⚠️ No hay administradores configurados')
      return
    }
    
    // Enviar recordatorios
    for (const request of requestsNeedingReminder) {
      const employee = users.find(e => e.id === request.employeeId)
      if (!employee) continue
      
      const tracking = getRequestTracking(request.id)
      if (!tracking) continue
      
      const reminderNumber = tracking.reminderCount + 1
      
      const emailTemplate = getReminderEmailTemplate({
        employeeName: employee.name,
        startDate: request.startDate,
        endDate: request.endDate,
        days: request.days,
        requestId: request.id,
        reminderNumber,
      })
      
      // Enviar a todos los admins
      const results = await Promise.all(
        adminEmails.map(email =>
          sendEmail({
            to: email,
            subject: emailTemplate.subject,
            html: emailTemplate.html,
            text: emailTemplate.text,
          })
        )
      )
      
      const successCount = results.filter(r => r.success).length
      
      if (successCount > 0) {
        markReminderSent(request.id)
        console.log(`✅ Recordatorio #${reminderNumber} enviado para solicitud ${request.id} (${successCount}/${adminEmails.length} emails)`)
      } else {
        console.error(`❌ Error enviando recordatorio para solicitud ${request.id}`)
      }
    }
    
    // Limpiar tracking antiguo
    cleanupOldTracking()
  } catch (error) {
    console.error('❌ Error en el scheduler de recordatorios:', error)
  }
}

/**
 * Inicia el scheduler de recordatorios
 * Se ejecuta cada hora para verificar solicitudes pendientes
 */
export function startReminderScheduler() {
  // Ejecutar cada hora
  cron.schedule('0 * * * *', () => {
    console.log('⏰ Ejecutando verificación de recordatorios...')
    sendReminders()
  })
  
  // También ejecutar inmediatamente al iniciar (para desarrollo/testing)
  console.log('📅 Scheduler de recordatorios iniciado (cada hora)')
  sendReminders()
}

