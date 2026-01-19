import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react'
import { INITIAL_REQUESTS } from '@/data/initialRequests'
import { useToast } from './ToastContext'
import { useAuth } from './AuthContext'
import { useEmployees } from './EmployeeContext'
import type { VacationRequest } from '@/domain/types'

export interface RequestContextValue {
  requests: VacationRequest[]
  selectedYear: number
  setSelectedYear: (year: number) => void
  addRequest: (requestData: Omit<VacationRequest, 'id' | 'status' | 'requestDate'>) => Promise<VacationRequest>
  updateRequest: (id: string, updates: Partial<VacationRequest>) => void
  approveRequest: (id: string) => Promise<void>
  rejectRequest: (id: string, reason: string) => Promise<void>
  cancelRequest: (id: string) => void
  getRequestsByEmployee: (employeeId: string, year?: number) => VacationRequest[]
  getPendingRequests: (year?: number) => VacationRequest[]
  getRequestsForDate: (dateString: string) => VacationRequest[]
}

const RequestContext = createContext<RequestContextValue | null>(null)

export function RequestProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<VacationRequest[]>(INITIAL_REQUESTS)
  const [selectedYear, setSelectedYear] = useState<number>(2025)
  const { toast } = useToast()
  const { user } = useAuth()
  const { getEmployeeById } = useEmployees()

  const addRequest = useCallback(
    async (
      requestData: Omit<VacationRequest, 'id' | 'status' | 'requestDate'>
    ): Promise<VacationRequest> => {
      const newRequest: VacationRequest = {
        id: `r${Date.now()}`,
        ...requestData,
        status: 'pending',
        requestDate: new Date().toISOString().split('T')[0],
      }

      setRequests((prev) => [...prev, newRequest])
      
      // Enviar notificación a admins
      try {
        const employee = getEmployeeById(requestData.employeeId)
        if (employee) {
          await fetch('/api/notifications/new-request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              request: newRequest,
              employee,
            }),
          })
        }
      } catch (error) {
        console.error('Error enviando notificación:', error)
        // No fallar la creación de la solicitud si falla el email
      }
      
      toast.success('Solicitud enviada correctamente')

      return newRequest
    },
    [toast, getEmployeeById]
  )

  const updateRequest = useCallback(
    (id: string, updates: Partial<VacationRequest>) => {
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)))
    },
    []
  )

  const approveRequest = useCallback(
    async (id: string) => {
      if (!user) return

      const request = requests.find(r => r.id === id)
      if (!request) return

      const updatedRequest: VacationRequest = {
        ...request,
        status: 'approved',
        reviewer: user.name,
        reviewDate: new Date().toISOString().split('T')[0],
      }

      setRequests((prev) =>
        prev.map((r) => (r.id === id ? updatedRequest : r))
      )
      
      // Enviar notificación al empleado
      try {
        const employee = getEmployeeById(request.employeeId)
        if (employee) {
          await fetch('/api/notifications/approved', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              request: updatedRequest,
              employee,
              reviewerName: user.name,
            }),
          })
        }
      } catch (error) {
        console.error('Error enviando notificación:', error)
        // No fallar la aprobación si falla el email
      }
      
      toast.success('Solicitud aprobada')
    },
    [user, toast, requests, getEmployeeById]
  )

  const rejectRequest = useCallback(
    async (id: string, reason: string) => {
      if (!user) return

      const request = requests.find(r => r.id === id)
      if (!request) return

      const updatedRequest: VacationRequest = {
        ...request,
        status: 'rejected',
        reviewer: user.name,
        reviewDate: new Date().toISOString().split('T')[0],
        rejectionReason: reason,
      }

      setRequests((prev) =>
        prev.map((r) => (r.id === id ? updatedRequest : r))
      )
      
      // Enviar notificación al empleado
      try {
        const employee = getEmployeeById(request.employeeId)
        if (employee) {
          await fetch('/api/notifications/rejected', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              request: updatedRequest,
              employee,
              reviewerName: user.name,
              rejectionReason: reason,
            }),
          })
        }
      } catch (error) {
        console.error('Error enviando notificación:', error)
        // No fallar el rechazo si falla el email
      }
      
      toast.info('Solicitud rechazada')
    },
    [user, toast, requests, getEmployeeById]
  )

  const cancelRequest = useCallback(
    (id: string) => {
      setRequests((prev) => prev.filter((r) => r.id !== id))
      toast.success('Solicitud cancelada')
    },
    [toast]
  )

  const getRequestsByEmployee = useCallback(
    (employeeId: string, year: number = selectedYear) => {
      return requests.filter((r) => r.employeeId === employeeId && r.year === year)
    },
    [requests, selectedYear]
  )

  const getPendingRequests = useCallback(
    (year: number = selectedYear) => {
      return requests
        .filter((r) => r.status === 'pending' && r.year === year)
        .sort(
          (a, b) =>
            new Date(a.requestDate).getTime() -
            new Date(b.requestDate).getTime()
        )
    },
    [requests, selectedYear]
  )

  const getRequestsForDate = useCallback(
    (dateString: string) => {
      return requests.filter((r) => {
        if (r.status === 'rejected') return false
        return dateString >= r.startDate && dateString <= r.endDate
      })
    },
    [requests]
  )

  return (
    <RequestContext.Provider
      value={{
        requests,
        selectedYear,
        setSelectedYear,
        addRequest,
        updateRequest,
        approveRequest,
        rejectRequest,
        cancelRequest,
        getRequestsByEmployee,
        getPendingRequests,
        getRequestsForDate,
      }}
    >
      {children}
    </RequestContext.Provider>
  )
}

export function useRequests(): RequestContextValue {
  const context = useContext(RequestContext)
  if (!context) {
    throw new Error('useRequests must be used within a RequestProvider')
  }
  return context
}


