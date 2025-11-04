'use client'

import { useRouter } from 'next/navigation'
import { Zap, Shield } from 'lucide-react'

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Sistema de Autenticación Dual
          </h1>
          <p className="text-lg text-gray-600">
            Elige el tipo de autenticación que mejor se adapte a tus necesidades
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Opción A: Simple */}
          <div 
            onClick={() => router.push('/option-a/register')}
            className="bg-white rounded-2xl shadow-xl p-6 cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl border-4 border-transparent hover:border-green-400"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4 mx-auto">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">
              Opción A: Simple
            </h2>
            
            <div className="mb-4">
              <span className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-4 py-2 rounded-full">
                SIN Edge Functions
              </span>
            </div>

            <p className="text-gray-600 mb-4 text-base">
              Registro ultra-rápido sin email real. Perfecto para comenzar.
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">Registro: username + password</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">Email ficticio automático</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">Uso inmediato (sin verificación)</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">Email real opcional después</span>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-3 mb-3">
              <p className="text-sm text-green-800 font-semibold">
                ⚡ Velocidad: Ultra-rápida
              </p>
              <p className="text-xs text-green-600 mt-1">
                Sin configuración de servidor
              </p>
            </div>

            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              Comenzar con Opción A
            </button>
          </div>

          {/* Opción B: Avanzada */}
          <div 
            onClick={() => router.push('/option-b/register')}
            className="bg-white rounded-2xl shadow-xl p-6 cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl border-4 border-transparent hover:border-blue-400"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4 mx-auto">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">
              Opción B: Avanzada
            </h2>
            
            <div className="mb-4">
              <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full">
                CON Edge Functions
              </span>
            </div>

            <p className="text-gray-600 mb-4 text-base">
              Sistema completo tipo Twitter/Instagram con más verificación y control
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span className="text-gray-700">Registro: username + email + password</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span className="text-gray-700">Login con username O email</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span className="text-gray-700">Verificación de email obligatoria</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span className="text-gray-700">Recuperación de contraseña</span>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-3 mb-3">
              <p className="text-sm text-blue-800 font-semibold">
                🛡️ Seguridad: Profesional
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Con Deno Edge Functions
              </p>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              Comenzar con Opción B
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}