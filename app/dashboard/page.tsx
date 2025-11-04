'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function DashboardPage() {
  const { user, username, signOut, loading } = useAuth()
  const router = useRouter()
  const [authOption, setAuthOption] = useState<'A' | 'B' | null>(null)
  const [lastAuthTime, setLastAuthTime] = useState<number | null>(null)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }

    if (user) {
      // Cargar métricas de autenticación
      const savedAuthTime = localStorage.getItem('lastAuthTime')
      const savedAuthOption = localStorage.getItem('lastAuthOption')
      
      if (savedAuthTime) setLastAuthTime(parseFloat(savedAuthTime))
      if (savedAuthOption) setAuthOption(savedAuthOption as 'A' | 'B')

      // Cargar perfil del usuario
      loadProfile()
    }
  }, [user, loading, router])

  const loadProfile = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (data) {
      setProfile(data)
      if (data.auth_option) {
        setAuthOption(data.auth_option)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Cargando...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const getAuthOptionColor = () => {
    return authOption === 'A' ? 'green' : 'blue'
  }

  const getAuthOptionName = () => {
    return authOption === 'A' ? 'Simple (Sin Edge Functions)' : 'Avanzada (Con Edge Functions)'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Dashboard
              </h1>
              <p className="text-gray-600">
                Bienvenido, <span className="font-semibold">{username || user.email}</span>
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>

          {authOption && (
            <div className={`bg-${getAuthOptionColor()}-50 border-2 border-${getAuthOptionColor()}-200 rounded-lg p-4`}>
              <p className="text-sm font-semibold text-gray-700">
                Método de autenticación: <span className={`text-${getAuthOptionColor()}-700`}>Opción {authOption}</span>
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {getAuthOptionName()}
              </p>
            </div>
          )}
        </div>

        {/* Métricas de Velocidad */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Velocidad de Autenticación */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              ⚡ Velocidad de Autenticación
            </h2>
            
            {lastAuthTime !== null ? (
              <div>
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-blue-600 mb-2">
                    {lastAuthTime.toFixed(0)}ms
                  </div>
                  <p className="text-gray-600">Tiempo de inicio de sesión</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Opción A (Simple)</span>
                      <span className="text-sm text-green-600 font-semibold">~100-300ms</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Opción B (Avanzada)</span>
                      <span className="text-sm text-blue-600 font-semibold">~300-600ms</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Tu última autenticación:</strong> {lastAuthTime.toFixed(2)}ms con Opción {authOption}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                No hay datos de velocidad disponibles
              </div>
            )}
          </div>

          {/* Comparación de Opciones */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              📊 Comparación de Opciones
            </h2>

            <div className="space-y-6">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-bold text-green-700 mb-2">Opción A: Simple</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>✓ Más rápida (sin Edge Functions)</li>
                  <li>✓ Sin verificación de email</li>
                  <li>✓ Email ficticio automático</li>
                  <li>✓ Ideal para prototipos</li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-bold text-blue-700 mb-2">Opción B: Avanzada</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>✓ Login con username o email</li>
                  <li>✓ Verificación obligatoria</li>
                  <li>✓ Recuperación de contraseña</li>
                  <li>✓ Producción profesional</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">
                <strong>Nota:</strong> La diferencia de velocidad se debe al procesamiento adicional de las Edge Functions en la Opción B.
              </p>
            </div>
          </div>
        </div>

        {/* Información del Usuario */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            👤 Información del Usuario
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Username</p>
              <p className="text-lg font-semibold text-gray-900">
                {username || profile?.username || 'N/A'}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="text-lg font-semibold text-gray-900 break-all">
                {profile?.email || user.email || 'N/A'}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">User ID</p>
              <p className="text-xs font-mono text-gray-700 break-all">
                {user.id}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Método de Auth</p>
              <p className="text-lg font-semibold text-gray-900">
                Opción {authOption || 'N/A'}
              </p>
            </div>
          </div>

          {authOption === 'A' && !profile?.email && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 mb-3">
                <strong>💡 Sugerencia:</strong> Puedes agregar un email real para mayor seguridad
              </p>
              <button
                onClick={() => router.push('/add-email')}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors"
              >
                Agregar Email Real
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}