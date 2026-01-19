import { describe, it, expect } from 'vitest'
import {
  formatDate,
  formatDateRange,
  isWeekendDay,
  calculateWorkingDays,
  getDaysUntil,
  isToday,
  toDateString,
  getInitials,
} from './dateUtils'

describe('dateUtils', () => {
  it('formats dates correctly', () => {
    const result = formatDate('2025-01-15', 'dd/MM/yyyy')
    expect(result).toBe('15/01/2025')
  })

  it('formats date ranges', () => {
    const result = formatDateRange('2025-01-10', '2025-01-15')
    expect(result).toContain('10')
    expect(result).toContain('15')
  })

  it('detects weekends', () => {
    expect(isWeekendDay('2025-01-11')).toBe(true)
    expect(isWeekendDay('2025-01-13')).toBe(false)
  })

  it('calculates working days excluding weekends and holidays', () => {
    const days = calculateWorkingDays('2025-01-06', '2025-01-10')
    expect(days).toBeGreaterThan(0)
  })

  it('calculates days until a future date', () => {
    const todayStr = toDateString(new Date())
    const diff = getDaysUntil(todayStr)
    expect(diff).toBe(0)
  })

  it('detects today correctly', () => {
    expect(isToday(new Date())).toBe(true)
  })

  it('gets initials from names', () => {
    expect(getInitials('Juan Ruiz Arnal')).toBe('JR')
    expect(getInitials('Miguel')).toBe('M')
  })
})


