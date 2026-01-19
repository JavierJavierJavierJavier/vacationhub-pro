import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import LoginPage from './Login'
import { AuthProvider } from '@/context/AuthContext'
import { ToastProvider } from '@/context/ToastContext'
import { EmployeeProvider } from '@/context/EmployeeContext'

// Mock fetch
global.fetch = vi.fn()

const createWrapper = () => {
  return ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>
      <ToastProvider>
        <EmployeeProvider>
          <AuthProvider>{children}</AuthProvider>
        </EmployeeProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}

describe('Login E2E', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login form', () => {
    render(<LoginPage />, { wrapper: createWrapper() })
    expect(screen.getByText('VacationHub Pro')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('tu.nombre@alter-5.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument()
  })

  it('shows error on invalid credentials', async () => {
    fetch.mockResolvedValueOnce({
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
    fetch.mockResolvedValueOnce({
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
    fetch.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

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

