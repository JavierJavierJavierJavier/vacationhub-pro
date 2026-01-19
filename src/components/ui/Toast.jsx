import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'
import { useToast } from '@/context/ToastContext'

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
}

const styles = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  warning: 'bg-amber-500',
  info: 'bg-slate-800',
}

export default function ToastContainer() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(toast => {
        const Icon = icons[toast.type]
        return (
          <div
            key={toast.id}
            className={`${styles[toast.type]} text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-in cursor-pointer`}
            onClick={() => removeToast(toast.id)}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">{toast.message}</span>
          </div>
        )
      })}
    </div>
  )
}
