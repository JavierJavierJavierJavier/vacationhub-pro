import { useAuth } from '@/context/AuthContext'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { POLICIES } from '@/data/absenceTypes'
import ChangePasswordForm from '@/components/features/ChangePasswordForm'

export default function SettingsPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6 animate-slide-down">
      <h2 className="text-2xl font-bold text-slate-800">Configuración</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* User info */}
        <Card>
          <CardHeader>
            <span className="flex items-center gap-2">ℹ️ Tu Información</span>
          </CardHeader>
          <CardBody className="space-y-3">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Nombre</span>
              <span className="font-medium text-slate-800">{user.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Email</span>
              <span className="font-medium text-slate-800">{user.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Departamento</span>
              <span className="font-medium text-slate-800">{user.department?.name}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500">Rol</span>
              <Badge variant={user.isAdmin ? 'purple' : 'default'}>
                {user.isAdmin ? 'Co-Founder' : 'Empleado'}
              </Badge>
            </div>
          </CardBody>
        </Card>

        {/* Company policies */}
        <Card>
          <CardHeader>
            <span className="flex items-center gap-2">🛡️ Políticas de la Empresa</span>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-2xl font-bold text-slate-800">{POLICIES.vacationDaysPerYear}</p>
                <p className="text-sm text-slate-500">Días por año</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-2xl font-bold text-slate-800">{POLICIES.maxConsecutiveDays}</p>
                <p className="text-sm text-slate-500">Máx. consecutivos</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-2xl font-bold text-slate-800">{POLICIES.minAdvanceDays}</p>
                <p className="text-sm text-slate-500">Días antelación mín.</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-2xl font-bold text-slate-800">{POLICIES.maxTeamAbsencePercent}%</p>
                <p className="text-sm text-slate-500">Máx. ausencia equipo</p>
              </div>
            </div>
            
            {/* Carry-over info removed by policy */}
          </CardBody>
        </Card>
      </div>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <span className="flex items-center gap-2">🔒 Cambiar Contraseña</span>
        </CardHeader>
        <CardBody>
          <ChangePasswordForm />
        </CardBody>
      </Card>
    </div>
  )
}

