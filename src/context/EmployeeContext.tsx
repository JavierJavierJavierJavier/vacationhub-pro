import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react'
import { EMPLOYEES as INITIAL_EMPLOYEES } from '@/data/employees'
import { useToast } from './ToastContext'
import { calculateProratedDays } from '@/utils/calculations'
import type { Employee } from '@/domain/types'

interface EmployeeContextValue {
  employees: Employee[]
  addEmployee: (employeeData: Omit<Employee, 'id'>) => Employee
  updateEmployee: (id: string, updates: Partial<Employee>) => void
  deleteEmployee: (id: string) => void
  promoteToAdmin: (id: string) => void
  getEmployeeById: (id: string) => Employee | undefined
}

const EmployeeContext = createContext<EmployeeContextValue | null>(null)

export function EmployeeProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES as Employee[])
  const { toast } = useToast()

  const addEmployee = useCallback(
    (employeeData: Omit<Employee, 'id'>): Employee => {
      // Generar ID único
      const newId = `e${Date.now()}`
      
      const newEmployee: Employee = {
        id: newId,
        ...employeeData,
        role: employeeData.role || 'employee',
      }

      setEmployees((prev) => [...prev, newEmployee])
      
      // Calcular días prorrateados para mostrar en el toast
      const currentYear = new Date().getFullYear()
      const proratedDays = calculateProratedDays(employeeData.startDate, currentYear)
      
      toast.success(
        `${newEmployee.name} agregado. Días de vacaciones ${currentYear}: ${proratedDays} días`
      )

      return newEmployee
    },
    [toast]
  )

  const updateEmployee = useCallback(
    (id: string, updates: Partial<Employee>) => {
      setEmployees((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
      )
      toast.success('Empleado actualizado')
    },
    [toast]
  )

  const deleteEmployee = useCallback(
    (id: string) => {
      const employee = employees.find((e) => e.id === id)
      setEmployees((prev) => prev.filter((e) => e.id !== id))
      toast.info(`${employee?.name || 'Empleado'} eliminado`)
    },
    [employees, toast]
  )

  const promoteToAdmin = useCallback(
    (id: string) => {
      const employee = employees.find((e) => e.id === id)
      setEmployees((prev) =>
        prev.map((e) => (e.id === id ? { ...e, role: 'admin' as const } : e))
      )
      toast.success(`${employee?.name || 'Empleado'} promovido a administrador`)
    },
    [employees, toast]
  )

  const getEmployeeById = useCallback(
    (id: string) => {
      return employees.find((e) => e.id === id)
    },
    [employees]
  )

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        promoteToAdmin,
        getEmployeeById,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  )
}

export function useEmployees(): EmployeeContextValue {
  const context = useContext(EmployeeContext)
  if (!context) {
    throw new Error('useEmployees must be used within an EmployeeProvider')
  }
  return context
}


