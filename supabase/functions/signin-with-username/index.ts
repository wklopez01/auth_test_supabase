import { serve } from 'https://deno.land/std@0.192.0/http/server.ts'
import { createClient } from '@supabase/supabase-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SignInRequest {
  identifier: string // puede ser username o email
  password: string
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { identifier, password }: SignInRequest = await req.json()

    // Validaciones básicas
    if (!identifier || !password) {
      return new Response(
        JSON.stringify({ error: 'Identifier y password son requeridos' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Crear cliente Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    let emailToUse = ''

    // Determinar si el identifier es un email o un username
    if (identifier.includes('@')) {
      // Es un email, usarlo directamente
      emailToUse = identifier.toLowerCase()
    } else {
      // Es un username, buscar el perfil para obtener el email
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('username', identifier.toLowerCase())
        .single()

      if (profileError || !profile) {
        return new Response(
          JSON.stringify({ error: 'Usuario o contraseña incorrectos' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Si el perfil tiene email real, usarlo; si no, usar el email interno
      emailToUse = profile.email || `${identifier.toLowerCase()}@internal.pronyr.com`
    }

    // Intentar iniciar sesión
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: emailToUse,
      password: password,
    })

    if (authError) {
      return new Response(
        JSON.stringify({ error: 'Usuario o contraseña incorrectos' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Obtener el username del perfil
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', authData.user.id)
      .single()

    return new Response(
      JSON.stringify({
        user: {
          id: authData.user.id,
          username: profile?.username || identifier,
        },
        session: authData.session,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
