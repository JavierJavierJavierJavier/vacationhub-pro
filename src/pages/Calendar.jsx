import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from 'date-fns'
import { es } from 'date-fns/locale'
import { useAuth } from '@/context/AuthContext'
import { useRequests } from '@/context/RequestContext'
import { Card, CardBody } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import RequestForm from '@/components/features/RequestForm'
import FilterBar from '@/components/ui/FilterBar'
import { getHoliday, getHolidayIcon } from '@/data/holidays'
import { getAbsenceType, ABSENCE_TYPES } from '@/data/absenceTypes'
import { toDateString, formatDate } from '@/utils/dateUtils'
import { DEPARTMENTS } from '@/data/employees'
import { useEmployees } from '@/context/EmployeeContext'

export default function CalendarPage() {
  const { user } = useAuth()
  const { requests, getRequestsForDate } = useRequests()
  const { employees, getEmployeeById } = useEmployees()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedHoliday, setSelectedHoliday] = useState(null)
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [employeeFilter, setEmployeeFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
    
    // Add padding for days before month start
    const startDay = monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1
    const paddingBefore = Array(startDay).fill(null)
    
    return [...paddingBefore, ...days].map(date => {
      if (!date) return { date: null }
      
      const dateString = toDateString(date)
      const holiday = getHoliday(dateString, year)
      let dayRequests = getRequestsForDate(dateString)
      
      // Apply filters for admins
      if (user.isAdmin) {
        dayRequests = dayRequests.filter(r => {
          const employee = getEmployeeById(r.employeeId)
          if (!employee) return false
          if (departmentFilter !== 'all' && employee.deptId !== departmentFilter) return false
          if (employeeFilter !== 'all' && employee.id !== employeeFilter) return false
          if (typeFilter !== 'all' && r.type !== typeFilter) return false
          return true
        })
      } else {
        // Non-admins only see their own requests
        dayRequests = dayRequests.filter(r => r.employeeId === user.id)
        if (typeFilter !== 'all') {
          dayRequests = dayRequests.filter(r => r.type === typeFilter)
        }
      }

      const isWeekend = date.getDay() === 0 || date.getDay() === 6

      return {
        date,
        dateString,
        holiday,
        isWeekend,
        isToday: isToday(date),
        hasApproved: dayRequests.some(r => r.status === 'approved'),
        hasPending: dayRequests.some(r => r.status === 'pending'),
        requests: dayRequests,
      }
    })
  }, [currentDate, year, requests, user, getRequestsForDate, departmentFilter, employeeFilter, typeFilter])

  const departmentOptions = [
    { value: 'all', label: 'Todos los equipos' },
    ...DEPARTMENTS.map(d => ({ value: d.id, label: d.name }))
  ]

  const employeeOptions = [
    { value: 'all', label: 'Todas las personas' },
    ...employees.filter((e) =>
      departmentFilter === 'all' ? true : e.deptId === departmentFilter
    ).map((e) => ({ value: e.id, label: e.name })),
  ]

  const typeOptions = [
    { value: 'all', label: 'Todos los tipos' },
    ...ABSENCE_TYPES.map(t => ({ value: t.id, label: t.name })),
  ]

  const handleDayClick = (day) => {
    if (!day.date) return
    
    // Si es festivo, mostrar información del festivo
    if (day.holiday) {
      setSelectedHoliday(day.holiday)
      return
    }
    
    // Si es fin de semana, no hacer nada
    if (day.isWeekend) return
    
    // Para días laborables, abrir formulario de solicitud
    setSelectedDate(day.dateString)
    setShowRequestModal(true)
  }

  const prevMonth = () => setCurrentDate(new Date(year, month - 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1))

  return (
    <div className="space-y-6 animate-slide-down">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Calendario</h2>
        <Button onClick={() => { setSelectedDate(null); setShowRequestModal(true); }}>
          <Plus className="w-5 h-5" />
          Solicitar
        </Button>
      </div>

      {/* Filters */}
      <FilterBar
        filters={[
          ...(user.isAdmin ? [
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
          ] : []),
          {
            id: 'type',
            type: 'select',
            label: 'Tipo',
            value: typeFilter,
            onChange: setTypeFilter,
            options: typeOptions,
          },
        ]}
      />

      <Card>
        <CardBody>
          {/* Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-xl">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-slate-800 capitalize">
              {format(currentDate, 'MMMM yyyy', { locale: es })}
            </h3>
            <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-xl">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, i) => (
              <div key={day} className={`text-center text-sm font-medium py-2 ${i >= 5 ? 'text-slate-400' : 'text-slate-600'}`}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {calendarDays.map((day, i) => {
              if (!day.date) return <div key={i} className="aspect-square" />

              let className = 'aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-medium transition-all cursor-pointer '
              
              if (day.holiday) {
                className += 'bg-red-500 text-white'
              } else if (day.isWeekend) {
                className += 'bg-slate-100 text-slate-400 cursor-default'
              } else if (day.hasApproved) {
                className += 'bg-emerald-500 text-white hover:bg-emerald-600'
              } else if (day.hasPending) {
                className += 'bg-amber-400 text-white'
              } else if (day.isToday) {
                className += 'bg-blue-500 text-white ring-2 ring-blue-300 ring-offset-2'
              } else {
                className += 'bg-white border border-slate-200 text-slate-700 hover:border-emerald-400 hover:bg-emerald-50'
              }

              return (
                <div
                  key={i}
                  className={className}
                  onClick={() => handleDayClick(day)}
                  title={day.holiday ? `${day.holiday.name}${day.holiday.description ? ` - ${day.holiday.description}` : ''}` : ''}
                >
                  <span>{day.date.getDate()}</span>
                  {day.holiday && (
                    <span className="text-xs">{getHolidayIcon(day.holiday.type)}</span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-slate-100">
            {[
              { color: 'bg-emerald-500', label: 'Aprobado' },
              { color: 'bg-amber-400', label: 'Pendiente' },
              { color: 'bg-red-500', label: 'Festivo' },
              { color: 'bg-slate-100', label: 'Fin de semana' },
              { color: 'bg-blue-500', label: 'Hoy' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${item.color}`} />
                <span className="text-sm text-slate-600">{item.label}</span>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Modal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        title="Nueva Solicitud"
      >
        <RequestForm
          onClose={() => setShowRequestModal(false)}
          preselectedDates={selectedDate ? { start: selectedDate, end: selectedDate } : null}
        />
      </Modal>

      {/* Modal de información de festivo */}
      <Modal
        isOpen={!!selectedHoliday}
        onClose={() => setSelectedHoliday(null)}
        title={`📅 ${selectedHoliday?.name || 'Festivo'}`}
        size="md"
      >
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{getHolidayIcon(selectedHoliday?.type)}</span>
            <div>
              <h3 className="text-xl font-bold text-slate-800">{selectedHoliday?.name}</h3>
              <p className="text-sm text-slate-500">
                {selectedHoliday?.type === 'n' && 'Festivo Nacional'}
                {selectedHoliday?.type === 'r' && 'Festivo Regional (Comunidad de Madrid)'}
                {selectedHoliday?.type === 'l' && 'Festivo Local (Madrid)'}
              </p>
            </div>
          </div>
          
          {selectedHoliday?.description && (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <p className="text-sm font-medium text-slate-700 mb-2">📖 Sobre este día:</p>
              <p className="text-slate-600 leading-relaxed">{selectedHoliday.description}</p>
            </div>
          )}
          
          <div className="pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-500">
              <strong>Fecha:</strong> {selectedHoliday?.date ? formatDate(selectedHoliday.date, 'dd MMMM yyyy') : ''}
            </p>
          </div>
        </div>
      </Modal>
    </div>
  )
}
