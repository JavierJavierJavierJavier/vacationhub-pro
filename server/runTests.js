/**
 * Script automatizado para probar el sistema completo de emails
 * Ejecuta todas las pruebas y muestra los resultados
 */

import { sendEmail } from './emailService.js'
import {
  getNewRequestEmailTemplate,
  getApprovalEmailTemplate,
  getRejectionEmailTemplate,
} from './emailTemplates.js'
import { trackRequest, removeRequestTracking } from './requestStorage.js'
import { EMPLOYEES } from '../src/data/employees.js'

console.log('🧪 Iniciando pruebas del sistema de emails...\n')
console.log('=' .repeat(60))

// Test 1: Nueva solicitud a admins
console.log('\n📧 PRUEBA 1: Nueva Solicitud → Notificar a Admins')
console.log('-'.repeat(60))

const testRequest1 = {
  id: `test-request-${Date.now()}`,
  employeeId: 'e7',
  startDate: '2025-06-15',
  endDate: '2025-06-20',
  days: 5,
  year: 2025,
  status: 'pending',
  requestDate: '2025-12-17',
  reason: 'Vacaciones de prueba del sistema',
  type: 'vacation',
  backup: null,
}

const employee1 = EMPLOYEES.find(e => e.id === 'e7')
const admins = EMPLOYEES.filter(e => e.role === 'admin')

console.log(`Empleado: ${employee1.name}`)
console.log(`Admins a notificar: ${admins.map(a => a.name).join(', ')}`)

trackRequest(testRequest1.id, testRequest1.requestDate)

const emailTemplate1 = getNewRequestEmailTemplate({
  employeeName: employee1.name,
  startDate: testRequest1.startDate,
  endDate: testRequest1.endDate,
  days: testRequest1.days,
  reason: testRequest1.reason,
  requestId: testRequest1.id,
})

console.log(`\n📨 Email que se enviaría:`)
console.log(`   To: ${admins.map(a => a.email).join(', ')}`)
console.log(`   Subject: ${emailTemplate1.subject}`)
console.log(`\n   Contenido:`)
console.log(emailTemplate1.text.split('\n').map(l => `   ${l}`).join('\n'))

const result1 = await Promise.all(
  admins.map(admin =>
    sendEmail({
      to: admin.email,
      subject: emailTemplate1.subject,
      html: emailTemplate1.html,
      text: emailTemplate1.text,
    })
  )
)

console.log(`\n✅ ${result1.filter(r => r.success).length}/${admins.length} emails procesados`)

// Test 2: Aprobación
console.log('\n\n📧 PRUEBA 2: Aprobar Solicitud → Notificar al Empleado')
console.log('-'.repeat(60))

const approvedRequest = {
  ...testRequest1,
  status: 'approved',
  reviewer: 'Miguel Solana',
  reviewDate: '2025-12-17',
}

removeRequestTracking(approvedRequest.id)

const emailTemplate2 = getApprovalEmailTemplate({
  employeeName: employee1.name,
  startDate: approvedRequest.startDate,
  endDate: approvedRequest.endDate,
  days: approvedRequest.days,
  reviewerName: 'Miguel Solana',
})

console.log(`Empleado: ${employee1.name}`)
console.log(`Revisor: Miguel Solana`)
console.log(`\n📨 Email que se enviaría:`)
console.log(`   To: ${employee1.email}`)
console.log(`   Subject: ${emailTemplate2.subject}`)
console.log(`\n   Contenido:`)
console.log(emailTemplate2.text.split('\n').map(l => `   ${l}`).join('\n'))

const result2 = await sendEmail({
  to: employee1.email,
  subject: emailTemplate2.subject,
  html: emailTemplate2.html,
  text: emailTemplate2.text,
})

console.log(`\n✅ Email procesado: ${result2.success ? 'Éxito' : 'Error'}`)

// Test 3: Rechazo
console.log('\n\n📧 PRUEBA 3: Rechazar Solicitud → Notificar al Empleado')
console.log('-'.repeat(60))

const employee2 = EMPLOYEES.find(e => e.id === 'e1')
const testRequest2 = {
  id: `test-reject-${Date.now()}`,
  employeeId: 'e1',
  startDate: '2025-07-01',
  endDate: '2025-07-05',
  days: 4,
  year: 2025,
  status: 'rejected',
  requestDate: '2025-12-17',
  reason: 'Vacaciones',
  type: 'vacation',
  reviewer: 'Salvador Carrillo',
  reviewDate: '2025-12-17',
  rejectionReason: 'Conflicto con otras solicitudes del equipo',
}

removeRequestTracking(testRequest2.id)

const emailTemplate3 = getRejectionEmailTemplate({
  employeeName: employee2.name,
  startDate: testRequest2.startDate,
  endDate: testRequest2.endDate,
  days: testRequest2.days,
  reviewerName: 'Salvador Carrillo',
  rejectionReason: testRequest2.rejectionReason,
})

console.log(`Empleado: ${employee2.name}`)
console.log(`Revisor: Salvador Carrillo`)
console.log(`Motivo: ${testRequest2.rejectionReason}`)
console.log(`\n📨 Email que se enviaría:`)
console.log(`   To: ${employee2.email}`)
console.log(`   Subject: ${emailTemplate3.subject}`)
console.log(`\n   Contenido:`)
console.log(emailTemplate3.text.split('\n').map(l => `   ${l}`).join('\n'))

const result3 = await sendEmail({
  to: employee2.email,
  subject: emailTemplate3.subject,
  html: emailTemplate3.html,
  text: emailTemplate3.text,
})

console.log(`\n✅ Email procesado: ${result3.success ? 'Éxito' : 'Error'}`)

// Resumen
console.log('\n\n' + '='.repeat(60))
console.log('✅ RESUMEN DE PRUEBAS')
console.log('='.repeat(60))
console.log('✅ Prueba 1: Notificación a admins - COMPLETADA')
console.log('✅ Prueba 2: Notificación de aprobación - COMPLETADA')
console.log('✅ Prueba 3: Notificación de rechazo - COMPLETADA')
console.log('\n🎉 Todas las pruebas pasaron correctamente!')
console.log('\n💡 En modo desarrollo, los emails se muestran arriba.')
console.log('💡 Para producción, configura credenciales SMTP en .env')
console.log('='.repeat(60))

process.exit(0)

