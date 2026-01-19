/**
 * Script de prueba para verificar el sistema de recordatorios
 * Ejecutar con: node server/testReminders.js
 */

import { trackRequest, getRequestsNeedingReminder, markReminderSent, getRequestTracking } from './requestStorage.js'

// Simular solicitudes de prueba
const testRequests = [
  {
    id: 'test-1',
    employeeId: 'e7',
    status: 'pending',
    startDate: '2025-06-15',
    endDate: '2025-06-20',
    days: 5,
    requestDate: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString().split('T')[0], // 25 horas atrás
  },
  {
    id: 'test-2',
    employeeId: 'e1',
    status: 'pending',
    startDate: '2025-07-01',
    endDate: '2025-07-05',
    days: 4,
    requestDate: new Date(Date.now() - 49 * 60 * 60 * 1000).toISOString().split('T')[0], // 49 horas atrás
  },
  {
    id: 'test-3',
    employeeId: 'e3',
    status: 'pending',
    startDate: '2025-08-10',
    endDate: '2025-08-15',
    days: 5,
    requestDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 horas atrás (no necesita recordatorio)
  },
]

console.log('🧪 Probando sistema de recordatorios...\n')

// Registrar solicitudes de prueba
testRequests.forEach(req => {
  trackRequest(req.id, req.requestDate)
  console.log(`📝 Registrada solicitud ${req.id} (${req.requestDate})`)
})

console.log('\n⏰ Verificando solicitudes que necesitan recordatorio...\n')

// Verificar cuáles necesitan recordatorio
const needsReminder = getRequestsNeedingReminder(testRequests)

console.log(`📊 Solicitudes que necesitan recordatorio: ${needsReminder.length}\n`)

needsReminder.forEach(req => {
  const tracking = getRequestTracking(req.id)
  const hoursAgo = Math.round((Date.now() - new Date(tracking.requestDate).getTime()) / (1000 * 60 * 60))
  console.log(`  - Solicitud ${req.id}:`)
  console.log(`    • Horas desde solicitud: ${hoursAgo}h`)
  console.log(`    • Recordatorios enviados: ${tracking.reminderCount}`)
  console.log(`    • Necesita recordatorio #${tracking.reminderCount + 1}`)
  console.log('')
})

if (needsReminder.length > 0) {
  console.log('✅ El sistema detecta correctamente las solicitudes que necesitan recordatorio')
} else {
  console.log('ℹ️  No hay solicitudes que necesiten recordatorio en este momento')
}

console.log('\n📋 Estado de todas las solicitudes:')
testRequests.forEach(req => {
  const tracking = getRequestTracking(req.id)
  if (tracking) {
    const hoursAgo = Math.round((Date.now() - new Date(tracking.requestDate).getTime()) / (1000 * 60 * 60))
    console.log(`  ${req.id}: ${hoursAgo}h atrás, ${tracking.reminderCount} recordatorio(s) enviado(s)`)
  }
})

process.exit(0)

