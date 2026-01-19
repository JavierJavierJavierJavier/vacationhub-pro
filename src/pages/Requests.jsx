import { useState, useMemo } from 'react'
import { Plus, FileText, Search } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useRequests } from '@/context/RequestContext'
import { Card, CardBody } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import RequestForm from '@/components/features/RequestForm'
import { getAbsenceType, ABSENCE_TYPES } from '@/data/absenceTypes'
import { formatDate, formatDateRange } from '@/utils/dateUtils'
import FilterBar from '@/components/ui/FilterBar'
import ConfirmModal from '@/components/ui/ConfirmModal'

const statusConfig = {
  approved: { label: '✓ Aprobada', variant: 'success' },
  pending: { label: '⏳ Pendiente', variant: 'warning' },
  rejected: { label: '✗ Rechazada', variant: 'danger' },
}

export default function RequestsPage() {
  const { user } = useAuth()
  const { requests, selectedYear, setSelectedYear, cancelRequest } = useRequests()
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [yearFilter, setYearFilter] = useState(selectedYear)
  const [searchQuery, setSearchQuery] = useState('')
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [requestToCancel, setRequestToCancel] = useState(null)

  // Get all available years from requests
  const availableYears = useMemo(() => {
    const years = new Set(requests.map(r => r.year))
    return Array.from(years).sort((a, b) => b - a)
  }, [requests])

  // Filter and search requests
  const filteredRequests = useMemo(() => {
    let filtered = requests.filter(r => r.employeeId === user.id)
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter)
    }
    
    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(r => r.type === typeFilter)
    }
    
    // Filter by year
    if (yearFilter) {
      filtered = filtered.filter(r => r.year === yearFilter)
    }
    
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(r => {
        const type = getAbsenceType(r.type)
        return (
          r.reason?.toLowerCase().includes(query) ||
          type?.name.toLowerCase().includes(query) ||
          formatDateRange(r.startDate, r.endDate).toLowerCase().includes(query)
        )
      })
    }
    
    return filtered.sort(
      (a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
    )
  }, [requests, user.id, statusFilter, typeFilter, yearFilter, searchQuery])

  const handleCancel = (id) => {
    setRequestToCancel(id)
  }

  return (
    <div className="space-y-6 animate-slide-down">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Mis Solicitudes</h2>
        <Button onClick={() => setShowRequestModal(true)}>
          <Plus className="w-5 h-5" />
          Nueva
        </Button>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar por motivo, tipo o fechas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        />
      </div>

      <FilterBar
        filters={[
          {
            id: 'status',
            type: 'segmented',
            label: 'Estado',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { value: 'all', label: 'Todas' },
              { value: 'pending', label: 'Pendientes' },
              { value: 'approved', label: 'Aprobadas' },
              { value: 'rejected', label: 'Rechazadas' },
            ],
          },
          {
            id: 'type',
            type: 'select',
            label: 'Tipo',
            value: typeFilter,
            onChange: setTypeFilter,
            options: [
              { value: 'all', label: 'Todos los tipos' },
              ...ABSENCE_TYPES.map(t => ({ value: t.id, label: t.name })),
            ],
          },
          {
            id: 'year',
            type: 'select',
            label: 'Año',
            value: yearFilter.toString(),
            onChange: (val) => {
              setYearFilter(parseInt(val))
              setSelectedYear(parseInt(val))
            },
            options: availableYears.map(y => ({ value: y.toString(), label: y.toString() })),
          },
        ]}
      />

      {/* Stats summary */}
      {filteredRequests.length > 0 && (
        <div className="flex gap-4 text-sm">
          <div className="bg-slate-50 px-4 py-2 rounded-lg">
            <span className="text-slate-500">Total: </span>
            <span className="font-bold text-slate-800">{filteredRequests.length}</span>
          </div>
          <div className="bg-emerald-50 px-4 py-2 rounded-lg">
            <span className="text-emerald-600">Aprobadas: </span>
            <span className="font-bold text-emerald-700">
              {filteredRequests.filter(r => r.status === 'approved').length}
            </span>
          </div>
          <div className="bg-amber-50 px-4 py-2 rounded-lg">
            <span className="text-amber-600">Pendientes: </span>
            <span className="font-bold text-amber-700">
              {filteredRequests.filter(r => r.status === 'pending').length}
            </span>
          </div>
        </div>
      )}

      {/* Requests list */}
      {filteredRequests.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <FileText className="w-20 h-20 text-slate-200 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-2">Sin solicitudes</h3>
            <p className="text-slate-500 mb-4">No tienes solicitudes que mostrar</p>
            <Button onClick={() => setShowRequestModal(true)}>
              <Plus className="w-5 h-5" />
              Crear solicitud
            </Button>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map(request => {
            const absenceType = getAbsenceType(request.type)
            const status = statusConfig[request.status]

            return (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardBody>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{absenceType?.icon || '📅'}</span>
                      <div>
                        <p className="font-bold text-slate-800">
                          {formatDateRange(request.startDate, request.endDate)}
                        </p>
                        <p className="text-sm text-slate-500">
                          {absenceType?.name} • Solicitado: {formatDate(request.requestDate)}
                        </p>
                      </div>
                    </div>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-slate-500 text-xs">Días</p>
                      <p className="font-bold text-slate-800">{request.days} laborables</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-slate-500 text-xs">Motivo</p>
                      <p className="font-medium text-slate-800 truncate">{request.reason}</p>
                    </div>
                    {request.reviewer && (
                      <div className="bg-slate-50 rounded-xl p-3">
                        <p className="text-slate-500 text-xs">Revisado por</p>
                        <p className="font-medium text-slate-800">{request.reviewer}</p>
                      </div>
                    )}
                  </div>

                  {request.rejectionReason && (
                    <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-100">
                      <p className="text-sm text-red-700">
                        <strong>Motivo del rechazo:</strong> {request.rejectionReason}
                      </p>
                    </div>
                  )}

                  {request.status === 'pending' && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <button
                        onClick={() => handleCancel(request.id)}
                        className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        Cancelar solicitud
                      </button>
                    </div>
                  )}
                </CardBody>
              </Card>
            )
          })}
        </div>
      )}

      <Modal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        title="Nueva Solicitud"
      >
        <RequestForm onClose={() => setShowRequestModal(false)} />
      </Modal>

      <ConfirmModal
        isOpen={!!requestToCancel}
        title="Cancelar solicitud"
        description="¿Seguro que quieres cancelar esta solicitud? Esta acción no se puede deshacer."
        confirmLabel="Sí, cancelar"
        cancelLabel="No cancelar"
        confirmVariant="danger"
        onCancel={() => setRequestToCancel(null)}
        onConfirm={() => {
          if (requestToCancel) {
            cancelRequest(requestToCancel)
          }
          setRequestToCancel(null)
        }}
      />
    </div>
  )
}
