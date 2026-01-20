// Utilidades de reporting para el backend
// Estas funciones replican la lógica de calculations.ts para evitar dependencias de TypeScript

import { POLICIES } from '../src/data/absenceTypes.js'

/**
 * Calcula los días de vacaciones prorrateados según fecha de incorporación
 */
function calculateProratedDays(employeeStartDate, year) {
  if (!employeeStartDate) {
    // Si no hay fecha de inicio, asumir año completo
    return POLICIES.vacationDaysPerYear
  }

  const startDate = new Date(employeeStartDate)
  const yearStart = new Date(year, 0, 1)
  const yearEnd = new Date(year, 11, 31)

  // Si el empleado empezó antes del año, tiene año completo
  if (startDate < yearStart) {
    return POLICIES.vacationDaysPerYear
  }

  // Si el empleado empezó después del año, no tiene días
  if (startDate > yearEnd) {
    return 0
  }

  // Calcular meses trabajados en el año
  // Contar desde el mes de inicio hasta diciembre (mes 11)
  const startMonth = startDate.getMonth()
  const monthsWorked = 12 - startMonth

  // Proratear: días completos * (meses trabajados / 12)
  const proratedDays = Math.round((POLICIES.vacationDaysPerYear * monthsWorked) / 12)

  return proratedDays
}

/**
 * Calcula el balance de vacaciones de un empleado
 */
export function calculateBalance(employee, year, requests) {
  const employeeRequests = requests.filter((r) => {
    const requestYear = r.year ?? new Date(r.startDate).getFullYear()
    return r.employeeId === employee.id && requestYear === year
  })

  const used = employeeRequests
    .filter((r) => r.status === 'approved')
    .reduce((sum, r) => sum + r.days, 0)

  const pending = employeeRequests
    .filter((r) => r.status === 'pending')
    .reduce((sum, r) => sum + r.days, 0)

  // Calcular días totales prorrateados según fecha de incorporación
  const proratedTotal = calculateProratedDays(employee?.startDate, year)

  // No hay carry-over de 2024 - todos empiezan desde cero en 2025
  const carryOver = 0
  const total = proratedTotal
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

/**
 * Calcula estadísticas de un departamento
 */
export function getDepartmentStats(department, year, requests, employees) {
  const departmentEmployees = employees.filter((emp) => emp.deptId === department.id)
  
  // Calcular total de días prorrateados para todos los empleados del departamento
  const totalDays = departmentEmployees.reduce((sum, emp) => {
    return sum + calculateProratedDays(emp.startDate, year)
  }, 0)

  const usedDays = requests
    .filter(
      (r) =>
        r.year === year &&
        r.status === 'approved' &&
        departmentEmployees.some((e) => e.id === r.employeeId)
    )
    .reduce((sum, r) => sum + r.days, 0)

  const pendingDays = requests
    .filter(
      (r) =>
        r.year === year &&
        r.status === 'pending' &&
        departmentEmployees.some((e) => e.id === r.employeeId)
    )
    .reduce((sum, r) => sum + r.days, 0)

  return {
    ...department,
    employeeCount: departmentEmployees.length,
    totalDays,
    usedDays,
    pendingDays,
    usagePercent: totalDays > 0 ? Math.round((usedDays / totalDays) * 100) : 0,
  }
}

