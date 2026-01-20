import { describe, it, expect } from 'vitest'
import * as calc from './calculations'
import type { VacationRequest } from '@/domain/types'
import { DEPARTMENTS } from '@/data/employees'

const TEST_EMPLOYEES = [
  { id: 'e1', deptId: 'tech', startDate: '2025-01-01' },
  { id: 'e2', deptId: 'tech', startDate: '2025-01-01' },
]

const baseRequests: VacationRequest[] = [
  {
    id: 'r1',
    employeeId: 'e1',
    year: 2025,
    status: 'approved',
    days: 5,
    startDate: '2025-01-10',
    endDate: '2025-01-14',
  },
  {
    id: 'r2',
    employeeId: 'e1',
    year: 2025,
    status: 'pending',
    days: 3,
    startDate: '2025-03-10',
    endDate: '2025-03-12',
  },
]

describe('calculations', () => {
  it('calculates balance correctly', () => {
    const balance = calc.calculateBalance('e1', 2025, baseRequests, '2025-01-01')
    expect(balance.used).toBe(5)
    expect(balance.pending).toBe(3)
    expect(balance.total).toBeGreaterThan(0)
    expect(balance.available).toBe(balance.total - 5 - 3)
  })

  it('analyzes requests and returns structure', () => {
    const request = baseRequests[0]
    const analysis = calc.analyzeRequest(request, baseRequests, TEST_EMPLOYEES)
    expect(analysis).toHaveProperty('alerts')
    expect(analysis).toHaveProperty('warnings')
    expect(analysis).toHaveProperty('info')
  })

  it('gets department stats', () => {
    const techDept = DEPARTMENTS.find((d) => d.id === 'tech')!
    const stats = calc.getDepartmentStats(techDept, 2025, baseRequests, TEST_EMPLOYEES)
    expect(stats.employeeCount).toBeGreaterThan(0)
    expect(stats.totalDays).toBeGreaterThan(0)
    expect(stats.usagePercent).toBeGreaterThanOrEqual(0)
  })
})


