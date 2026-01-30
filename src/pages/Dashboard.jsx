import { useState, useMemo } from 'react'
import { Calendar, Briefcase, Clock, Check, Plus, Plane, AlertTriangle, Users, FileText, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useRequests } from '@/context/RequestContext'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import RequestForm from '@/components/features/RequestForm'
import { getInitials } from '@/utils/dateUtils'
import { DEPARTMENTS } from '@/data/employees'
import { useEmployees } from '@/context/EmployeeContext'
import { ABSENCE_TYPES, POLICIES } from '@/data/absenceTypes'
import { useBalance } from '@/hooks/useBalance'
import { useTeamAvailability } from '@/hooks/useTeamAvailability'
import { calculateBalance } from '@/utils/calculations'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { requests, getPendingRequests, selectedYear } = useRequests()
  const { employees } = useEmployees()
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [preselectedType, setPreselectedType] = useState('vacation')

  const balance = useBalance(user.id)
  const teamAvailability = useTeamAvailability(user.deptId)

  // Admin-specific metrics
  const adminMetrics = useMemo(() => {
    if (!user.isAdmin) return null

    const pendingCount = getPendingRequests().length
    const totalEmployees = employees.length
    const requestsForYear = requests.filter((r) => r.year === selectedYear)
    const totalRequests = requestsForYear.length
    const approvedRequests = requestsForYear.filter(r => r.status === 'approved').length
    const rejectedRequests = requestsForYear.filter(r => r.status === 'rejected').length
    
    // Calculate average usage per department
    const deptUsage = DEPARTMENTS.map(dept => {
      const deptEmployees = employees.filter(e => e.deptId === dept.id)
      const totalDays = deptEmployees.reduce((sum, emp) => {
        const empBalance = calculateBalance(emp.id, selectedYear, requests, emp.startDate)
        return sum + empBalance.used
      }, 0)
      const avgUsage = deptEmployees.length > 0 ? totalDays / deptEmployees.length : 0
      return { ...dept, avgUsage, employeeCount: deptEmployees.length }
    }).sort((a, b) => b.avgUsage - a.avgUsage)

    return {
      pendingCount,
      totalEmployees,
      totalRequests,
      approvedRequests,
      rejectedRequests,
      deptUsage,
    }
  }, [user.isAdmin, requests, getPendingRequests, selectedYear, employees])

  const stats = [
    {
      label: 'Días Totales',
      value: balance.total,
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      sub:
        balance.carryOver > 0
          ? `${Math.max(balance.total - balance.carryOver, 0)} base ${balance.year} + ${balance.carryOver} arrastrados de ${balance.year - 1}`
          : null,
    },
    { label: 'Disponibles', value: balance.available, icon: Check, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Usados', value: balance.used, icon: Briefcase, color: 'from-amber-500 to-amber-600' },
    { label: 'Pendientes', value: balance.pending, icon: Clock, color: 'from-purple-500 to-purple-600' },
  ]

  const handleTypeSelect = (typeId) => {
    setPreselectedType(typeId)
    setShowRequestModal(true)
  }

  return (
    <div className="space-y-6 animate-slide-down">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            ¡Hola, {user.name.split(' ')[0]}! 👋
          </h2>
          <p className="text-slate-500 mt-1">
            {user.isAdmin ? 'Panel de administración' : `Resumen de ausencias ${balance.year}`}
          </p>
        </div>
        <div className="flex gap-2">
          {user.isAdmin && (
            <Button variant="secondary" onClick={() => navigate('/approvals')}>
              <FileText className="w-5 h-5" />
              Aprobaciones {adminMetrics && adminMetrics.pendingCount > 0 && (
                <Badge variant="warning" className="ml-2">{adminMetrics.pendingCount}</Badge>
              )}
            </Button>
          )}
        <Button onClick={() => setShowRequestModal(true)}>
          <Plus className="w-5 h-5" />
          Nueva Solicitud
        </Button>
      </div>
      </div>

      {/* Admin Dashboard Section */}
      {user.isAdmin && adminMetrics && (
        <div className="space-y-6">
          {/* Admin Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-md transition-shadow border-l-4 border-l-amber-500">
              <CardBody>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white mb-4">
                  <Clock className="w-6 h-6" />
                </div>
                <p className="text-slate-500 text-sm">Pendientes</p>
                <p className="text-3xl font-bold text-slate-800">{adminMetrics.pendingCount}</p>
                <p className="text-xs text-amber-600 mt-1">Requieren revisión</p>
              </CardBody>
            </Card>

            <Card className="hover:shadow-md transition-shadow border-l-4 border-l-emerald-500">
              <CardBody>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white mb-4">
                  <Check className="w-6 h-6" />
                </div>
                <p className="text-slate-500 text-sm">Aprobadas</p>
                <p className="text-3xl font-bold text-slate-800">{adminMetrics.approvedRequests}</p>
                <p className="text-xs text-emerald-600 mt-1">Este año</p>
              </CardBody>
            </Card>

            <Card className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
              <CardBody>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <p className="text-slate-500 text-sm">Empleados</p>
                <p className="text-3xl font-bold text-slate-800">{adminMetrics.totalEmployees}</p>
                <p className="text-xs text-blue-600 mt-1">Total activos</p>
              </CardBody>
            </Card>

            <Card className="hover:shadow-md transition-shadow border-l-4 border-l-purple-500">
              <CardBody>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white mb-4">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <p className="text-slate-500 text-sm">Total Solicitudes</p>
                <p className="text-3xl font-bold text-slate-800">{adminMetrics.totalRequests}</p>
                <p className="text-xs text-purple-600 mt-1">Histórico</p>
              </CardBody>
            </Card>
          </div>

          {/* Department Usage Ranking */}
          <Card>
            <CardHeader>
              <span className="flex items-center gap-2">
                📊 Uso por Equipo ({selectedYear})
              </span>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {adminMetrics.deptUsage.map((dept, index) => (
                  <div key={dept.id} className="flex items-center gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: dept.color }}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-800">{dept.name}</p>
                        <p className="text-xs text-slate-500">{dept.employeeCount} empleados</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-800">{dept.avgUsage.toFixed(1)}</p>
                      <p className="text-xs text-slate-500">días promedio</p>
                    </div>
                    <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                        style={{ width: `${Math.min((dept.avgUsage / POLICIES.vacationDaysPerYear) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/approvals')}
              className="bg-gradient-to-br from-amber-500 to-orange-500 text-white p-6 rounded-2xl flex items-center gap-4 hover:shadow-xl transition-all group"
            >
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-7 h-7" />
              </div>
              <div className="text-left">
                <p className="font-bold text-lg">Revisar Solicitudes</p>
                <p className="text-amber-100 text-sm">{adminMetrics.pendingCount} pendientes</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/team')}
              className="bg-white p-6 rounded-2xl flex items-center gap-4 border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all group"
            >
              <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                <Users className="w-7 h-7 text-slate-600 group-hover:text-emerald-600" />
              </div>
              <div className="text-left">
                <p className="font-bold text-lg text-slate-800">Ver Equipos</p>
                <p className="text-slate-500 text-sm">Gestionar empleados</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/reports')}
              className="bg-white p-6 rounded-2xl flex items-center gap-4 border border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all group"
            >
              <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-purple-50 transition-colors">
                <TrendingUp className="w-7 h-7 text-slate-600 group-hover:text-purple-600" />
              </div>
              <div className="text-left">
                <p className="font-bold text-lg text-slate-800">Reportes</p>
                <p className="text-slate-500 text-sm">Análisis y exportar</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Employee Dashboard Section */}
      {!user.isAdmin && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <Card key={i} className="hover:shadow-md transition-shadow">
                  <CardBody>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-4`}>
                      <Icon className="w-6 h-6" />
                    </div>
                <p className="text-slate-500 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                {stat.sub && (
                  <p className="text-xs text-emerald-600 mt-1 font-medium">{stat.sub}</p>
                )}
                {stat.detail && !stat.sub && (
                  <p className="text-xs text-slate-400 mt-1">{stat.detail}</p>
                )}
                  </CardBody>
                </Card>
              )
            })}
          </div>

          {/* Main content */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
          {/* Quick actions */}
          <div className="grid sm:grid-cols-2 gap-4">
            <button
              onClick={() => setShowRequestModal(true)}
              className="bg-gradient-to-br from-emerald-500 to-cyan-500 text-white p-6 rounded-2xl flex items-center gap-4 hover:shadow-xl transition-all group"
            >
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plane className="w-7 h-7" />
              </div>
              <div className="text-left">
                <p className="font-bold text-lg">Solicitar Vacaciones</p>
                <p className="text-emerald-100 text-sm">{balance.available} días disponibles</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/calendar')}
              className="bg-white p-6 rounded-2xl flex items-center gap-4 border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all group"
            >
              <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                <Calendar className="w-7 h-7 text-slate-600 group-hover:text-emerald-600" />
              </div>
              <div className="text-left">
                <p className="font-bold text-lg text-slate-800">Ver Calendario</p>
                <p className="text-slate-500 text-sm">Planifica tu tiempo</p>
              </div>
            </button>
          </div>

          {/* Team availability */}
          <Card>
            <CardHeader>
              <span className="flex items-center gap-2">
                👥 Estado del Equipo
              </span>
              <Badge variant={teamAvailability.filter(m => m.onVacation).length > 0 ? 'warning' : 'success'}>
                {teamAvailability.filter(m => !m.onVacation).length}/{teamAvailability.length} disponibles
              </Badge>
            </CardHeader>
            <CardBody className="space-y-3">
              {teamAvailability.map(member => (
                <div 
                  key={member.id}
                  className={`flex items-center gap-3 p-3 rounded-xl ${member.onVacation ? 'bg-amber-50' : 'bg-slate-50 hover:bg-slate-100'}`}
                >
                  <div className="relative">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: user.department?.color }}
                    >
                      {getInitials(member.name)}
                    </div>
                    <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${member.onVacation ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 text-sm truncate">{member.name}</p>
                    {member.onVacation ? (
                      <p className="text-xs text-amber-600">🏖️ De vacaciones</p>
                    ) : member.nextVacation ? (
                      <p className="text-xs text-slate-500">
                        Próximas: {new Date(member.nextVacation.startDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                      </p>
                    ) : (
                      <p className="text-xs text-emerald-600">✓ Disponible</p>
                    )}
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
          {/* Absence types */}
          <Card>
            <CardHeader>Tipos de Ausencia</CardHeader>
            <CardBody className="space-y-2">
              {ABSENCE_TYPES.slice(0, 5).map(type => (
                <button
                  key={type.id}
                  onClick={() => handleTypeSelect(type.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left"
                >
                  <span className="text-xl">{type.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-slate-700 text-sm">{type.name}</p>
                    <p className="text-xs text-slate-500">
                      {type.deducts ? 'Descuenta días' : 'No descuenta'}
                    </p>
                  </div>
                  <span className="text-slate-400">›</span>
                </button>
              ))}
            </CardBody>
          </Card>

          {/* Tips */}
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              ⚡ Consejo
            </h3>
            <p className="text-purple-100 text-sm">
              Solicita con al menos 7 días de antelación para asegurar la aprobación rápida de tus vacaciones.
            </p>
            </div>
            </div>
          </div>
        </>
      )}

      {/* Request Modal */}
      <Modal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        title="Nueva Solicitud"
      >
        <RequestForm 
          onClose={() => setShowRequestModal(false)}
          preselectedType={preselectedType}
        />
      </Modal>
    </div>
  )
}
