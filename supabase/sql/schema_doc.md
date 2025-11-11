# Finkus — Resumen del Esquema de Base de Datos (Supabase)

> Fuente: `schema.sql` (versión recibida).  
> Notas generales:
> - Todas las tablas están bajo `public`.
> - **RLS** (Row Level Security) está habilitado y forzado en todas las tablas de dominio.
> - La función `public.set_updated_at()` se reutiliza para actualizar `updated_at` en triggers `BEFORE UPDATE`.

---

## Tabla: `profiles`
**Propósito:** Información de usuario enlazada con `auth.users.id`. Preferencias de contacto, consentimiento y canales.

### Columnas
| Columna               | Tipo        | Restricciones / Default                                  | Descripción |
|-----------------------|-------------|-----------------------------------------------------------|-------------|
| `id`                  | uuid        | **PK**, FK → `auth.users(id)` **ON DELETE CASCADE**       | Identidad del usuario (Auth). |
| `email`               | text        | `unique`                                                  | Correo del usuario. |
| `name`                | text        |                                                           | Nombre. |
| `country`             | text        |                                                           | País. |
| `timezone`            | text        |                                                           | Zona horaria (IANA). |
| `phone_country_code`  | text        |                                                           | Código país (tel). |
| `phone_national`      | text        |                                                           | Número nacional. |
| `phone_e164`          | text        |                                                           | Teléfono en formato E.164. |
| `whatsapp_opt_in`     | boolean     | `default false`                                           | Consentimiento WhatsApp. |
| `phone_verified_at`   | timestamptz |                                                           | Fecha verificación teléfono. |
| `telegram_chat_id`    | text        |                                                           | Chat ID de Telegram (texto). |
| `preferred_channel`   | text        | `default 'app'`, `check in ('email','telegram','whatsapp','app')` | Canal preferido. |
| `marketing_opt_in`    | boolean     | `default false`                                           | Consentimiento marketing. |
| `terms_accepted_at`   | timestamptz |                                                           | Aceptación de términos. |
| `created_at`          | timestamptz | `default now()`                                           | Creación. |
| `updated_at`          | timestamptz | `default now()`                                           | Última actualización. |

### Índices
- `email` único (implícito por `unique`).

### Triggers / Funciones
- **Función:** `public.set_updated_at()` — asigna `new.updated_at = now()`.
- **Trigger:** `trg_profiles_updated_at` — `BEFORE UPDATE` → `public.set_updated_at()`.

### RLS y Políticas
- RLS: `enable row level security` + `force row level security`.
- Políticas:
  - `profiles_select_own` (SELECT) — `USING (id = auth.uid())`
  - `profiles_insert_self` (INSERT) — `WITH CHECK (id = auth.uid())`
  - `profiles_update_own` (UPDATE) — `USING (id = auth.uid())`

**Notas RLS:** El usuario solo ve/inserta/actualiza **su propio** perfil.

---

## Tabla: `user_mentors`
**Propósito:** Estado y configuración de cada mentoría asignada a un usuario (separado de pagos).

### Columnas
| Columna           | Tipo        | Restricciones / Default                                                                 | Descripción |
|-------------------|-------------|------------------------------------------------------------------------------------------|-------------|
| `id`              | uuid        | **PK**, `default gen_random_uuid()`                                                     | Identificador. |
| `user_id`         | uuid        | **NOT NULL**, FK → `public.profiles(id)` **ON DELETE CASCADE**                          | Usuario dueño. |
| `mentor_slug`     | text        | **NOT NULL**                                                                            | Identificador de mentoría (ej: `productivity`). |
| `status`          | text        | **NOT NULL**, `check in ('trial','active','paused','canceled')`                         | Estado. |
| `start_date`      | date        | **NOT NULL**                                                                            | Inicio del ciclo. |
| `end_date`        | date        |                                                                                          | Fin/cancelación. |
| `trial_end`       | date        |                                                                                          | Fin de prueba. |
| `morning_time`    | time        |                                                                                          | Hora local mensaje mañana. |
| `night_time`      | time        |                                                                                          | Hora local mensaje noche. |
| `objective_text`  | text        |                                                                                          | Objetivo declarado. |
| `challenge_text`  | text        |                                                                                          | Desafío declarado. |
| `var1`            | text        |                                                                                          | Variable libre (p. ej. ámbito). |
| `var2`            | text        |                                                                                          | Variable libre (p. ej. actividad). |
| `pause_periods`   | jsonb       | `not null default '[]'::jsonb`                                                          | Periodos de pausa. |
| `metadata`        | jsonb       | `not null default '{}'::jsonb`                                                          | Metadatos flexibles. |
| `created_at`      | timestamptz | `default now()`                                                                          | Creación. |
| `updated_at`      | timestamptz | `default now()`                                                                          | Última actualización. |
| **Constraint**    | —           | `user_mentors_end_requires_status`: si `end_date` no es null ⇒ `status in ('paused','canceled')` | Consistencia. |

### Índices
- **Único parcial:** `user_mentors_unique_active` en (`user_id`, `mentor_slug`) **where** `status in ('trial','active')`.
- `user_mentors_user_id_idx` en (`user_id`)
- `user_mentors_status_idx` en (`status`)
- `user_mentors_start_date_idx` en (`start_date`)

### Triggers / Funciones
- Reutiliza `public.set_updated_at()` con trigger `trg_user_mentors_updated_at` (`BEFORE UPDATE`).

### RLS y Políticas
- RLS: habilitado y forzado.
- Políticas:
  - `user_mentors_select_own` (SELECT) — `USING (user_id = auth.uid())`
  - `user_mentors_insert_self` (INSERT) — `WITH CHECK (user_id = auth.uid())`
  - `user_mentors_update_own` (UPDATE) — `USING (user_id = auth.uid())`

**Notas RLS:** El usuario solo gestiona sus propias mentorías.

---

## Tabla: `messages`
**Propósito:** Historial de mensajes generados por la IA (mañana/noche) + metadatos de auditoría/análisis.

### Columnas
| Columna            | Tipo        | Restricciones / Default                                                                                 | Descripción |
|--------------------|-------------|----------------------------------------------------------------------------------------------------------|-------------|
| `id`               | uuid        | **PK**, `default gen_random_uuid()`                                                                     | Identificador del mensaje. |
| `user_id`          | uuid        | FK → `public.profiles(id)` **ON DELETE SET NULL**                                                        | Usuario (historial se conserva si perfil se borra). |
| `mentor_slug`      | text        | **NOT NULL**                                                                                            | Contexto de mentoría. |
| `timing`           | text        | **NOT NULL**, `check in ('morning','night')`                                                            | Momento del día. |
| `n_dias`           | int         | **NOT NULL**, `check (n_dias >= 0)`                                                                     | Días de progreso. |
| `level`            | int         | **NOT NULL**, `check (level >= 0)`                                                                      | Nivel. |
| `content`          | text        | **NOT NULL**                                                                                            | Mensaje final. |
| `prompt_used`      | jsonb       | **NOT NULL**                                                                                            | Prompt final usado. |
| `source_model`     | text        |                                                                                                          | Modelo (ej: `gpt-5`). |
| `generation_date`  | timestamptz | **NOT NULL**, `default now()`                                                                            | Fecha/hora de generación. |
| `sent_status`      | text        | **NOT NULL**, `default 'pending'`, `check in ('pending','sent','failed')`                               | Estado operativo. |
| `channel_used`     | text        | `check in ('email','telegram','whatsapp','app')`                                                        | Canal enviado. |
| `created_at`       | timestamptz | `default now()`                                                                                          | Creación. |
| `updated_at`       | timestamptz | `default now()`                                                                                          | Última actualización. |

### Índices
- **Único diario:** `messages_unique_daily` en (`user_id`, `mentor_slug`, `date(generation_date at time zone 'UTC')`, `timing`).
- `messages_user_id_idx` en (`user_id`)
- `messages_generation_date_idx` en (`generation_date desc`)
- `messages_status_idx` en (`sent_status`)

### Triggers / Funciones
- Reutiliza `public.set_updated_at()` con trigger `trg_messages_updated_at` (`BEFORE UPDATE`).

### RLS y Políticas
- RLS: habilitado y forzado.
- Políticas:
  - `messages_select_own` (SELECT) — `USING (user_id = auth.uid())`
  - `messages_insert_self` (INSERT) — `WITH CHECK (user_id = auth.uid())`
  - `messages_update_own` (UPDATE) — `USING (user_id = auth.uid())`

**Notas RLS:** Un usuario solo accede a sus propios mensajes (si `user_id` queda `NULL` por borrado del perfil, quedan fuera de alcance del usuario).

---

## Tabla: `sent_log`
**Propósito:** Bitácora de envíos (cada intento = 1 fila), independiente del origen (mentorías, sistema, notificaciones, etc.). Separa **contenido** (`messages`) del **acto de envío**.

### Columnas
| Columna              | Tipo        | Restricciones / Default                                                                                         | Descripción |
|----------------------|-------------|------------------------------------------------------------------------------------------------------------------|-------------|
| `id`                 | uuid        | **PK**, `default gen_random_uuid()`                                                                             | Identificador de envío. |
| `message_id`         | uuid        | FK → `public.messages(id)` **ON DELETE SET NULL**                                                                | Mensaje IA (opcional). |
| `user_id`            | uuid        | **NOT NULL**, FK → `public.profiles(id)`                                                                         | Usuario destino. |
| `message_type`       | text        | **NOT NULL**, `check in ('mentor_ai','system','notification','payment','reminder')`                              | Tipo de envío. |
| `mentor_slug`        | text        |                                                                                                                  | Mentoría (opcional). |
| `channel`            | text        | **NOT NULL**, `check in ('email','telegram','whatsapp','app')`                                                   | Canal usado. |
| `status`             | text        | **NOT NULL**, `default 'pending'`, `check in ('pending','retrying','sent','failed')`                             | Estado del intento. |
| `retry_count`        | int         | **NOT NULL**, `default 0`, `check (retry_count >= 0)`                                                            | Reintentos. |
| `sent_at`            | timestamptz | **NOT NULL**                                                                                                     | Fecha/hora del intento. |
| `delivered_at`       | timestamptz |                                                                                                                  | Entregado. |
| `read_at`            | timestamptz |                                                                                                                  | Leído. |
| `provider`           | text        |                                                                                                                  | Proveedor (ej: `telegram`, `smtp`). |
| `provider_message_id`| text        |                                                                                                                  | ID del proveedor. |
| `idempotency_key`    | text        | `unique`                                                                                                         | Idempotencia por intento/canal. |
| `error_message`      | text        |                                                                                                                  | Mensaje de error legible. |
| `response_log`       | jsonb       | `not null default '{}'::jsonb`                                                                                   | Respuesta técnica (truncar si es grande). |
| `channel_payload`    | jsonb       |                                                                                                                  | Request/headers mínimos (opcional). |
| `content_summary`    | text        |                                                                                                                  | Resumen corto del contenido. |
| `created_at`         | timestamptz | `default now()`                                                                                                  | Creación. |
| `updated_at`         | timestamptz | `default now()`                                                                                                  | Última actualización. |

### Índices
- `sent_log_user_id_sent_at_idx` en (`user_id`, `sent_at desc`)
- `sent_log_message_id_idx` en (`message_id`)
- `sent_log_status_idx` en (`status`)
- `sent_log_provider_msg_idx` en (`provider`, `provider_message_id`)

### Triggers / Funciones
- Reutiliza `public.set_updated_at()` con trigger `trg_sent_log_updated_at` (`BEFORE UPDATE`).

### RLS y Políticas
- RLS: habilitado y forzado.
- Políticas:
  - `sent_log_select_own` (SELECT) — `USING (user_id = auth.uid())`
  - `sent_log_insert_self` (INSERT) — `WITH CHECK (user_id = auth.uid())`
  - `sent_log_update_own` (UPDATE) — `USING (user_id = auth.uid())`

**Notas RLS:** El usuario solo ve y crea/actualiza envíos **propios**.

---

## Funciones y Triggers compartidos

### `public.set_updated_at()`
```sql
create or replace function public.set_updated_at()
returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


### Columna añadida: `profiles.token`

| Atributo | Valor |
|-----------|--------|
| **Nombre** | `token` |
| **Tipo** | `uuid` |
| **Restricciones** | `NOT NULL`, `DEFAULT gen_random_uuid()`, `UNIQUE` |
| **Descripción** | Identificador genérico y permanente del usuario para integraciones externas (p. ej. enlace con Telegram). No se deriva de datos personales. |
| **Reglas de uso** |  |
| • | Se genera automáticamente al crear el perfil. |
| • | Solo el propio usuario puede leerlo (RLS existente `id = auth.uid()`). |
| • | No se rota ni edita (por ahora). Puede usarse como clave de vínculo para otros servicios futuros. |
| • | No debe enviarse por correo ni mostrarse en logs públicos. |
| **Ejemplo** | `6f2a1b4e-9d7c-4b7f-8a62-3c8a9e0d2f45` |
