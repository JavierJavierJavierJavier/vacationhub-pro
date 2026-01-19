import { useMemo } from 'react'
import { useRequests } from '@/context/RequestContext'

export type RequestFilter = 'all' | 'pending' | 'approved' | 'rejected'

export const useUserRequests = (
  employeeId: string | undefined | null,
  filter: RequestFilter
) => {
  const { selectedYear, getRequestsByEmployee } = useRequests()

  return useMemo(() => {
    if (!employeeId) return []
    let filtered = getRequestsByEmployee(employeeId, selectedYear)
    if (filter !== 'all') {
      filtered = filtered.filter((r) => r.status === filter)
    }
    return filtered.sort(
      (a, b) =>
        new Date(b.requestDate).getTime() -
        new Date(a.requestDate).getTime()
    )
  }, [employeeId, selectedYear, filter, getRequestsByEmployee])
}


