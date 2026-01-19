import { AlertTriangle, AlertCircle, Info } from 'lucide-react'

const styles = {
  high: {
    container: 'bg-red-50 border-red-200 text-red-800',
    icon: AlertTriangle,
  },
  medium: {
    container: 'bg-amber-50 border-amber-200 text-amber-800',
    icon: AlertCircle,
  },
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: Info,
  },
}

export default function Alert({ message, detail, severity = 'info' }) {
  const style = styles[severity] || styles.info
  const Icon = style.icon

  return (
    <div className={`p-3 rounded-xl border ${style.container} flex items-start gap-3`}>
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-medium text-sm">{message}</p>
        {detail && <p className="text-xs opacity-75 mt-0.5">{detail}</p>}
      </div>
    </div>
  )
}
