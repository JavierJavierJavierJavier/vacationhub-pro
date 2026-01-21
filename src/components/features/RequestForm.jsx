import { useState, useMemo, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRequests } from '@/context/RequestContext'
import { useToast } from '@/context/ToastContext'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import { ABSENCE_TYPES } from '@/data/absenceTypes'
import { useEmployees } from '@/context/EmployeeContext'
import { calculateWorkingDays, getHolidaysInRange, formatDate } from '@/utils/dateUtils'
import { calculateBalance, analyzeRequest } from '@/utils/calculations'
import { getHolidayIcon } from '@/data/holidays'
import Modal from '@/components/ui/Modal'

export default function RequestForm({ onClose, preselectedType = 'vacation', preselectedDates = null }) {
  const { user } = useAuth()
  const { requests, selectedYear, addRequest } = useRequests()
  const { employees, getEmployeeById } = useEmployees()
  const { toast } = useToast()

  const [type, setType] = useState(preselectedType)
  const [startDate, setStartDate] = useState(preselectedDates?.start || '')
  const [endDate, setEndDate] = useState(preselectedDates?.end || '')
  const [reason, setReason] = useState('')
  const [backup, setBackup] = useState('')
  const [showCriticalAlertModal, setShowCriticalAlertModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (preselectedType) setType(preselectedType)
  }, [preselectedType])

  const employee = getEmployeeById(user.id)
  const balance = calculateBalance(user.id, selectedYear, requests, employee?.startDate)

  const preview = useMemo(() => {
    if (!startDate || !endDate) return { days: 0, holidays: [] }
    const days = calculateWorkingDays(startDate, endDate)
    const holidays = getHolidaysInRange(startDate, endDate)
    return { days, holidays }
  }, [startDate, endDate])

  const analysis = useMemo(() => {
    if (!startDate || !endDate || preview.days === 0) return null
    // Create a temporary request object for analysis (with required fields)
    const tempRequest = {
      id: 'temp',
      employeeId: user.id,
      startDate,
      endDate,
      days: preview.days,
      type,
      year: new Date(startDate).getFullYear(),
      status: 'pending',
      requestDate: new Date().toISOString().split('T')[0],
      reason: reason || 'Sin especificar',
      backup: backup || null,
    }
    return analyzeRequest(tempRequest, requests, employees)
  }, [startDate, endDate, preview.days, type, user.id, requests, reason, backup, employees])

  const teammates = employees.filter(e => e.deptId === user.deptId && e.id !== user.id)

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (preview.days === 0) {
      toast.error('Selecciona días laborables válidos')
      return
    }

    const absenceType = ABSENCE_TYPES.find(t => t.id === type)
    if (absenceType?.deducts && preview.days > balance.available) {
      toast.error(`Solo tienes ${balance.available} días disponibles`)
      return
    }

    if (analysis?.alerts.length > 0) {
      setShowCriticalAlertModal(true)
      return
    }

    submitRequest()
  }

  const submitRequest = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      await addRequest({
        employeeId: user.id,
        startDate,
        endDate,
        days: preview.days,
        year: new Date(startDate).getFullYear(),
        reason: reason || 'Sin especificar',
        type,
        backup: backup || null,
      })

      setShowCriticalAlertModal(false)
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <>
    <form onSubmit={handleSubmit} className="p-6 space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de ausencia</label>
        <div className="grid grid-cols-3 gap-2">
          {ABSENCE_TYPES.slice(0, 6).map(t => (
            <button key={t.id} type="button" onClick={() => setType(t.id)}
              className={`p-3 rounded-xl border-2 transition-all text-center ${type === t.id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'}`}>
              <span className="text-2xl block mb-1">{t.icon}</span>
              <span className="text-xs font-medium text-slate-700">{t.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Fecha inicio</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} min={today}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Fecha fin</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate || today}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50" required />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Motivo (opcional)</label>
        <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={2}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
          placeholder="Vacaciones de verano..." />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Backup (opcional)</label>
        <select value={backup} onChange={(e) => setBackup(e.target.value)}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 bg-white">
          <option value="">Seleccionar compañero</option>
          {teammates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-xl p-4 text-center border border-emerald-100">
        <p className="text-4xl font-bold text-emerald-600">{preview.days}</p>
        <p className="text-sm text-emerald-700">días laborables</p>
        {preview.holidays.length > 0 && (
          <div className="mt-3 pt-3 border-t border-emerald-200">
            <p className="text-xs text-emerald-600 font-medium mb-2">Festivos en el período:</p>
            <div className="space-y-2">
              {preview.holidays.map(h => (
                <div key={h.date} className="bg-white/50 rounded-lg p-2 border border-emerald-100">
                  <div className="flex items-start gap-2">
                    <span className="text-base">{getHolidayIcon(h.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-emerald-800">
                        {formatDate(h.date)}: {h.name}
                      </p>
                      {h.description && (
                        <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                          {h.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {analysis && [...analysis.alerts, ...analysis.warnings].length > 0 && (
        <div className="space-y-2">
          {[...analysis.alerts, ...analysis.warnings].map((a, i) => (
            <Alert key={i} message={a.message} detail={a.detail} severity={a.severity} />
          ))}
        </div>
      )}

      <p className="text-sm text-slate-500 text-center">
        Tienes <strong className="text-emerald-600">{balance.available}</strong> días disponibles
      </p>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancelar</Button>
        <Button type="submit" disabled={preview.days === 0 || isSubmitting} className="flex-1">
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </Button>
      </div>
    </form>

    <Modal
      isOpen={showCriticalAlertModal}
      onClose={() => setShowCriticalAlertModal(false)}
      title="Alertas críticas detectadas"
    >
      <div className="space-y-4">
        <p className="text-sm text-slate-700">
          ⚠️ Hay alertas críticas para esta solicitud. Revisa los avisos antes de continuar.
        </p>
        {analysis && analysis.alerts.length > 0 && (
          <div className="space-y-2">
            {analysis.alerts.map((a, i) => (
              <Alert key={i} message={a.message} detail={a.detail} severity={a.severity} />
            ))}
          </div>
        )}
        <div className="flex gap-3 justify-end pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setShowCriticalAlertModal(false)}
          >
            Revisar de nuevo
          </Button>
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={submitRequest}
          >
            {isSubmitting ? 'Enviando...' : 'Continuar igualmente'}
          </Button>
        </div>
      </div>
    </Modal>
    </>
  )
}
