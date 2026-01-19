const variants = {
  default: 'bg-slate-100 text-slate-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  purple: 'bg-purple-100 text-purple-700',
  blue: 'bg-blue-100 text-blue-700',
}

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
