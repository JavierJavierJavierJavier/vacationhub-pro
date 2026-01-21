import { Menu, Bell, LogOut } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useRequests } from '@/context/RequestContext'
import { getInitials } from '@/utils/dateUtils'

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth()
  const { selectedYear, setSelectedYear } = useRequests()

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-40 flex items-center justify-between px-4 lg:px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-slate-100 rounded-xl"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
            <img src="/brand/alter5-mark.png" alt="Alter5" className="w-7 h-7 object-contain" />
          </div>
          <div className="hidden sm:block">
            <img src="/brand/alter5-wordmark.png" alt="Alter5" className="h-5 object-contain" />
            <p className="text-xs text-slate-500">VacationHub</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Year toggle */}
        <div className="flex bg-slate-100 rounded-xl p-1">
          {[2025, 2026].map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                selectedYear === year
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-slate-100 rounded-xl">
          <Bell className="w-5 h-5 text-slate-600" />
        </button>

        {/* User info */}
        {user && (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="font-medium text-slate-800 text-sm">{user.name}</p>
              <p className="text-xs text-slate-500">
                {user.isAdmin ? '👑 Co-Founder' : '👤 Empleado'}
              </p>
            </div>
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg"
              style={{ backgroundColor: user.department?.color }}
            >
              {getInitials(user.name)}
            </div>
            <button 
              onClick={logout}
              className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
