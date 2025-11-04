import { AuthProvider } from '@/context/AuthContext'
import { PropsWithChildren } from 'react'
import './globals.css'

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}