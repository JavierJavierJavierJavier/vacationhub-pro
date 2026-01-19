// Tipos de dominio compartidos en toda la aplicación

export type RequestStatus = 'pending' | 'approved' | 'rejected'

export interface VacationRequest {
  id: string
  employeeId: string
  year: number
  status: RequestStatus
  days: number
  startDate: string
  endDate: string
  requestDate: string
  reason: string
  type: string
  backup: string | null
  reviewer?: string
  reviewDate?: string
  rejectionReason?: string
}

export interface BalanceSummary {
  year: number
  total: number
  used: number
  pending: number
  carryOver: number
  available: number
}

export type AnalysisSeverity = 'high' | 'medium' | 'info'

export interface AnalysisMessage {
  message: string
  detail: string
  severity: AnalysisSeverity
}

export interface RequestAnalysis {
  alerts: AnalysisMessage[]
  warnings: AnalysisMessage[]
  info: AnalysisMessage[]
}

export interface Department {
  id: string
  name: string
  color: string
  icon: string
}

export interface DepartmentStats extends Department {
  employeeCount: number
  totalDays: number
  usedDays: number
  pendingDays: number
  usagePercent: number
}

export interface Employee {
  id: string
  name: string
  email: string
  deptId: string
  role: 'employee' | 'admin'
  startDate?: string
}


