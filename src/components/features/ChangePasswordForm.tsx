import { useState, FormEvent } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import Button from '@/components/ui/Button'
import { Lock, Eye, EyeOff } from 'lucide-react'

export default function ChangePasswordForm() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Todos los campos son requeridos')
      return
    }

    if (newPassword.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas nuevas no coinciden')
      return
    }

    if (currentPassword === newPassword) {
      setError('La nueva contraseña debe ser diferente a la actual')
      return
    }

    setLoading(true)

    try {
      if (!user?.token) {
        setError('No estás autenticado. Por favor, inicia sesión de nuevo.')
        setLoading(false)
        return
      }

      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.error || 'Error al cambiar la contraseña')
        return
      }

      // Success
      toast.success('Contraseña actualizada correctamente')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setError('')
    } catch (error) {
      console.error('Error changing password:', error)
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Current Password */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Contraseña Actual
        </label>
        <div className="relative">
          <input
            type={showCurrentPassword ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-4 py-3 pr-10 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Ingresa tu contraseña actual"
            required
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* New Password */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Nueva Contraseña
        </label>
        <div className="relative">
          <input
            type={showNewPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-3 pr-10 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Mínimo 8 caracteres"
            required
            minLength={8}
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Debe tener al menos 8 caracteres
        </p>
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Confirmar Nueva Contraseña
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 pr-10 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Confirma tu nueva contraseña"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading ? (
          'Cambiando contraseña...'
        ) : (
          <>
            <Lock className="w-4 h-4" />
            Cambiar Contraseña
          </>
        )}
      </Button>
    </form>
  )
}
