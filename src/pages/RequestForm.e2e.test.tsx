import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RequestForm from '@/components/features/RequestForm'
import { AuthProvider } from '@/context/AuthContext'
import { RequestProvider } from '@/context/RequestContext'
import { ToastProvider } from '@/context/ToastContext'
import { EmployeeProvider } from '@/context/EmployeeContext'

// Mock AuthContext
vi.mock('@/context/AuthContext', async () => {
  const actual = await vi.importActual('@/context/AuthContext')
  return {
    ...actual,
    useAuth: () => ({
      user: {
        id: 'e7',
        name: 'Javier Ruiz',
        email: 'javier.ruiz@alter-5.com',
        deptId: 'sales',
        role: 'employee',
        isAdmin: false,
        canApprove: false,
        department: { id: 'sales', name: 'Sales', color: '#F59E0B', icon: '📈' },
        token: 'mock-token',
      },
    }),
  }
})

const createWrapper = () => {
  return ({ children }: { children: React.ReactNode }) => (
    <ToastProvider>
      <EmployeeProvider>
        <AuthProvider>
          <RequestProvider>{children}</RequestProvider>
        </AuthProvider>
      </EmployeeProvider>
    </ToastProvider>
  )
}

describe('RequestForm E2E', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders form fields', () => {
    const onClose = vi.fn()
    const { container } = render(<RequestForm onClose={onClose} />, { wrapper: createWrapper() })
    
    // Check for form element
    const form = container.querySelector('form')
    expect(form).toBeInTheDocument()
    
    // Check for type selection buttons (Vacaciones should be visible)
    const vacationButton = screen.getByText(/vacaciones/i)
    expect(vacationButton).toBeInTheDocument()
    
    // Check for date inputs
    const dateInputs = container.querySelectorAll('input[type="date"]')
    expect(dateInputs.length).toBeGreaterThan(0)
  })

  it('validates required fields', async () => {
    const onClose = vi.fn()
    const { container } = render(<RequestForm onClose={onClose} />, { wrapper: createWrapper() })
    
    // Find submit button by text "Enviar"
    const submitButton = screen.getByRole('button', { name: /enviar/i })
    expect(submitButton).toBeInTheDocument()
    
    // Try to submit without filling required fields
    await userEvent.click(submitButton)

    // HTML5 validation should prevent submission - check that form still exists
    const form = container.querySelector('form') as HTMLFormElement
    expect(form).toBeInTheDocument()
    
    // Check that date inputs are required
    const startDateInput = container.querySelector('input[type="date"]') as HTMLInputElement
    expect(startDateInput).toBeInTheDocument()
    expect(startDateInput.hasAttribute('required')).toBe(true)
  })

  it('renders form with submit button', () => {
    const onClose = vi.fn()
    render(<RequestForm onClose={onClose} />, { wrapper: createWrapper() })
    
    // Find submit button
    const submitButton = screen.getByRole('button', { name: /enviar/i })
    expect(submitButton).toBeInTheDocument()
    expect(submitButton).toHaveAttribute('type', 'submit')
  })
})

