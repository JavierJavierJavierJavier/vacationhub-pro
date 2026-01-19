import { useMemo } from 'react'
import { useRequests } from '@/context/RequestContext'
import { useEmployees } from '@/context/EmployeeContext'
import { calculateBalance } from '@/utils/calculations'
import type { BalanceSummary } from '@/domain/types'

export const useBalance = (employeeId: string | undefined | null): BalanceSummary => {
  const { requests, selectedYear } = useRequests()
  const { getEmployeeById } = useEmployees()

  return useMemo(() => {
    if (!employeeId) {
      // Return default balance when no employeeId provided
      return {
        year: selectedYear,
        total: 0,
        used: 0,
        pending: 0,
        carryOver: 0,
        available: 0,
      }
    }
    const employee = getEmployeeById(employeeId)
    return calculateBalance(employeeId, selectedYear, requests, employee?.startDate)
  }, [employeeId, requests, selectedYear, getEmployeeById])
}


