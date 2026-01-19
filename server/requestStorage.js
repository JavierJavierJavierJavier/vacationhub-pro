/**
 * Almacenamiento en memoria de solicitudes para tracking de recordatorios
 * En producción, esto debería estar en una base de datos
 */

// Estructura: { requestId: { requestDate, lastReminderSent, reminderCount } }
const requestTracking = new Map()

/**
 * Registra una nueva solicitud para tracking
 */
export function trackRequest(requestId, requestDate) {
  requestTracking.set(requestId, {
    requestDate: new Date(requestDate),
    lastReminderSent: null,
    reminderCount: 0,
  })
}

/**
 * Obtiene información de tracking de una solicitud
 */
export function getRequestTracking(requestId) {
  return requestTracking.get(requestId)
}

/**
 * Marca que se envió un recordatorio
 */
export function markReminderSent(requestId) {
  const tracking = requestTracking.get(requestId)
  if (tracking) {
    tracking.lastReminderSent = new Date()
    tracking.reminderCount += 1
  }
}

/**
 * Elimina el tracking de una solicitud (cuando se aprueba/rechaza)
 */
export function removeRequestTracking(requestId) {
  requestTracking.delete(requestId)
}

/**
 * Obtiene todas las solicitudes que necesitan recordatorio
 */
export function getRequestsNeedingReminder(allRequests) {
  const now = new Date()
  const pendingRequests = allRequests.filter(r => r.status === 'pending')
  
  return pendingRequests.filter(request => {
    const tracking = requestTracking.get(request.id)
    if (!tracking) return false
    
    const requestDate = new Date(tracking.requestDate)
    const hoursSinceRequest = (now - requestDate) / (1000 * 60 * 60)
    
    // Primer recordatorio después de 24 horas
    if (tracking.reminderCount === 0 && hoursSinceRequest >= 24) {
      return true
    }
    
    // Segundo recordatorio después de 48 horas (24h después del primero)
    if (tracking.reminderCount === 1 && tracking.lastReminderSent) {
      const hoursSinceLastReminder = (now - new Date(tracking.lastReminderSent)) / (1000 * 60 * 60)
      if (hoursSinceLastReminder >= 24) {
        return true
      }
    }
    
    return false
  })
}

/**
 * Limpia solicitudes antiguas (más de 30 días)
 */
export function cleanupOldTracking() {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  
  for (const [requestId, tracking] of requestTracking.entries()) {
    if (tracking.requestDate < thirtyDaysAgo) {
      requestTracking.delete(requestId)
    }
  }
}

