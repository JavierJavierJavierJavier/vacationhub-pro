export const ABSENCE_TYPES = [
  { id: 'vacation', name: 'Vacaciones', icon: '🏖️', deducts: true, color: '#10b981' },
  { id: 'sick', name: 'Baja médica', icon: '🏥', deducts: false, color: '#ef4444' },
  { id: 'personal', name: 'Asuntos propios', icon: '👤', deducts: true, color: '#6366f1' },
  { id: 'wedding', name: 'Matrimonio', icon: '💒', deducts: false, color: '#ec4899' },
  { id: 'birth', name: 'Nacimiento/Adopción', icon: '👶', deducts: false, color: '#f59e0b' },
  { id: 'remote', name: 'Teletrabajo', icon: '🏠', deducts: false, color: '#8b5cf6' },
  { id: 'bereavement', name: 'Fallecimiento familiar', icon: '🕯️', deducts: false, color: '#64748b' },
  { id: 'medical', name: 'Cita médica', icon: '🩺', deducts: false, color: '#06b6d4' },
]

export const getAbsenceType = (id) => ABSENCE_TYPES.find(t => t.id === id)

export const getAbsenceIcon = (id) => {
  const type = getAbsenceType(id)
  return type?.icon || '📅'
}

export const doesAbsenceDeduct = (id) => {
  const type = getAbsenceType(id)
  return type?.deducts ?? true
}

// Company policies
export const POLICIES = {
  vacationDaysPerYear: 24,
  maxConsecutiveDays: 15,
  minAdvanceDays: 7,
  maxTeamAbsencePercent: 50,
  carryOverLimit: 5, // Max days that can be carried over to next year
}
