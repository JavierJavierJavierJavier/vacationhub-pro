export function Card({ children, className = '', ...props }) {
  return (
    <div 
      className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '', action }) {
  return (
    <div className={`px-6 py-4 border-b border-slate-100 flex items-center justify-between ${className}`}>
      <div className="font-semibold text-slate-800">{children}</div>
      {action && <div>{action}</div>}
    </div>
  )
}

export function CardBody({ children, className = '' }) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 border-t border-slate-100 ${className}`}>
      {children}
    </div>
  )
}
