import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import LoginPage from './Login'
import { AuthProvider } from '@/context/AuthContext'
import { ToastProvider } from '@/context/ToastContext'
import { EmployeeProvider } from '@/context/EmployeeContext'

const setFetchMock = (loginResponse) => {
  global.fetch = vi.fn((input) => {
    const url = typeof input === 'string' ? input : input?.url || ''
    if (url.includes('/api/login')) {
      return Promise.resolve(loginResponse)
    }
    if (url.includes('/api/employees')) {
      return Promise.resolve({
        ok: true,
        json: async () => ({ success: true, employees: [] }),
      })
    }
    return Promise.resolve({
      ok: true,
      json: async () => ({ success: true }),
    })
  })
}

const createWrapper = () => {
  return ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <EmployeeProvider>{children}</EmployeeProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}

describe('Login E2E', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setFetchMock({
      ok: true,
      json: async () => ({ success: true }),
    })
  })

  it('renders login form', () => {
    render(<LoginPage />, { wrapper: createWrapper() })
    expect(screen.getByText('Gestión de Vacaciones')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('tu.nombre@alter-5.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument()
  })

  it('shows error on invalid credentials', async () => {
    setFetchMock({
      ok: false,
      json: async () => ({ success: false, error: 'Contraseña incorrecta' }),
    })

    render(<LoginPage />, { wrapper: createWrapper() })
    
    const emailInput = screen.getByPlaceholderText('tu.nombre@alter-5.com')
    const passwordInput = screen.getByPlaceholderText('••••••••')
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'wrongpassword')
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Contraseña incorrecta')).toBeInTheDocument()
    })
  })

  it('successfully logs in with valid credentials', async () => {
    setFetchMock({
      ok: true,
      json: async () => ({
        success: true,
        token: 'mock-token',
        user: {
          sub: 'e7',
          email: 'javier.ruiz@alter-5.com',
          name: 'Javier Ruiz',
          deptId: 'sales',
          role: 'employee',
        },
      }),
    })

    render(<LoginPage />, { wrapper: createWrapper() })
    
    const emailInput = screen.getByPlaceholderText('tu.nombre@alter-5.com')
    const passwordInput = screen.getByPlaceholderText('••••••••')
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })

    await userEvent.type(emailInput, 'javier.ruiz@alter-5.com')
    await userEvent.type(passwordInput, 'OcPHn41$PTRr')
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'javier.ruiz@alter-5.com',
          password: 'OcPHn41$PTRr',
        }),
      })
    })
  })

  it('shows loading state during login', async () => {
    global.fetch = vi.fn((input) => {
      const url = typeof input === 'string' ? input : input?.url || ''
      if (url.includes('/api/login')) {
        return new Promise((resolve) => setTimeout(resolve, 100))
      }
      if (url.includes('/api/employees')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, employees: [] }),
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ success: true }),
      })
    })

    render(<LoginPage />, { wrapper: createWrapper() })
    
    const emailInput = screen.getByPlaceholderText('tu.nombre@alter-5.com')
    const passwordInput = screen.getByPlaceholderText('••••••••')
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'password')
    await userEvent.click(submitButton)

    expect(screen.getByText('Accediendo...')).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    render(<LoginPage />, { wrapper: createWrapper() })
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    await userEvent.click(submitButton)

    // HTML5 validation should prevent submission
    const emailInput = screen.getByPlaceholderText('tu.nombre@alter-5.com') as HTMLInputElement
    expect(emailInput.validity.valid).toBe(false)
  })
})

