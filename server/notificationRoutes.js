import express from 'express'
import { authenticateJWT } from './authMiddleware.js'
import { sendEmail } from './emailService.js'
import {
  getNewRequestEmailTemplate,
  getReminderEmailTemplate,
  getApprovalEmailTemplate,
  getRejectionEmailTemplate,
} from './emailTemplates.js'
import { trackRequest, markReminderSent, removeRequestTracking, getRequestTracking } from './requestStorage.js'
import { query } from './database.js'

export const notificationRouter = express.Router()

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Acceso solo para administradores' })
  }
  next()
}

function allowScheduler(req, res, next) {
  const authHeader = req.headers['authorization']
  const headerToken = authHeader ? authHeader.replace('Bearer ', '') : ''
  const internalHeader = req.headers['x-internal-token'] || ''
  const token = String(internalHeader || headerToken).trim()
  if (token && token === (process.env.INTERNAL_SCHEDULER_TOKEN || '').trim()) {
    return next()
  }
  return authenticateJWT(req, res, () => requireAdmin(req, res, next))
}

async function getAdminEmails() {
  const result = await query(
    "SELECT email FROM users WHERE role = 'admin' ORDER BY email"
  )
  return result.rows.map((row) => row.email)
}

/**
 * Endpoint para notificar nueva solicitud a admins
 */
notificationRouter.post('/new-request', authenticateJWT, async (req, res) => {
  try {
    const { request, employee } = req.body
    
    if (!request || !employee) {
      return res.status(400).json({ success: false, error: 'Datos incompletos' })
    }
    
    // Registrar solicitud para tracking
    trackRequest(request.id, request.requestDate)
    
    // Obtener todos los admins desde BD
    const adminEmails = await getAdminEmails()
    
    if (adminEmails.length === 0) {
      return res.status(400).json({ success: false, error: 'No hay administradores configurados' })
    }
    
    // Crear template de email
    const emailTemplate = getNewRequestEmailTemplate({
      employeeName: employee.name,
      startDate: request.startDate,
      endDate: request.endDate,
      days: request.days,
      reason: request.reason,
      requestId: request.id,
    })
    
    // Enviar email a todos los admins
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
    
    res.json({
      success: true,
      emailsSent: results.filter(r => r.success).length,
      totalAdmins: adminEmails.length,
    })
  } catch (error) {
    console.error('Error en /new-request:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

/**
 * Endpoint para notificar aprobación al empleado
 */
notificationRouter.post('/approved', authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const { request, employee, reviewerName } = req.body
    
    if (!request || !employee) {
      return res.status(400).json({ success: false, error: 'Datos incompletos' })
    }
    
    // Eliminar tracking (ya no necesita recordatorios)
    removeRequestTracking(request.id)
    
    // Crear template de email
    const emailTemplate = getApprovalEmailTemplate({
      employeeName: employee.name,
      startDate: request.startDate,
      endDate: request.endDate,
      days: request.days,
      reviewerName: reviewerName || 'Administrador',
    })
    
    // Enviar email al empleado
    const result = await sendEmail({
      to: employee.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    })
    
    res.json({
      success: result.success,
      messageId: result.messageId,
    })
  } catch (error) {
    console.error('Error en /approved:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

/**
 * Endpoint para notificar rechazo al empleado
 */
notificationRouter.post('/rejected', authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const { request, employee, reviewerName, rejectionReason } = req.body
    
    if (!request || !employee) {
      return res.status(400).json({ success: false, error: 'Datos incompletos' })
    }
    
    // Eliminar tracking (ya no necesita recordatorios)
    removeRequestTracking(request.id)
    
    // Crear template de email
    const emailTemplate = getRejectionEmailTemplate({
      employeeName: employee.name,
      startDate: request.startDate,
      endDate: request.endDate,
      days: request.days,
      reviewerName: reviewerName || 'Administrador',
      rejectionReason: rejectionReason || '',
    })
    
    // Enviar email al empleado
    const result = await sendEmail({
      to: employee.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    })
    
    res.json({
      success: result.success,
      messageId: result.messageId,
    })
  } catch (error) {
    console.error('Error en /rejected:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

/**
 * Endpoint para obtener todas las solicitudes (para el scheduler)
 */
notificationRouter.get('/requests', allowScheduler, async (_req, res) => {
  try {
    const result = await query(
      `SELECT id,
              employee_id as "employeeId",
              TO_CHAR(start_date, 'YYYY-MM-DD') as "startDate",
              TO_CHAR(end_date, 'YYYY-MM-DD') as "endDate",
              days,
              status,
              TO_CHAR(request_date, 'YYYY-MM-DD') as "requestDate"
       FROM vacation_requests
       WHERE status = 'pending'`
    )
    res.json({ requests: result.rows })
  } catch (error) {
    console.error('Error loading requests for reminders:', error)
    res.status(500).json({ success: false, error: 'No se pudieron cargar solicitudes' })
  }
})

/**
 * Endpoint para enviar recordatorios manualmente (para testing)
 */
notificationRouter.post('/send-reminders', authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const { requests, employees } = req.body
    
    if (!requests || !employees) {
      return res.status(400).json({ success: false, error: 'Datos incompletos' })
    }
    
    const adminEmails = await getAdminEmails()
    
    const results = []
    
    for (const request of requests) {
      const employee = employees.find(e => e.id === request.employeeId)
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
      
      const emailResults = await Promise.all(
        adminEmails.map(email =>
          sendEmail({
            to: email,
            subject: emailTemplate.subject,
            html: emailTemplate.html,
            text: emailTemplate.text,
          })
        )
      )
      
      markReminderSent(request.id)
      
      results.push({
        requestId: request.id,
        reminderNumber,
        emailsSent: emailResults.filter(r => r.success).length,
      })
    }
    
    res.json({
      success: true,
      remindersSent: results.length,
      results,
    })
  } catch (error) {
    console.error('Error en /send-reminders:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

