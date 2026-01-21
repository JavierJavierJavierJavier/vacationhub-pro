import { useState, FormEvent } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import Button from '@/components/ui/Button'

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    Promise.resolve(login(email, password))
      .then((result) => {
        if (!result.success) {
          setError(result.error || 'Error de autenticación')
        }
      })
      .finally(() => setLoading(false))
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
              <img src="/brand/alter5-mark.png" alt="Alter5" className="w-12 h-12 object-contain" />
            </div>
            <img src="/brand/alter5-wordmark.png" alt="Alter5" className="h-6 mx-auto mb-2 object-contain" />
            <p className="text-emerald-100">Sistema de Gestión de Ausencias</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="bg-red-500/20 text-red-300 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-emerald-300 text-sm font-medium mb-2">
                Email corporativo
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                placeholder="tu.nombre@alter-5.com"
                required
              />
            </div>

            <div>
              <label className="block text-emerald-300 text-sm font-medium mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Accediendo...' : 'Iniciar Sesión'}
            </Button>

            <div className="text-center">
              <Link
                to="/forgot-password"
                className="text-emerald-300 hover:text-emerald-200 text-sm transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </form>

        </div>
      </div>
    </div>
  )
}

