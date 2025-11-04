'use client'

import { useState, FormEvent } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState<string>('')
  const { signIn, signUp } = useAuth()
  const router = useRouter()

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccessMessage('')

    const { error } = await signIn(username, password)

    if (error) {
      setError(error)
    } else {
      router.push('/dashboard')
    }
    
    setLoading(false)
  }

  const handleSignUp = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccessMessage('')

    const { error } = await signUp(username, password)

    if (error) {
      setError(error)
    } else {
      setSuccessMessage('¡Cuenta creada exitosamente! Redirigiendo...')
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    }
    
    setLoading(false)
  }

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f3f4f6'
    }}>
      <form 
        onSubmit={handleLogin}
        style={{ 
          width: '90%', 
          maxWidth: '400px', 
          padding: '40px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
      >
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          Iniciar Sesión
        </h1>
        
        {error && (
          <div style={{
            padding: '12px',
            marginBottom: '16px',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}
        
        {successMessage && (
          <div style={{
            padding: '12px',
            marginBottom: '16px',
            backgroundColor: '#d1fae5',
            color: '#065f46',
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            {successMessage}
          </div>
        )}
        
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '12px', 
            marginBottom: '12px', 
            border: '1px solid #d1d5db', 
            borderRadius: '6px',
            fontSize: '16px'
          }}
          required
          minLength={3}
          pattern="[a-zA-Z0-9_-]+"
          title="Solo letras, números, guiones y guiones bajos"
        />
        
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '12px', 
            marginBottom: '20px', 
            border: '1px solid #d1d5db', 
            borderRadius: '6px',
            fontSize: '16px'
          }}
          required
        />
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{ 
              flex: 1, 
              padding: '12px', 
              backgroundColor: loading ? '#93c5fd' : '#2563eb', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            {loading ? 'Cargando...' : 'Entrar'}
          </button>
          
          <button
            type="button"
            onClick={handleSignUp}
            disabled={loading}
            style={{ 
              flex: 1, 
              padding: '12px', 
              backgroundColor: loading ? '#86efac' : '#16a34a', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            Registrarse
          </button>
        </div>
      </form>
    </div>
  )
}