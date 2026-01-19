import { useState, FormEvent, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { Sun, AlertCircle, CheckCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const email = searchParams.get('email') || ''
  const token = searchParams.get('token') || ''

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!email || !token) {
      setError('Enlace inválido. Por favor, solicita un nuevo enlace de restablecimiento.')
    }
  }, [email, token])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!email || !token) {
      setError('Enlace inválido')
      return
    }

    if (!newPassword || !confirmPassword) {
      setError('Todos los campos son requeridos')
      return
    }

    if (newPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          token,
          newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.error || 'Error al restablecer la contraseña')
        return
      }

      setSuccess(true)
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (error) {
      console.error('Error resetting password:', error)
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden p-8 text-center">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">¡Contraseña restablecida!</h1>
            <p className="text-emerald-200 mb-6">
              Tu contraseña ha sido restablecida correctamente. Serás redirigido al inicio de sesión...
            </p>
            <Link to="/login">
              <Button>Ir al inicio de sesión</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 p-8 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sun className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Restablecer Contraseña</h1>
            <p className="text-emerald-100">Crea una nueva contraseña para tu cuenta</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="bg-red-500/20 text-red-300 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            {email && (
              <div className="bg-white/5 rounded-xl p-3 text-sm">
                <p className="text-emerald-300/60">Restableciendo contraseña para:</p>
                <p className="text-white font-medium">{email}</p>
              </div>
            )}

            <div>
              <label className="block text-emerald-300 text-sm font-medium mb-2">
                Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-10 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  placeholder="Mínimo 8 caracteres"
                  required
                  minLength={8}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="mt-1 text-xs text-emerald-200/60">
                Debe tener al menos 8 caracteres
              </p>
            </div>

            <div>
              <label className="block text-emerald-300 text-sm font-medium mb-2">
                Confirmar Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-10 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  placeholder="Confirma tu nueva contraseña"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading || !email || !token}>
              {loading ? 'Restableciendo...' : 'Restablecer Contraseña'}
            </Button>

            <div className="pt-4 border-t border-white/10">
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-emerald-300 hover:text-emerald-200 text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al inicio de sesión
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
