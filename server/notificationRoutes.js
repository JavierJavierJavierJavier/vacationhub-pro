import express from 'express'
import { sendEmail } from './emailService.js'
import {
  getNewRequestEmailTemplate,
  getReminderEmailTemplate,
  getApprovalEmailTemplate,
  getRejectionEmailTemplate,
} from './emailTemplates.js'
import { trackRequest, markReminderSent, removeRequestTracking, getRequestTracking } from './requestStorage.js'
import { EMPLOYEES } from '../src/data/employees.js'
import { INITIAL_REQUESTS } from '../src/data/initialRequests.js'

export const notificationRouter = express.Router()

// Almacenar solicitudes en memoria (en producción usar BD)
let allRequests = [...INITIAL_REQUESTS]

/**
 * Endpoint para notificar nueva solicitud a admins
 */
notificationRouter.post('/new-request', async (req, res) => {
  try {
    const { request, employee } = req.body
    
    if (!request || !employee) {
      return res.status(400).json({ success: false, error: 'Datos incompletos' })
    }
    
    // Registrar solicitud para tracking
    trackRequest(request.id, request.requestDate)
    
    // Obtener todos los admins
    const admins = EMPLOYEES.filter(e => e.role === 'admin')
    const adminEmails = admins.map(a => a.email)
    
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
    
    // Guardar solicitud en memoria
    allRequests.push(request)
    
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
notificationRouter.post('/approved', async (req, res) => {
  try {
    const { request, employee, reviewerName } = req.body
    
    if (!request || !employee) {
      return res.status(400).json({ success: false, error: 'Datos incompletos' })
    }
    
    // Eliminar tracking (ya no necesita recordatorios)
    removeRequestTracking(request.id)
    
    // Actualizar solicitud en memoria
    const index = allRequests.findIndex(r => r.id === request.id)
    if (index !== -1) {
      allRequests[index] = request
    }
    
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
notificationRouter.post('/rejected', async (req, res) => {
  try {
    const { request, employee, reviewerName, rejectionReason } = req.body
    
    if (!request || !employee) {
      return res.status(400).json({ success: false, error: 'Datos incompletos' })
    }
    
    // Eliminar tracking (ya no necesita recordatorios)
    removeRequestTracking(request.id)
    
    // Actualizar solicitud en memoria
    const index = allRequests.findIndex(r => r.id === request.id)
    if (index !== -1) {
      allRequests[index] = request
    }
    
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
notificationRouter.get('/requests', (req, res) => {
  res.json({ requests: allRequests })
})

/**
 * Endpoint para enviar recordatorios manualmente (para testing)
 */
notificationRouter.post('/send-reminders', async (req, res) => {
  try {
    const { requests, employees } = req.body
    
    if (!requests || !employees) {
      return res.status(400).json({ success: false, error: 'Datos incompletos' })
    }
    
    const admins = EMPLOYEES.filter(e => e.role === 'admin')
    const adminEmails = admins.map(a => a.email)
    
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

