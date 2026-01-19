import { useState } from 'react'
import { Plus, Trash2, Crown, MoreVertical } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useRequests } from '@/context/RequestContext'
import { useEmployees } from '@/context/EmployeeContext'
import { Card, CardBody } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import ConfirmModal from '@/components/ui/ConfirmModal'
import EmployeeForm from '@/components/features/EmployeeForm'
import { getDepartmentById } from '@/data/employees'
import { calculateBalance } from '@/utils/calculations'
import { getInitials, formatDate } from '@/utils/dateUtils'

export default function TeamPage() {
  const { user } = useAuth()
  const { requests, selectedYear } = useRequests()
  const { employees, deleteEmployee, promoteToAdmin } = useEmployees()
  const [showAddModal, setShowAddModal] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState(null)
  const [employeeToPromote, setEmployeeToPromote] = useState(null)
  const [employeeMenuOpen, setEmployeeMenuOpen] = useState(null)

  const sortedEmployees = [...employees].sort((a, b) => {
    if (a.deptId === b.deptId) {
      return a.name.localeCompare(b.name)
    }
    return a.deptId.localeCompare(b.deptId)
  })

  const handleDelete = (id) => {
    setEmployeeToDelete(id)
  }

  const handlePromote = (id) => {
    setEmployeeToPromote(id)
  }

  const confirmDelete = () => {
    if (employeeToDelete) {
      deleteEmployee(employeeToDelete)
      setEmployeeToDelete(null)
      setEmployeeMenuOpen(null)
    }
  }

  const confirmPromote = () => {
    if (employeeToPromote) {
      promoteToAdmin(employeeToPromote)
      setEmployeeToPromote(null)
      setEmployeeMenuOpen(null)
    }
  }

  return (
    <div className="space-y-6 animate-slide-down">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestión de Equipo</h2>
          <p className="text-slate-500 mt-1">
            {employees.length} empleado{employees.length !== 1 ? 's' : ''} en la empresa
          </p>
        </div>
        {user.isAdmin && (
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-5 h-5" />
            Agregar Empleado
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedEmployees.map(employee => {
          const department = getDepartmentById(employee.deptId)
          const balance = calculateBalance(employee.id, selectedYear, requests, employee.startDate)
          const usagePercent = balance.total > 0 ? Math.round((balance.used / balance.total) * 100) : 0
          
          // Check if on vacation today
          const today = new Date()
          const onVacation = requests.some(r => {
            if (r.employeeId !== employee.id || r.status !== 'approved') return false
            const start = new Date(r.startDate)
            const end = new Date(r.endDate)
            return today >= start && today <= end
          })

          const isCurrentUser = employee.id === user.id
          const canManage = user.isAdmin && !isCurrentUser

          return (
            <Card 
              key={employee.id} 
              className={`transition-all hover:shadow-lg relative ${onVacation ? 'border-amber-200 bg-amber-50/30' : ''}`}
            >
              {/* Admin menu button */}
              {canManage && (
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => setEmployeeMenuOpen(employeeMenuOpen === employee.id ? null : employee.id)}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <MoreVertical className="w-4 h-4 text-slate-500" />
                  </button>
                  
                  {employeeMenuOpen === employee.id && (
                    <div className="absolute right-0 top-10 bg-white border border-slate-200 rounded-xl shadow-lg z-10 min-w-[180px]">
                      {employee.role !== 'admin' && (
                        <button
                          onClick={() => handlePromote(employee.id)}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2 rounded-t-xl"
                        >
                          <Crown className="w-4 h-4 text-amber-500" />
                          Nombrar Admin
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(employee.id)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 rounded-b-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              )}

              <CardBody>
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: department?.color }}
                    >
                      {getInitials(employee.name)}
                    </div>
                    {onVacation && (
                      <span className="absolute -top-1 -right-1 text-lg">🏖️</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 truncate">{employee.name}</p>
                    <p className="text-sm text-slate-500">{department?.name}</p>
                    <div className="flex gap-2 mt-1">
                      {employee.role === 'admin' && (
                        <Badge variant="purple">Co-Founder</Badge>
                      )}
                      {employee.startDate && (
                        <span className="text-xs text-slate-400">
                          Desde {formatDate(employee.startDate, 'MMM yyyy')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Usage progress */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-500">Uso {selectedYear}</span>
                      <span className="font-medium">{balance.used}/{balance.total}</span>
                    </div>
                    {balance.total > 0 && (
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${usagePercent > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${usagePercent}%` }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-emerald-50 rounded-lg p-2 text-center">
                      <p className="text-emerald-600 font-bold text-lg">{balance.available}</p>
                      <p className="text-emerald-700 text-xs">Disponibles</p>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-2 text-center">
                      <p className="text-amber-600 font-bold text-lg">{balance.pending}</p>
                      <p className="text-amber-700 text-xs">Pendientes</p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          )
        })}
      </div>

      {/* Add Employee Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Agregar Nuevo Empleado"
        size="md"
      >
        <EmployeeForm onClose={() => setShowAddModal(false)} />
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!employeeToDelete}
        title="Eliminar empleado"
        description={
          employeeToDelete
            ? `¿Estás seguro de que quieres eliminar a ${employees.find(e => e.id === employeeToDelete)?.name}? Esta acción no se puede deshacer y se eliminarán todos sus datos asociados.`
            : ''
        }
        confirmLabel="Sí, eliminar"
        cancelLabel="Cancelar"
        confirmVariant="danger"
        onCancel={() => setEmployeeToDelete(null)}
        onConfirm={confirmDelete}
      />

      {/* Promote Confirmation Modal */}
      <ConfirmModal
        isOpen={!!employeeToPromote}
        title="Nombrar administrador"
        description={
          employeeToPromote
            ? `¿Promover a ${employees.find(e => e.id === employeeToPromote)?.name} a administrador? Los administradores pueden aprobar solicitudes y gestionar empleados.`
            : ''
        }
        confirmLabel="Sí, promover"
        cancelLabel="Cancelar"
        confirmVariant="primary"
        onCancel={() => setEmployeeToPromote(null)}
        onConfirm={confirmPromote}
      />
    </div>
  )
}
