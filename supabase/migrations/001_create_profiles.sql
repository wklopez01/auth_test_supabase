-- Tabla de perfiles con username
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Index para búsquedas rápidas por username
create index profiles_username_idx on profiles(username);

-- RLS policies
alter table profiles enable row level security;

-- NOTA: La policy de INSERT se crea en 003_auto_create_profile.sql junto con el trigger

-- Cualquiera puede leer perfiles (útil para menciones, búsquedas, etc)
create policy "Profiles son públicos para lectura" 
  on profiles for select 
  using (true);

-- Solo el dueño puede actualizar su perfil
create policy "Usuarios pueden actualizar su propio perfil" 
  on profiles for update 
  using (auth.uid() = id);

-- Solo el dueño puede eliminar su perfil
create policy "Usuarios pueden eliminar su propio perfil" 
  on profiles for delete 
  using (auth.uid() = id);

-- Crear policy segura: solo usuarios autenticados pueden crear su propio perfil
create policy "Usuarios autenticados pueden crear su propio perfil" 
  on profiles for insert 
  with check (auth.uid() = id);

-- Trigger para actualizar updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at 
  before update on profiles
  for each row
  execute function update_updated_at_column();
