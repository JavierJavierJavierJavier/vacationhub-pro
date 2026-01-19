import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Sun, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.error || 'Error al solicitar restablecimiento')
        return
      }

      setSuccess(true)
      setEmail('')
    } catch (error) {
      console.error('Error requesting password reset:', error)
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
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
            <h1 className="text-3xl font-bold text-white mb-2">¿Olvidaste tu contraseña?</h1>
            <p className="text-emerald-100">Te enviaremos un enlace para restablecerla</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="bg-red-500/20 text-red-300 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            {success && (
              <div className="bg-emerald-500/20 text-emerald-300 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <div>
                  <p className="font-medium">¡Email enviado!</p>
                  <p className="text-emerald-200/80 text-xs mt-1">
                    Si el email existe, recibirás un enlace para restablecer tu contraseña.
                    Revisa tu bandeja de entrada (y spam).
                  </p>
                </div>
              </div>
            )}

            {!success && (
              <>
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
                    disabled={loading}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar enlace de restablecimiento'}
                </Button>
              </>
            )}

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
