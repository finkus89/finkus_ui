    # Registro de Usuarios – Finkus Webapp

Este documento describe el funcionamiento completo del flujo de **registro de usuarios** en la webapp de Finkus. Incluye validaciones, uso de Supabase Auth, reglas RLS, creación de perfiles y lista de tareas futuras relacionadas con este módulo.

---

## 1. Descripción general del flujo

El registro del usuario se compone de dos operaciones consecutivas:

### 1.1 Creación del usuario en Supabase Auth

- Se usa `supabase.auth.signUp({ email, password })`.
- Como la opción **Confirm email está desactivada**, Supabase:
  - crea el usuario en `auth.users`,
  - genera una **sesión activa** inmediatamente,
  - devuelve `user.id` (UUID).

### 1.2 Creación del perfil en la tabla `profiles`

La tabla `profiles` está diseñada para que cada fila corresponda directamente a un usuario de Auth:

- El campo `id` es **PK**, **FK a auth.users(id)** y **NO tiene default**, por lo que debe enviarse.
- El sistema inserta una fila en `profiles` con:
  - `id` (igual al de `auth.users`),
  - `email`,
  - `name`,
  - `terms_accepted_at`,
  - el resto de campos queda `NULL` hasta que el onboarding los complete.

### 1.3 Seguridad (RLS activado)

La tabla `profiles` tiene Row Level Security activado.  
La política actual permite solo insertarse a sí mismo:

```sql
CREATE POLICY "profiles_insert_self"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);
```
Esto asegura que un usuario autenticado solo pueda crear su propio perfil.

## 2. Validaciones del frontend

Antes de enviar, el formulario valida:

Nombre obligatorio.

Email obligatorio.

Contraseña mínima de 8 caracteres.

Confirmación de contraseña debe coincidir.

Aceptación de términos obligatoria.

El botón se desactiva mientras se procesa el envío.

## 3. Manejo de errores

El flujo detecta y muestra mensajes claros para cada situación:

### 3.1 Errores de Auth

Si Supabase informa que el correo ya está registrado:

"Ya existe una cuenta con este correo. Intenta iniciar sesión."

### 3.2 Errores en la creación del perfil

Si la inserción en profiles falla por unicidad de email (unique_violation):

"Ya existe una cuenta con este correo. Intenta iniciar sesión."

### 3.3 Errores generales

Si ocurre cualquier otro error inesperado:

"La cuenta se creó, pero hubo un problema guardando tu perfil. Intenta iniciar sesión."

## 4. Resultado esperado de un registro exitoso

Cuando todo funciona correctamente:

Se crea el usuario en auth.users.

Se crea el perfil en profiles con el mismo id.

Se mantiene una sesión activa.

El sistema redirige automáticamente al usuario hacia /onboarding.

## 5. Pruebas que este módulo ya pasa
✔ Casos positivos

Registro con correo nuevo.

Inserción correcta en Auth y Profiles.

Redirección automática a onboarding.

✔ Validaciones de UI

Nombre vacío.

Email vacío.

Contraseña menor a 8 caracteres.

Contraseñas diferentes.

Términos no aceptados.

Botón bloqueado mientras se envía.

✔ Errores backend manejados correctamente

Correo ya registrado en Auth.

Correo duplicado en Profiles.

Mensajes consistentes hacia el usuario.

## 6. Borrado de usuarios: consideraciones

Si se borra un usuario desde auth.users, su fila en profiles se elimina automáticamente gracias al ON DELETE CASCADE.

Si se borra solamente la fila en profiles, la cuenta sigue existiendo en Auth (no recomendado).

## 7. Funcionalidades pendientes o futuras

Estas tareas no son necesarias para el MVP, pero se implementarán en versiones posteriores:

### 7.1 Confirmación real de correo

Para habilitar verificación de email nuevamente:

Activar “Confirm email”.

Crear perfiles mediante:

un trigger SQL (AFTER INSERT ON auth.users), o

un backend usando service_role.

### 7.2 Recuperación de contraseña

Implementar el flujo:

/forgot-password

/reset-password

### 7.3 Edición del perfil

Agregar capacidad de modificar:

nombre,

email,

país,

zona horaria,

número de teléfono,

canal preferido.

### 7.4 Reenvío del correo de verificación

Cuando habilitemos verificación real.

7.5 Eliminación total de cuenta desde la UI

Que borre al usuario desde auth.users para mantener los datos limpios.

## 8. Estado actual

El módulo de registro está completo y funcional:

UI ✔

Validaciones ✔

Auth ✔

Profiles ✔

RLS ✔

Sesión ✔

Redirección ✔

Manejo de errores ✔
