-- Agregar columna para distinguir entre Opción A y Opción B
alter table profiles add column auth_option char(1) check (auth_option in ('A', 'B'));

-- Agregar columna para email real (opcional en Opción A)
alter table profiles add column email text;

-- Index para búsquedas por email
create index profiles_email_idx on profiles(email) where email is not null;

-- Comentarios para documentación
comment on column profiles.auth_option is 'A = Simple (sin Edge Functions), B = Avanzada (con Edge Functions)';
comment on column profiles.email is 'Email real del usuario. NULL para Opción A hasta que el usuario lo agregue';
