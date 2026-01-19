/**
 * Script de prueba para verificar la configuración de email
 * Ejecutar con: node server/testEmail.js
 */

import 'dotenv/config'
import { sendEmail, verifyEmailConnection } from './emailService.js'
import { getNewRequestEmailTemplate } from './emailTemplates.js'

async function testEmail() {
  console.log('🧪 Probando configuración de email...\n')
  
  // Verificar conexión
  const connectionOk = await verifyEmailConnection()
  console.log('')
  
  if (!connectionOk && !process.env.SMTP_USER) {
    console.log('ℹ️  Modo desarrollo: Los emails se mostrarán en consola\n')
  }
  
  // Crear un email de prueba
  const testEmailTemplate = getNewRequestEmailTemplate({
    employeeName: 'Empleado de Prueba',
    startDate: '2025-06-15',
    endDate: '2025-06-20',
    days: 5,
    reason: 'Vacaciones de prueba',
    requestId: 'test-123',
  })
  
  // Obtener email de destino desde variables de entorno o usar uno por defecto
  // Para Mailtrap, usar un email válido (no el username)
  const testEmail = process.env.TEST_EMAIL || 'test@example.com'
  
  console.log(`📧 Enviando email de prueba a: ${testEmail}\n`)
  
  const result = await sendEmail({
    to: testEmail,
    subject: testEmailTemplate.subject,
    html: testEmailTemplate.html,
    text: testEmailTemplate.text,
  })
  
  if (result.success) {
    console.log('✅ Email enviado correctamente!')
    console.log(`   Message ID: ${result.messageId}`)
  } else {
    console.log('❌ Error enviando email:', result.error)
  }
  
  process.exit(0)
}

testEmail().catch(console.error)

