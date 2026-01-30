import { POLICIES } from '@/data/absenceTypes'
import { getDaysUntil } from './dateUtils'
import { parseISO, startOfYear, endOfYear } from 'date-fns'
import type {
  VacationRequest,
  BalanceSummary,
  AnalysisMessage,
  RequestAnalysis,
  Department,
  DepartmentStats,
} from '@/domain/types'

/**
 * Calcula los días de vacaciones prorrateados según fecha de incorporación
 */
export function calculateProratedDays(employeeStartDate: string | undefined, year: number): number {
  if (!employeeStartDate) {
    // Si no hay fecha de inicio, asumir año completo
    return POLICIES.vacationDaysPerYear
  }

  const startDate = parseISO(employeeStartDate)
  const yearStart = startOfYear(new Date(year, 0, 1))
  const yearEnd = endOfYear(new Date(year, 11, 31))

  // Si el empleado empezó antes del año, tiene año completo
  if (startDate < yearStart) {
    return POLICIES.vacationDaysPerYear
  }

  // Si el empleado empezó después del año, no tiene días
  if (startDate > yearEnd) {
    return 0
  }

  // Calcular meses trabajados en el año (incluyendo el mes de inicio)
  // Si empezó en julio (mes 6), trabaja julio-diciembre = 6 meses
  // Si empezó en septiembre (mes 8), trabaja septiembre-diciembre = 4 meses
  const startMonth = startDate.getMonth() // 0-11 (enero=0, diciembre=11)
  const monthsWorked = 12 - startMonth // Meses desde inicio hasta fin de año (inclusive)

  // Proratear: días completos * (meses trabajados / 12)
  const proratedDays = Math.round((POLICIES.vacationDaysPerYear * monthsWorked) / 12)

  return proratedDays
}

const getRequestYear = (request: VacationRequest): number => {
  if (typeof request.year === 'number') {
    return request.year
  }
  return new Date(request.startDate).getFullYear()
}

const calculateCarryOver = (
  employeeId: string,
  year: number,
  requests: VacationRequest[],
  employeeStartDate?: string | undefined
): number => {
  const previousYear = year - 1
  if (previousYear < 0) {
    return 0
  }

  const previousYearRequests = requests.filter(
    (r) => r.employeeId === employeeId && getRequestYear(r) === previousYear
  )

  const prevUsed = previousYearRequests
    .filter((r) => r.status === 'approved')
    .reduce((sum, r) => sum + r.days, 0)

  const prevPending = previousYearRequests
    .filter((r) => r.status === 'pending')
    .reduce((sum, r) => sum + r.days, 0)

  const prevTotal = calculateProratedDays(employeeStartDate, previousYear)
  const remaining = prevTotal - prevUsed - prevPending

  return Math.max(remaining, 0)
}

export const calculateBalance = (
  employeeId: string,
  year: number,
  requests: VacationRequest[],
  employeeStartDate?: string | undefined
): BalanceSummary => {
  const startDate = employeeStartDate

  const employeeRequests = requests.filter(
    (r) => r.employeeId === employeeId && getRequestYear(r) === year
  )

  const used = employeeRequests
    .filter((r) => r.status === 'approved')
    .reduce((sum, r) => sum + r.days, 0)

  const pending = employeeRequests
    .filter((r) => r.status === 'pending')
    .reduce((sum, r) => sum + r.days, 0)

  // Calcular días totales prorrateados según fecha de incorporación
  const proratedTotal = calculateProratedDays(startDate, year)

  const carryOver = calculateCarryOver(employeeId, year, requests, startDate)
  const total = proratedTotal + carryOver
  const available = total - used - pending

  return {
    year,
    total,
    used,
    pending,
    carryOver,
    available,
  }
}

export const analyzeRequest = (
  request: VacationRequest,
  allRequests: VacationRequest[],
  employees: Array<{ id: string; deptId: string; [key: string]: any }>
): RequestAnalysis => {
  const alerts: AnalysisMessage[] = []
  const warnings: AnalysisMessage[] = []
  const info: AnalysisMessage[] = []

  const employee = employees.find(e => e.id === request.employeeId)
  if (!employee) return { alerts, warnings, info }

  const departmentEmployees = employees.filter(e => e.deptId === employee.deptId)
  const approvedDeptRequests = allRequests.filter(
    (r) =>
      r.status === 'approved' &&
      departmentEmployees.some((e) => e.id === r.employeeId)
  )

  const startDate = parseISO(request.startDate)
  const endDate = parseISO(request.endDate)
  let maxAbsent = 0

  const currentDate = new Date(startDate)
  while (currentDate <= endDate) {
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      const absentCount =
        approvedDeptRequests.filter((r) => {
          const reqStart = parseISO(r.startDate)
          const reqEnd = parseISO(r.endDate)
          return currentDate >= reqStart && currentDate <= reqEnd
        }).length + 1

      if (absentCount > maxAbsent) {
        maxAbsent = absentCount
      }
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }

  const absencePercent =
    departmentEmployees.length > 0
      ? (maxAbsent / departmentEmployees.length) * 100
      : 0

  if (absencePercent > POLICIES.maxTeamAbsencePercent) {
    alerts.push({
      message: `⚠️ ${Math.round(absencePercent)}% del equipo ausente`,
      detail: 'Cobertura mínima del equipo en riesgo',
      severity: 'high',
    })
  } else if (absencePercent > 30) {
    warnings.push({
      message: `${Math.round(absencePercent)}% del equipo ausente`,
      detail: 'Verificar cobertura del equipo',
      severity: 'medium',
    })
  }

  if (request.days > POLICIES.maxConsecutiveDays) {
    alerts.push({
      message: `Excede ${POLICIES.maxConsecutiveDays} días consecutivos`,
      detail: 'Requiere aprobación especial',
      severity: 'high',
    })
  }

  const daysAdvance = getDaysUntil(request.startDate)
  if (daysAdvance < POLICIES.minAdvanceDays && daysAdvance >= 0) {
    warnings.push({
      message: `Poca antelación (${daysAdvance} días)`,
      detail: `Se recomienda mínimo ${POLICIES.minAdvanceDays} días`,
      severity: 'medium',
    })
  }

  const month = startDate.getMonth()
  if (month === 7 || month === 11) {
    info.push({
      message: '📅 Temporada alta',
      detail: 'Período de alta demanda de vacaciones',
      severity: 'info',
    })
  }

  return { alerts, warnings, info }
}

export const getDepartmentStats = (
  department: Department,
  year: number,
  requests: VacationRequest[],
  allEmployees: Array<{ id: string; deptId: string; startDate?: string; [key: string]: any }>
): DepartmentStats => {
  const employees = allEmployees.filter(e => e.deptId === department.id)
  
  // Calcular total de días (incluyendo carry-over) para el departamento
  const totalDays = employees.reduce((sum, emp) => {
    return sum + calculateBalance(emp.id, year, requests, emp.startDate).total
  }, 0)

  const usedDays = requests
    .filter(
      (r) =>
        r.year === year &&
        r.status === 'approved' &&
        employees.some((e) => e.id === r.employeeId)
    )
    .reduce((sum, r) => sum + r.days, 0)

  const pendingDays = requests
    .filter(
      (r) =>
        r.year === year &&
        r.status === 'pending' &&
        employees.some((e) => e.id === r.employeeId)
    )
    .reduce((sum, r) => sum + r.days, 0)

  return {
    ...department,
    employeeCount: employees.length,
    totalDays,
    usedDays,
    pendingDays,
    usagePercent:
      totalDays > 0 ? Math.round((usedDays / totalDays) * 100) : 0,
  }
}


