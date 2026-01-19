import { NavLink } from 'react-router-dom'
import { 
  Home, 
  Calendar, 
  FileText, 
  CheckSquare, 
  Users, 
  BarChart3,
  Settings,
  Sun
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useRequests } from '@/context/RequestContext'
import { useEmployees } from '@/context/EmployeeContext'
import { calculateBalance } from '@/utils/calculations'

const navItems = [
  { path: '/', icon: Home, label: 'Dashboard' },
  { path: '/calendar', icon: Calendar, label: 'Calendario' },
  { path: '/requests', icon: FileText, label: 'Mis Solicitudes' },
  { path: '/approvals', icon: CheckSquare, label: 'Aprobaciones', adminOnly: true, showBadge: true },
  { path: '/team', icon: Users, label: 'Equipo', adminOnly: true },
  { path: '/reports', icon: BarChart3, label: 'Reportes' },
  { path: '/settings', icon: Settings, label: 'Configuración' },
]

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth()
  const { requests, selectedYear, getPendingRequests } = useRequests()
  const { getEmployeeById } = useEmployees()
  
  const pendingCount = getPendingRequests().length
  const employee = user ? getEmployeeById(user.id) : null
  const balance = user ? calculateBalance(user.id, selectedYear, requests, employee?.startDate) : null

  const filteredItems = navItems.filter(item => !item.adminOnly || user?.isAdmin)

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-slate-200 z-30
        transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <nav className="p-4 space-y-1">
          {filteredItems.map(item => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${isActive 
                    ? 'bg-primary-50 text-primary-600 font-medium' 
                    : 'text-slate-600 hover:bg-slate-50'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
                {item.showBadge && pendingCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    {pendingCount}
                  </span>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Balance footer */}
        {balance && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 bg-slate-50/50">
            <p className="text-xs text-slate-500 mb-2">Balance {selectedYear}</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-primary-600">{balance.available}</span>
              </div>
              <div className="text-xs">
                <p><span className="font-bold text-primary-600">{balance.available}</span> disponibles</p>
                <p className="text-slate-500">{balance.used} de {balance.total} usados</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
