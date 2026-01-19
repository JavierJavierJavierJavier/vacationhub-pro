import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { RequestProvider, useRequests } from './RequestContext'
import { ToastProvider } from './ToastContext'
import { AuthProvider } from './AuthContext'
import { EmployeeProvider } from './EmployeeContext'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ToastProvider>
    <EmployeeProvider>
      <AuthProvider>
        <RequestProvider>{children}</RequestProvider>
      </AuthProvider>
    </EmployeeProvider>
  </ToastProvider>
)

describe('RequestContext', () => {
  it('can add and cancel a request', () => {
    const { result } = renderHook(() => useRequests(), { wrapper })

    let createdId: string | undefined
    act(() => {
      const created = result.current.addRequest({
        employeeId: 'e1',
        startDate: '2025-01-10',
        endDate: '2025-01-12',
        days: 3,
        year: 2025,
        reason: 'Test',
        type: 'vacation',
        backup: null,
      } as any)
      createdId = created.id
    })

    expect(result.current.requests.length).toBeGreaterThan(0)

    act(() => {
      if (createdId) {
        result.current.cancelRequest(createdId)
      }
    })

    const stillExists = result.current.requests.some((r) => r.id === createdId)
    expect(stillExists).toBe(false)
  })
})


