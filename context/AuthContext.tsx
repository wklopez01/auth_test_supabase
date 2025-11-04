'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { User, AuthError } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  username: string | null
  loading: boolean
  signUp: (username: string, password: string) => Promise<{ data: any; error: string | null }>
  signIn: (username: string, password: string) => Promise<{ data: any; error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  username: null,
  loading: true,
  signUp: async () => ({ data: null, error: null }),
  signIn: async () => ({ data: null, error: null }),
  signOut: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar sesión actual y obtener username
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      
      if (session?.user) {
        // Obtener username del perfil
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', session.user.id)
          .single()
        
        setUsername(profile?.username ?? null)
      }
      
      setLoading(false)
    }
    
    initAuth()

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', session.user.id)
          .single()
        
        setUsername(profile?.username ?? null)
      } else {
        setUsername(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (username: string, password: string) => {
    try {
      // Generar email ficticio para Opción A
      const fakeEmail = `${username.toLowerCase()}@internal.pronyr.com`
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/signup-with-username`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ username, email: fakeEmail, password }),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        return { data: null, error: result.error || 'Error al registrar usuario' }
      }

      // Establecer la sesión en el cliente
      if (result.session) {
        await supabase.auth.setSession({
          access_token: result.session.access_token,
          refresh_token: result.session.refresh_token,
        })
      }

      return { data: result, error: null }
    } catch (error) {
      return { data: null, error: 'Error de conexión' }
    }
  }

  const signIn = async (username: string, password: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/signin-with-username`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ identifier: username, password }),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        return { data: null, error: result.error || 'Error al iniciar sesión' }
      }

      // Establecer la sesión en el cliente
      if (result.session) {
        await supabase.auth.setSession({
          access_token: result.session.access_token,
          refresh_token: result.session.refresh_token,
        })
      }

      return { data: result, error: null }
    } catch (error) {
      return { data: null, error: 'Error de conexión' }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value: AuthContextType = {
    user,
    username,
    signUp,
    signIn,
    signOut,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}