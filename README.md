# Modo desarrollo (guía rápida)

## Requisitos
- Node.js 20+ (recomendado LTS)
- npm o pnpm o yarn
- Cuenta y proyecto en Supabase (si usarás el backend remoto)

## Variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto con:

```
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

## Instalar dependencias
Con npm:
```
npm install
```
Con pnpm:
```
pnpm install
```

## Aplicar migraciones en Supabase (antes de iniciar)
- Abre Supabase Dashboard → SQL Editor
- Copia y pega, en orden, el contenido de tus archivos en `supabase/migrations/`

## Iniciar el modo desarrollo
Con npm:
```
npm run dev
```
Con pnpm:
```
pnpm dev
```

La app estará en:
```
localhost
```

## Scripts comunes (package.json)
- `dev`: arranca Next.js en modo desarrollo
- `build`: compila la app
- `start`: inicia la app compilada

