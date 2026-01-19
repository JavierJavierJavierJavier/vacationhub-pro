import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastItem {
  id: string
  type: ToastType
  message: string
}

interface ToastContextValue {
  toasts: ToastItem[]
  toast: {
    success: (message: string) => void
    error: (message: string) => void
    info: (message: string) => void
    warning: (message: string) => void
  }
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const addToast = useCallback(
    (type: ToastType, message: string, duration = 4000) => {
      const id = Date.now().toString()
      setToasts((prev) => [...prev, { id, type, message }])

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, duration)
    },
    []
  )

  const toast = {
    success: (message: string) => addToast('success', message),
    error: (message: string) => addToast('error', message),
    info: (message: string) => addToast('info', message),
    warning: (message: string) => addToast('warning', message),
  }

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, toast, removeToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}


