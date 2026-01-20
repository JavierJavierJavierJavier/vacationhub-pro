import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react'
import { getDepartmentById } from '@/data/employees'
import { useToast } from './ToastContext'

export interface AuthUser {
  id: string
  name: string
  email: string
  deptId: string
  role: string
  department: ReturnType<typeof getDepartmentById> | undefined
  isAdmin: boolean
  canApprove: boolean
  token: string
}

export interface LoginResult {
  success: boolean
  error?: string
}

interface AuthContextValue {
  user: AuthUser | null
  login: (email: string, password: string) => Promise<LoginResult>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const { toast } = useToast()
  

  const login = useCallback(
    async (email: string, password: string): Promise<LoginResult> => {
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })

        const data = await response.json()

        if (!response.ok || !data.success) {
          return { success: false, error: data.error || 'Error de autenticación' }
        }

        const employee = data.user
        const department = getDepartmentById(employee.deptId)
        const isAdmin = employee.role === 'admin'
        const userWithDept: AuthUser = {
          ...employee,
          department,
          isAdmin,
          canApprove: isAdmin,
          token: data.token,
        }

        setUser(userWithDept)
        toast.success(`¡Bienvenido, ${employee.name.split(' ')[0]}!`)

        return { success: true }
      } catch (error) {
        console.error(error)
        toast.error('No se ha podido conectar con el servidor de autenticación')
        return { success: false, error: 'Error de conexión' }
      }
    },
    [toast]
  )

  const logout = useCallback(() => {
    setUser(null)
    toast.info('Sesión cerrada')
  }, [toast])

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}


