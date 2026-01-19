import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthContext'
import { ToastProvider } from './ToastContext'
import { EmployeeProvider } from './EmployeeContext'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ToastProvider>
    <EmployeeProvider>
      <AuthProvider>{children}</AuthProvider>
    </EmployeeProvider>
  </ToastProvider>
)

describe('AuthContext', () => {
  it('starts unauthenticated', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
  })

  it('returns error on failed login', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ success: false, error: 'Error' }),
    } as any)

    const { result } = renderHook(() => useAuth(), { wrapper })

    let response
    await act(async () => {
      response = await result.current.login('bad@alter-5.com', 'wrong')
    })

    expect(response.success).toBe(false)
  })
})


