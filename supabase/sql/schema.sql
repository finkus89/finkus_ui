-- Tabla: profiles (Usuarios)
-- Contiene la información básica de cada usuario y se enlaza con auth.users.id
-- Incluye preferencias de contacto, consentimiento y canales de comunicación

/*
-- NOTA: Esta sección de creación queda COMENTADA porque la tabla ya existe.
--       No la ejecutes. Conservamos la definición aquí como referencia.
--       Usa la sección "MIGRACIÓN SOBRE TABLA EXISTENTE" más abajo.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique,
  name text,
  country text,
  timezone text,
  phone_country_code text,
  phone_national text,
  phone_e164 text,
  whatsapp_opt_in boolean,
  phone_verified_at timestamptz,
  telegram_chat_id text,
  preferred_channel text default 'app'
    check (preferred_channel in ('email','telegram','whatsapp','app')),
  marketing_opt_in boolean,
  terms_accepted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
*/

-- ────────────────────────────────────────────────────────────────────────────
-- MIGRACIÓN SOBRE TABLA EXISTENTE: RLS, políticas y trigger seguros
-- ────────────────────────────────────────────────────────────────────────────

-- 1) Defaults recomendados para booleanos (idempotente)
alter table public.profiles
  alter column whatsapp_opt_in set default false,
  alter column marketing_opt_in set default false;

-- 2) Activar Row Level Security (idempotente)
alter table public.profiles enable row level security;
alter table public.profiles force row level security;

-- 3) Políticas (crear solo si no existen)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'profiles'
      AND policyname = 'profiles_select_own'
  ) THEN
    EXECUTE $$create policy profiles_select_own
      on public.profiles for select
      using ( id = auth.uid() )$$;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'profiles'
      AND policyname = 'profiles_insert_self'
  ) THEN
    EXECUTE $$create policy profiles_insert_self
      on public.profiles for insert
      with check ( id = auth.uid() )$$;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'profiles'
      AND policyname = 'profiles_update_own'
  ) THEN
    EXECUTE $$create policy profiles_update_own
      on public.profiles for update
      using ( id = auth.uid() )$$;
  END IF;
END
$$;

-- 4) Trigger para auto-actualizar `updated_at` (seguro)
create or replace function public.set_updated_at()
returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- Tabla: profiles (Usuarios)
-- Contiene la información básica de cada usuario y se enlaza con auth.users.id
-- Incluye preferencias de contacto, consentimiento y canales de comunicación

/*
-- NOTA: Esta sección de creación queda COMENTADA porque la tabla ya existe.
--       No la ejecutes. Conservamos la definición aquí como referencia.
--       Usa la sección "MIGRACIÓN SOBRE TABLA EXISTENTE" más abajo.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique,
  name text,
  country text,
  timezone text,
  phone_country_code text,
  phone_national text,
  phone_e164 text,
  whatsapp_opt_in boolean,
  phone_verified_at timestamptz,
  telegram_chat_id text,
  preferred_channel text default 'app'
    check (preferred_channel in ('email','telegram','whatsapp','app')),
  marketing_opt_in boolean,
  terms_accepted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
*/

-- ────────────────────────────────────────────────────────────────────────────
-- MIGRACIÓN SOBRE TABLA EXISTENTE: RLS, políticas y trigger (sin DO/IF)
-- Ejecuta esta sección tal cual en el editor de Supabase
-- ────────────────────────────────────────────────────────────────────────────

-- 1) Defaults
alter table public.profiles
  alter column whatsapp_opt_in set default false,
  alter column marketing_opt_in set default false;

-- 2) RLS
alter table public.profiles enable row level security;
alter table public.profiles force row level security;

-- 3) Políticas (idempotente vía DROP IF EXISTS)
drop policy if exists profiles_select_own on public.profiles;
drop policy if exists profiles_insert_self on public.profiles;
drop policy if exists profiles_update_own on public.profiles;

create policy profiles_select_own
  on public.profiles for select
  using ( id = auth.uid() );

create policy profiles_insert_self
  on public.profiles for insert
  with check ( id = auth.uid() );

create policy profiles_update_own
  on public.profiles for update
  using ( id = auth.uid() );

-- 4) Trigger updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- Tabla: user_mentors (Relación usuario–mentoría)
-- Registra la configuración y estado de cada mentoría asignada a un usuario.
-- Separa estado/avance del usuario de cualquier información de pagos.

create table if not exists public.user_mentors (
  -- Identificador del registro
  id uuid primary key default gen_random_uuid(),

  -- Relaciones
  user_id uuid not null references public.profiles(id) on delete cascade, -- FK a profiles.id

  -- Identificador corto de la mentoría (ej: 'productivity', 'wisdom')
  mentor_slug text not null,

  -- Estado general de la mentoría para el usuario
  status text not null
    check (status in ('trial','active','paused','canceled')),

  -- Fechas de ciclo
  start_date date not null,      -- fecha de inicio de la mentoría para este usuario
  end_date date,                 -- fecha de fin/cancelación (si aplica)
  trial_end date,                -- fin del periodo de prueba gratuito (si aplica)

  -- Horarios (hora local del usuario; la zona está en profiles.timezone)
  morning_time time,             -- HH:MM
  night_time time,               -- HH:MM

  -- Configuración declarativa
  objective_text text,
  challenge_text text,
  var1 text,                     -- p. ej. ámbito
  var2 text,                     -- p. ej. actividad específica

  -- Pausas y metadatos flexibles
  pause_periods jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,

  -- Marcas de tiempo
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  -- Consistencia: si hay end_date, el status debe ser 'paused' o 'canceled'
  constraint user_mentors_end_requires_status
    check (end_date is null or status in ('paused','canceled'))
);

-- Unicidad: un usuario no puede tener dos mentorías activas/trial del mismo tipo
-- (se implementa con índice parcial para status en ('trial','active'))
create unique index if not exists user_mentors_unique_active
  on public.user_mentors (user_id, mentor_slug)
  where status in ('trial','active');

-- Índices útiles
create index if not exists user_mentors_user_id_idx on public.user_mentors (user_id);
create index if not exists user_mentors_status_idx on public.user_mentors (status);
create index if not exists user_mentors_start_date_idx on public.user_mentors (start_date);

-- ────────────────────────────────────────────────────────────────────────────
-- RLS y políticas
-- ────────────────────────────────────────────────────────────────────────────

-- Activar RLS
alter table public.user_mentors enable row level security;
alter table public.user_mentors force row level security;

-- Políticas (el usuario solo ve y gestiona sus propias mentorías)
drop policy if exists user_mentors_select_own on public.user_mentors;
drop policy if exists user_mentors_insert_self on public.user_mentors;
drop policy if exists user_mentors_update_own on public.user_mentors;

create policy user_mentors_select_own
  on public.user_mentors for select
  using ( user_id = auth.uid() );

create policy user_mentors_insert_self
  on public.user_mentors for insert
  with check ( user_id = auth.uid() );

create policy user_mentors_update_own
  on public.user_mentors for update
  using ( user_id = auth.uid() );

-- Trigger para mantener updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_user_mentors_updated_at on public.user_mentors;
create trigger trg_user_mentors_updated_at
before update on public.user_mentors
for each row execute function public.set_updated_at();

-- Tabla: messages
-- Registra cada mensaje generado por la IA para un usuario (mañana/noche),
-- junto con metadatos para historial, auditoría y análisis.

create table if not exists public.messages (
  -- Identificador del mensaje
  id uuid primary key default gen_random_uuid(),

  -- Relación con el usuario (se conserva el historial si el perfil se borra)
  user_id uuid references public.profiles(id) on delete set null,

  -- Contexto de la mentoría
  mentor_slug text not null,                                  -- ej: 'productivity'
  timing text not null                                         -- 'morning' | 'night'
    check (timing in ('morning','night')),

  -- Progresión (derivados de start_date y mapa de niveles del mentor)
  n_dias int not null check (n_dias >= 0),
  level  int not null check (level  >= 0),

  -- Contenido y trazabilidad
  content text not null,                                       -- texto final enviado al usuario
  prompt_used jsonb not null,                                  -- prompt final (plantilla + variables)
  source_model text,                                           -- ej: 'gpt-5'

  -- Tiempos
  generation_date timestamptz not null default now(),          -- cuándo se generó

  -- Estado de envío (control operativo mínimo)
  sent_status  text not null default 'pending'                 -- 'pending' | 'sent' | 'failed'
    check (sent_status in ('pending','sent','failed')),
  channel_used text                                            -- 'email' | 'telegram' | 'whatsapp' | 'app'
    check (channel_used in ('email','telegram','whatsapp','app')),

  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Unicidad operativa: evitar 2 mensajes del mismo tipo (timing) el mismo día
-- Nota: usa la FECHA derivada de generation_date en UTC. Si más adelante prefieres
-- la fecha LOCAL del usuario, cambia a un campo dedicado (local_date) o ajusta la expresión.
create unique index if not exists messages_unique_daily
  on public.messages (
    user_id,
    mentor_slug,
    (date(generation_date at time zone 'UTC')),
    timing
  );

-- Índices para historial y análisis
create index if not exists messages_user_id_idx         on public.messages (user_id);
create index if not exists messages_generation_date_idx on public.messages (generation_date desc);
create index if not exists messages_status_idx          on public.messages (sent_status);

-- ────────────────────────────────────────────────────────────────────────────
-- RLS y Políticas
-- ────────────────────────────────────────────────────────────────────────────

alter table public.messages enable row level security;
alter table public.messages force row level security;

-- El usuario solo puede ver/crear/actualizar sus propios mensajes
-- (si user_id es NULL por borrado del perfil, quedan fuera del alcance del usuario)

drop policy if exists messages_select_own on public.messages;
drop policy if exists messages_insert_self on public.messages;
drop policy if exists messages_update_own on public.messages;

create policy messages_select_own
  on public.messages for select
  using ( user_id = auth.uid() );

create policy messages_insert_self
  on public.messages for insert
  with check ( user_id = auth.uid() );

create policy messages_update_own
  on public.messages for update
  using ( user_id = auth.uid() );

-- Trigger para mantener updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_messages_updated_at on public.messages;
create trigger trg_messages_updated_at
before update on public.messages
for each row execute function public.set_updated_at();

-- Tabla: sent_log
-- Bitácora única de envíos al usuario (cada intento = 1 fila),
-- sin importar el origen (mentoría IA, sistema, notificaciones, pagos, recordatorios, etc.).
-- Separa el contenido generado (tabla messages) del acto de envío (esta tabla).

create table if not exists public.sent_log (
  -- Identificador del registro de envío
  id uuid primary key default gen_random_uuid(),

  -- Relación con el mensaje IA (opcional: mensajes del sistema no tienen message_id)
  message_id uuid references public.messages(id) on delete set null,

  -- Usuario destino (bitácora; NO borrar en cascada)
  user_id uuid not null references public.profiles(id),

  -- Clasificación del envío
  message_type text not null                  -- 'mentor_ai' | 'system' | 'notification' | 'payment' | 'reminder'
    check (message_type in ('mentor_ai','system','notification','payment','reminder')),
  mentor_slug text,                           -- puede ser NULL si es un envío general
  channel text not null                       -- 'email' | 'telegram' | 'whatsapp' | 'app'
    check (channel in ('email','telegram','whatsapp','app')),

  -- Estado e intentos
  status text not null default 'pending'      -- 'pending' | 'retrying' | 'sent' | 'failed'
    check (status in ('pending','retrying','sent','failed')),
  retry_count int not null default 0 check (retry_count >= 0),

  -- Tiempos
  sent_at timestamptz not null,               -- intento de envío
  delivered_at timestamptz,                   -- si el canal reporta entrega
  read_at timestamptz,                        -- si el canal reporta lectura

  -- Proveedor/correlación externa (opcional)
  provider text,                              -- ej: 'telegram','smtp','whatsapp_twilio','vercel_mail'
  provider_message_id text,                   -- id de mensaje del proveedor (para webhooks)

  -- Idempotencia para evitar duplicados de reintentos
  idempotency_key text unique,                -- clave única opcional por intento/canal

  -- Payloads y errores
  error_message text,                         -- descripción legible del error (si falla)
  response_log jsonb not null default '{}'::jsonb, -- respuesta técnica del canal (truncar si es muy grande)
  channel_payload jsonb,                      -- request/headers mínimos del envío (opcional; truncar si es muy grande)
  content_summary text,                       -- resumen corto del contenido (hasta ~500 chars)

  -- Marcas de tiempo de la fila
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Índices útiles
create index if not exists sent_log_user_id_sent_at_idx on public.sent_log (user_id, sent_at desc);
create index if not exists sent_log_message_id_idx on public.sent_log (message_id);
create index if not exists sent_log_status_idx on public.sent_log (status);
create index if not exists sent_log_provider_msg_idx on public.sent_log (provider, provider_message_id);

-- ────────────────────────────────────────────────────────────────────────────
-- RLS y Políticas
-- ────────────────────────────────────────────────────────────────────────────

alter table public.sent_log enable row level security;
alter table public.sent_log force row level security;

-- El usuario solo ve/crea/actualiza sus propios envíos

drop policy if exists sent_log_select_own on public.sent_log;
drop policy if exists sent_log_insert_self on public.sent_log;
drop policy if exists sent_log_update_own on public.sent_log;

create policy sent_log_select_own
  on public.sent_log for select
  using ( user_id = auth.uid() );

create policy sent_log_insert_self
  on public.sent_log for insert
  with check ( user_id = auth.uid() );

create policy sent_log_update_own
  on public.sent_log for update
  using ( user_id = auth.uid() );

-- Trigger para mantener updated_at (reutiliza public.set_updated_at si ya existe)
create or replace function public.set_updated_at()
returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_sent_log_updated_at on public.sent_log;
create trigger trg_sent_log_updated_at
before update on public.sent_log
for each row execute function public.set_updated_at();

-- ────────────────────────────────────────────────────────────────
-- Añadir columna `token` en tabla public.profiles
-- Propósito: identificador único y genérico de enlace para el usuario
-- ────────────────────────────────────────────────────────────────

-- 1) Crear columna si no existe
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS token uuid NOT NULL DEFAULT gen_random_uuid();

-- 2) Índice único (garantiza que no se repita entre usuarios)
CREATE UNIQUE INDEX IF NOT EXISTS profiles_token_key
ON public.profiles(token);

-- 3) Comentarios de documentación
COMMENT ON COLUMN public.profiles.token IS
'Token único (UUID) generado automáticamente al crear el perfil. 
Usado para vincular integraciones externas (como Telegram). 
No derivado del correo ni editable por el usuario.';

-- 4) Verificación rápida (opcional)
-- select id, email, token from public.profiles limit 5;
