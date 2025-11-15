# 📄 Login – Documentación Técnica (Finkus WebApp)
# 📌 Objetivo del módulo

El módulo de Login permite que un usuario existente acceda a su cuenta usando email + password, inicia una sesión válida en Supabase Auth y redirige al usuario según su estado:

Si no ha hecho onboarding → /onboarding
Si ya tiene mentor activo → /dashboard
Se utiliza el cliente Supabase del navegador con createClient().

# 🚀 Flujo de la lógica de Login

## 1 Validación inicial en frontend

Email vacío → error: "Ingresa tu correo electrónico."

Password vacía → error: "Ingresa tu contraseña."

## 2 Protección contra doble envío

Se usa un estado isSubmitting.

El botón incluye disabled={isSubmitting}.

La función handleSubmit tiene un candado:

if (isSubmitting) return;


## 3 Autenticación con Supabase

Se usa:

supabase.auth.signInWithPassword({ email, password })


Si falla (correo inexistente o contraseña incorrecta):

Se muestra un error genérico:
"Correo o contraseña incorrectos."

No se revela si el correo existe (buena práctica de seguridad).

## 4 Determinación de redirección

Después de un login exitoso:

supabase
  .from("user_mentors")
  .select("id")
  .eq("user_id", user.id)
  .limit(1)


Si user_mentors está vacío → /onboarding

Si existe al menos un registro → /dashboard

Manejo de errores inesperados

Cualquier error se captura con catch(...)

Mensaje genérico: "Ocurrió un problema al iniciar sesión. Intenta de nuevo."

# 🧩 Integraciones y dependencias
✔️ Supabase (browser)
import { createClient } from "@/lib/supabase/browser";

✔️ Navegación
import { useRouter } from "next/navigation";

✔️ Estados del formulario
useState for:
- email
- password
- errorMessage
- isSubmitting

# 🔐 Reglas de redirección
Condición	Redirección
Login fallido	Mostrar error
Login exitoso + sin mentor	/onboarding
Login exitoso + mentor existente	/dashboard
Error leyendo user_mentors	/onboarding (fallback seguro)

# 🧪 Pruebas recomendadas
✔️ 1. Login correcto

Email válido + contraseña válida
→ Redirige a onboarding/dashboard según BD.

✔️ 2. Contraseña incorrecta

→ Debe mostrar: "Correo o contraseña incorrectos."

✔️ 3. Correo inexistente

→ Misma respuesta (no revelar información).

✔️ 4. Campos vacíos

→ Muestra errores antes del submit.

✔️ 5. Doble clic

→ Solo se envía una vez el formulario.

✔️ 6. Falla en lectura user_mentors

→ Redirige a /onboarding.

✔️ 7. Persistencia de sesión

→ Después del login, la sesión se mantiene activa.

# 📦 Archivos involucrados

src/app/(auth)/login/page.tsx

src/lib/supabase/browser.ts

# 🟢 Estado del módulo

Login completado y funcional.


# PENDIENTES
## Obligatorio más adelante

Protección de rutas (middleware)
Logout
Forgot Password real

## Ideal pero no urgente
Redirección automática si ya hay sesión
Loader visual
Validaciones fuertes
Sesión persistente sin flasheos

## Opcional futuro
Verificación de correo
MFA (muy lejos, no ahora)