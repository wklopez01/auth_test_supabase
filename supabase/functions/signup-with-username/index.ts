import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from '@supabase/supabase-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SignUpRequest {
  username: string
  email: string
  password: string
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { username, email, password }: SignUpRequest = await req.json()

    // Validaciones básicas
    if (!username || !email || !password) {
      return new Response(
        JSON.stringify({ error: 'Username, email y password son requeridos' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (username.length < 3) {
      return new Response(
        JSON.stringify({ error: 'El username debe tener al menos 3 caracteres' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (password.length < 6) {
      return new Response(
        JSON.stringify({ error: 'La contraseña debe tener al menos 6 caracteres' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validar que username solo contenga caracteres permitidos (alfanuméricos, guiones, guiones bajos)
    const usernameRegex = /^[a-zA-Z0-9_-]+$/
    if (!usernameRegex.test(username)) {
      return new Response(
        JSON.stringify({ error: 'El username solo puede contener letras, números, guiones y guiones bajos' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Crear cliente Supabase con service role para operaciones admin
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Verificar si el username ya existe
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('username')
      .eq('username', username.toLowerCase())
      .single()

    if (existingProfile) {
      return new Response(
        JSON.stringify({ error: 'Este username ya está en uso' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Crear usuario en Supabase Auth con email real
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email.toLowerCase(),
      password: password,
      email_confirm: true, // Auto-confirmar para desarrollo (cambiar a false en producción si quieres verificación)
      user_metadata: {
        username: username.toLowerCase(),
        auth_option: 'B'
      }
    })

    if (authError) {
      console.error('Error creating auth user:', authError)
      return new Response(
        JSON.stringify({ error: authError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // El perfil se crea automáticamente mediante el trigger de base de datos
    // Para Opción B, no crear sesión automáticamente - requiere verificación de email
    return new Response(
      JSON.stringify({
        user: {
          id: authData.user.id,
          username: username.toLowerCase(),
          email: email.toLowerCase(),
        },
        message: 'Usuario creado exitosamente. Por favor verifica tu email antes de iniciar sesión.',
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
