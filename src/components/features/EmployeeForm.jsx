import { useState, useMemo } from 'react'
import { useEmployees } from '@/context/EmployeeContext'
import { useToast } from '@/context/ToastContext'
import { DEPARTMENTS } from '@/data/employees'
import { calculateProratedDays } from '@/utils/calculations'
import Button from '@/components/ui/Button'

export default function EmployeeForm({ onClose }) {
  const { addEmployee } = useEmployees()
  const { toast } = useToast()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [deptId, setDeptId] = useState('')
  const [startDate, setStartDate] = useState('')
  const [role, setRole] = useState('employee')

  const currentYear = new Date().getFullYear()
  const proratedDays = useMemo(() => {
    if (!startDate) return null
    return calculateProratedDays(startDate, currentYear)
  }, [startDate, currentYear])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error('El nombre es requerido')
      return
    }

    if (!email.trim()) {
      toast.error('El email es requerido')
      return
    }

    if (!email.includes('@')) {
      toast.error('Email inválido')
      return
    }

    if (!deptId) {
      toast.error('Debes seleccionar un equipo')
      return
    }

    if (!startDate) {
      toast.error('La fecha de incorporación es requerida')
      return
    }

    addEmployee({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      deptId,
      startDate,
      role: role === 'admin' ? 'admin' : 'employee',
    })

    onClose()
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Nombre completo *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          placeholder="Juan Pérez"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Email *
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          placeholder="juan.perez@alter-5.com"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Equipo *
        </label>
        <select
          value={deptId}
          onChange={(e) => setDeptId(e.target.value)}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 bg-white"
          required
        >
          <option value="">Seleccionar equipo</option>
          {DEPARTMENTS.map(dept => (
            <option key={dept.id} value={dept.id}>
              {dept.icon} {dept.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Fecha de incorporación *
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          max={today}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          required
        />
        {proratedDays !== null && startDate && (
          <p className="text-sm text-emerald-600 mt-2">
            📅 Días de vacaciones {currentYear}: <strong>{proratedDays} días</strong>
            {proratedDays < 24 && (
              <span className="text-slate-500 ml-2">
                (prorrateado según fecha de incorporación)
              </span>
            )}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Rol
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 bg-white"
        >
          <option value="employee">Empleado</option>
          <option value="admin">Administrador</option>
        </select>
        {role === 'admin' && (
          <p className="text-xs text-amber-600 mt-2">
            ⚠️ Los administradores pueden aprobar solicitudes y gestionar empleados
          </p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" className="flex-1">
          Agregar Empleado
        </Button>
      </div>
    </form>
  )
}

