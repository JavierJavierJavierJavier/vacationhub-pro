import { useState } from 'react'
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useRequests } from '@/context/RequestContext'
import { Card, CardBody } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Alert from '@/components/ui/Alert'
import { getDepartmentById, DEPARTMENTS } from '@/data/employees'
import { getAbsenceType } from '@/data/absenceTypes'
import { formatDateRange, getInitials } from '@/utils/dateUtils'
import { calculateBalance, analyzeRequest } from '@/utils/calculations'
import { useEmployees } from '@/context/EmployeeContext'
import Modal from '@/components/ui/Modal'
import FilterBar from '@/components/ui/FilterBar'

export default function ApprovalsPage() {
  const { user } = useAuth()
  const { requests, getPendingRequests, approveRequest, rejectRequest } = useRequests()
  const { employees, getEmployeeById } = useEmployees()
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [employeeFilter, setEmployeeFilter] = useState('all')
  const [requestToReject, setRequestToReject] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [busyIds, setBusyIds] = useState([])

  const isOverlap = (startA, endA, startB, endB) => {
    return startA <= endB && startB <= endA
  }

  const getOverlapInfo = (request) => {
    const requester = getEmployeeById(request.employeeId)
    if (!requester) {
      return { overlappingEmployees: [], availableCount: 0, guard: null }
    }
    const deptEmployees = employees.filter((e) => e.deptId === requester.deptId)
    const approvedRequests = requests.filter((r) => r.status === 'approved')

    const overlappingIds = new Set(
      approvedRequests
        .filter((r) =>
          r.employeeId !== request.employeeId &&
          deptEmployees.some((e) => e.id === r.employeeId) &&
          isOverlap(r.startDate, r.endDate, request.startDate, request.endDate)
        )
        .map((r) => r.employeeId)
    )

    const overlappingEmployees = deptEmployees.filter((e) => overlappingIds.has(e.id))
    const availableCount = Math.max(0, deptEmployees.length - 1 - overlappingEmployees.length)
    const guard = request.backup ? deptEmployees.find((e) => e.id === request.backup) : null
    const guardOnVacation = guard ? overlappingIds.has(guard.id) : false

    return { overlappingEmployees, availableCount, guard, guardOnVacation }
  }

  const pendingRequests = getPendingRequests().filter((r) => {
    const employee = getEmployeeById(r.employeeId)
    if (!employee) return false
    if (departmentFilter !== 'all' && employee.deptId !== departmentFilter) {
      return false
    }
    if (employeeFilter !== 'all' && employee.id !== employeeFilter) {
      return false
    }
    return true
  })

  const departmentOptions = [
    { value: 'all', label: 'Todos los equipos' },
    ...DEPARTMENTS.map(d => ({ value: d.id, label: d.name })),
  ]

  const employeeOptions = [
    { value: 'all', label: 'Todas las personas' },
    ...employees.filter((e) =>
      departmentFilter === 'all' ? true : e.deptId === departmentFilter
    ).map((e) => ({ value: e.id, label: e.name })),
  ]

  const handleApprove = async (id) => {
    if (busyIds.includes(id)) return
    setBusyIds((prev) => [...prev, id])
    try {
      await approveRequest(id)
    } finally {
      setBusyIds((prev) => prev.filter((reqId) => reqId !== id))
    }
  }

  const openRejectModal = (id) => {
    setRequestToReject(id)
    setRejectReason('')
  }

  const confirmReject = async () => {
    if (requestToReject && rejectReason.trim()) {
      if (busyIds.includes(requestToReject)) return
      setBusyIds((prev) => [...prev, requestToReject])
      try {
        await rejectRequest(requestToReject, rejectReason.trim())
        setRequestToReject(null)
        setRejectReason('')
      } finally {
        setBusyIds((prev) => prev.filter((reqId) => reqId !== requestToReject))
      }
    }
  }

  if (!user.canApprove) {
    return (
      <div className="space-y-6 animate-slide-down">
        <h2 className="text-2xl font-bold text-slate-800">Aprobaciones</h2>
        <Card>
          <CardBody className="text-center py-12">
            <AlertTriangle className="w-20 h-20 text-amber-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">Acceso Restringido</h3>
            <p className="text-slate-500">Solo los co-founders pueden aprobar solicitudes</p>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-slide-down">
      <h2 className="text-2xl font-bold text-slate-800">Aprobaciones</h2>

      <FilterBar
        filters={[
          {
            id: 'department',
            type: 'select',
            label: 'Equipo',
            value: departmentFilter,
            onChange: (value) => {
              setDepartmentFilter(value)
              setEmployeeFilter('all')
            },
            options: departmentOptions,
          },
          {
            id: 'employee',
            type: 'select',
            label: 'Persona',
            value: employeeFilter,
            onChange: setEmployeeFilter,
            options: employeeOptions,
          },
        ]}
      />

      {pendingRequests.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <CheckCircle className="w-20 h-20 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">¡Todo al día!</h3>
            <p className="text-slate-500">No hay solicitudes pendientes de aprobación</p>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingRequests.map(request => {
            const employee = getEmployeeById(request.employeeId)
            const department = getDepartmentById(employee?.deptId)
            const balance = calculateBalance(request.employeeId, request.year, requests, employee?.startDate)
            const absenceType = getAbsenceType(request.type)
            const analysis = analyzeRequest(request, requests, employees)
            const hasAlerts = analysis.alerts.length > 0 || analysis.warnings.length > 0
            const overlapInfo = getOverlapInfo(request)
            const overlapNames = overlapInfo.overlappingEmployees.map((e) => e.name).join(', ')

            return (
              <Card key={request.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Alert banner */}
                {hasAlerts && (
                  <div className={`px-6 py-3 ${analysis.alerts.length > 0 ? 'bg-red-50 border-b border-red-100' : 'bg-amber-50 border-b border-amber-100'}`}>
                    <div className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="w-5 h-5" />
                      <span className={`font-medium ${analysis.alerts.length > 0 ? 'text-red-700' : 'text-amber-700'}`}>
                        {analysis.alerts.length > 0 
                          ? `${analysis.alerts.length} alerta(s) crítica(s)` 
                          : `${analysis.warnings.length} advertencia(s)`
                        }
                      </span>
                    </div>
                  </div>
                )}

                <CardBody>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                        style={{ backgroundColor: department?.color }}
                      >
                        {getInitials(employee?.name || '')}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-lg">{employee?.name}</p>
                        <p className="text-sm text-slate-500">
                          {department?.name} • {absenceType?.icon} {absenceType?.name}
                        </p>
                      </div>
                    </div>
                    <Badge variant="warning">⏳ Pendiente</Badge>
                  </div>

                  <div className="grid md:grid-cols-3 gap-3 mb-4 text-xs text-slate-600">
                    <div className="bg-slate-50 rounded-lg p-2">
                      <p className="font-semibold text-slate-700">Solape</p>
                      <p>{overlapInfo.overlappingEmployees.length} persona(s)</p>
                      {overlapNames && (
                        <p className="text-slate-500 mt-1">{overlapNames}</p>
                      )}
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2">
                      <p className="font-semibold text-slate-700">Cobertura</p>
                      {overlapInfo.availableCount === 0 ? (
                        <p className="text-red-600 font-semibold">⚠️ Todos de vacaciones</p>
                      ) : (
                        <p>{overlapInfo.availableCount} disponible(s)</p>
                      )}
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2">
                      <p className="font-semibold text-slate-700">Guardia</p>
                      {overlapInfo.guard ? (
                        <p>
                          {overlapInfo.guard.name}
                          {overlapInfo.guardOnVacation ? ' (en vacaciones)' : ''}
                        </p>
                      ) : (
                        <p className="text-amber-600">Sin asignar</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-slate-500 text-xs">Período</p>
                      <p className="font-bold text-slate-800">{formatDateRange(request.startDate, request.endDate)}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-slate-500 text-xs">Días</p>
                      <p className="font-bold text-slate-800">{request.days} laborables</p>
                    </div>
                    <div className={`rounded-xl p-3 ${balance.available >= request.days ? 'bg-emerald-50' : 'bg-red-50'}`}>
                      <p className="text-slate-500 text-xs">Disponibles</p>
                      <p className={`font-bold ${balance.available >= request.days ? 'text-emerald-600' : 'text-red-600'}`}>
                        {balance.available} / {balance.total}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-slate-500 text-xs">Motivo</p>
                      <p className="font-medium text-slate-800 truncate">{request.reason}</p>
                    </div>
                  </div>

                  {/* Analysis alerts */}
                  {[...analysis.alerts, ...analysis.warnings, ...analysis.info].length > 0 && (
                    <div className="space-y-2 mb-4">
                      {[...analysis.alerts, ...analysis.warnings, ...analysis.info].map((a, i) => (
                        <Alert key={i} message={a.message} detail={a.detail} severity={a.severity} />
                      ))}
                    </div>
                  )}

                  <div className="flex gap-3 pt-4 border-t border-slate-100">
                    <button
                      disabled={busyIds.includes(request.id)}
                      onClick={() => handleApprove(request.id)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <CheckCircle className="w-5 h-5" />
                      {busyIds.includes(request.id) ? 'Aprobando...' : 'Aprobar'}
                    </button>
                    <button
                      disabled={busyIds.includes(request.id)}
                      onClick={() => openRejectModal(request.id)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <XCircle className="w-5 h-5" />
                      Rechazar
                    </button>
                  </div>
                </CardBody>
              </Card>
            )
          })}
        </div>
      )}
      <Modal
        isOpen={!!requestToReject}
        onClose={() => {
          setRequestToReject(null)
          setRejectReason('')
        }}
        title="Rechazar solicitud"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-700">
            Indica el motivo del rechazo. Este texto será visible para la persona que ha solicitado las vacaciones.
          </p>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50"
            placeholder="Motivo del rechazo..."
          />
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={() => {
                setRequestToReject(null)
                setRejectReason('')
              }}
              className="px-4 py-2 text-sm rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={!rejectReason.trim() || busyIds.includes(requestToReject)}
              onClick={confirmReject}
              className="px-4 py-2 text-sm rounded-xl bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed"
            >
              {busyIds.includes(requestToReject) ? 'Rechazando...' : 'Rechazar solicitud'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
