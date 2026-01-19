const variants = {
  primary: 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-emerald-500/25',
  secondary: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  success: 'bg-emerald-500 text-white hover:bg-emerald-600',
  ghost: 'text-slate-600 hover:bg-slate-100',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg',
}

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  type = 'button',
  onClick,
  ...props 
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2 font-semibold rounded-xl 
        transition-all duration-200 
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} 
        ${sizes[size]} 
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
