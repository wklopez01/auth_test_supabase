-- Función 1: Auto-confirmar emails ficticios (BEFORE INSERT)
create or replace function public.auto_confirm_fake_email()
returns trigger
language plpgsql
as $$
begin
  -- Si el email es ficticio, auto-confirmarlo
  if new.email like '%@internal.pronyr.com' and new.email_confirmed_at is null then
    new.email_confirmed_at := now();
  end if;
  return new;
end;
$$;

-- Función 2: Crear perfil automáticamente (AFTER INSERT)
create or replace function public.handle_new_user()
returns trigger
security definer set search_path = public
language plpgsql
as $$
begin
  -- Crear perfil automáticamente con datos del user metadata
  insert into public.profiles (id, username, email, auth_option)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    case 
      when new.email like '%@internal.pronyr.com' then null  -- Email ficticio = null
      else new.email  -- Email real
    end,
    coalesce(new.raw_user_meta_data->>'auth_option', 'A')
  );
  return new;
exception
  when others then
    -- Si falla, loguear pero no bloquear la creación del usuario
    raise warning 'Error creating profile for user %: %', new.id, sqlerrm;
    return new;
end;
$$;

-- Trigger 1: Auto-confirmar emails ficticios ANTES de insertar
drop trigger if exists auto_confirm_email on auth.users;
create trigger auto_confirm_email
  before insert on auth.users
  for each row execute function public.auto_confirm_fake_email();

-- Trigger 2: Crear perfil DESPUÉS de insertar usuario
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Comentario
comment on function public.handle_new_user() is 
  'Crea automáticamente un perfil cuando se registra un nuevo usuario';
