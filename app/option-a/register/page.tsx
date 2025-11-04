'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function OptionARegister() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validaciones
      if (username.length < 3) {
        setError('El username debe tener al menos 3 caracteres')
        setLoading(false)
        return
      }

      if (password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres')
        setLoading(false)
        return
      }

      const usernameRegex = /^[a-zA-Z0-9_-]+$/
      if (!usernameRegex.test(username)) {
        setError('El username solo puede contener letras, números, guiones y guiones bajos')
        setLoading(false)
        return
      }

      // Verificar si el username ya existe
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username.toLowerCase())
        .single()

      if (existingProfile) {
        setError('Este username ya está en uso')
        setLoading(false)
        return
      }

      // Generar email ficticio
      const fakeEmail = `${username.toLowerCase()}@internal.pronyr.com`

      // Crear usuario
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: fakeEmail,
        password: password,
        options: {
          data: {
            username: username.toLowerCase(),
            display_name: username.toLowerCase(),
            email_verified: false,
            auth_option: 'A'
          }
        }
      })

      if (authError) throw authError

      if (authData.user) {
        // El perfil se crea automáticamente mediante el trigger de base de datos
        // Redirigir al dashboard
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Error al registrar usuario')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            Opción A: Simple
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Registro Rápido
          </h1>
          <p className="text-gray-600">
            Solo username y password. ¡Comienza en segundos!
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="tu_username"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Mínimo 3 caracteres, solo letras, números, guiones
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Mínimo 6 caracteres
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-800">
              ℹ️ Se creará automáticamente un email ficticio: <br />
              <span className="font-mono text-xs">{username || 'username'}@internal.pronyr.com</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/option-a/login')}
            className="text-green-600 hover:text-green-700 font-semibold text-sm"
          >
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            ← Volver a opciones
          </button>
        </div>
      </div>
    </div>
  )
}
