# 🟣 Finkus – Onboarding (README)

Este documento resume la función, estructura y validaciones del flujo de Onboarding en la webapp de Finkus.
El objetivo es que el usuario configure su mentoría inicial después de registrarse.

## 📌 1. Estructura general del Onboarding

El componente está dividido en dos bloques principales:

### 🔹 Bloque izquierdo (branding + guía visual)

Fondo con estilo “finkus-bg”.

Muestra el mentor seleccionado, su nombre y descripción corta.

Contiene un panel dinámico con texto que cambia según:

El paso actual (1 o 2).

La sección activa dentro del Step 1.

Sirve como guía e introducción visual durante la configuración.

### 🔹 Bloque derecho (formulario principal)

Contiene el formulario funcional, dividido en Step 1 y Step 2.

Incluye:

Encabezados según paso.

Validaciones.

Mensajes de error dentro de la tarjeta (no alertas del navegador).

Inputs, selects y checkbox.

## 📌 2. Step 1 – Configuración de mentoría

Aquí el usuario define la esencia de su experiencia Finkus.

### Campos del Step 1

Mentor

Objetivo

Desafío

Var1 (Ámbito)

Var2 (Tono)

### Características clave

Las preguntas mostradas (labels) cambian dinámicamente según el mentor, gracias al campo questions en mentors-config.

Los challenges y ambits se filtran dependiendo del objetivo.

Si cambia el mentor, se resetean automáticamente las selecciones dependientes.

Antes de continuar al Step 2, se validan todos los campos.

### Validación Step 1

Todos los campos son obligatorios.

En caso de error → mensaje rojo dentro de la tarjeta.

## 📌 3. Step 2 – Contacto, canal y horarios

En este paso el usuario define cómo y cuándo recibirá los mensajes.

### Campos del Step 2

Número de celular

Prefijo viene de COUNTRIES_CONFIG (MVP: solo Colombia).

Input solo para el número nacional.

Canal de envío

Telegram, WhatsApp o Email.

Horario de mañana

Horario de noche

Marketing opt-in (opcional)

### Validaciones Step 2

Número limpio (solo dígitos).

Entre 7 y 10 dígitos (válido para Colombia).

Todos los otros campos requeridos deben estar completos.

En caso de fallo → mensaje rojo dentro del formulario.

### Procesamiento Step 2

Después de validar:

#### 1. Obtener usuario actual

Uso de supabase.auth.getUser().

#### 2. Crear datos normalizados

phone_country_code → desde país.
phone_national → número limpio.
phone_e164 → combinación prefijo + número.
timezone → desde país.

#### 3. Actualizar tabla profiles

Campos afectados:

country
timezone
phone_country_code
phone_national
phone_e164
preferred_channel
marketing_opt_in

#### 4. Crear mentoría en user_mentors

Se guarda:

mentor_slug
status (trial)
start_date (día siguiente)
trial_end (start_date + 6 días = 7 días de trial)
morning_time
night_time
objective_text
challenge_text
var1
var2

#### 5. Redirección

Si todo es correcto → /dashboard.

## 📌 4. Formatos y convenciones
Fechas
Guardadas como YYYY-MM-DD (ISO string slice).

Tiempos
Guardados en formato 24h, ej:
"06:00"
"21:00"

Teléfono
Guardado en tres columnas:

phone_country_code
phone_national
phone_e164

## 📌 5. Manejo de errores

Step 1 y Step 2 usan errorMessage para mostrar errores dentro del formulario.
Si la sesión expira → se avisa y se envía al login.
Si falla profiles o user_mentors:
Se muestra mensaje claro.
No se rompe el flujo.
No se recarga la página.

## 📌 6. Pendientes futuros

Estas tareas no son del MVP, pero el sistema ya está preparado para ellas:

🔹 Agregar selector de país real (banderas + prefijo).
🔹 Validaciones más profundas (regex internacional, longitudes por país).
🔹 Conversión del formulario a componente reutilizable para edición desde dashboard.
🔹 Manejo de mentorías anteriores (historial de usuario).
🔹 Mejoras del texto dinámico según mentor (panelTexts + questions).
🔹 Soporte multilenguaje interno/externo.
🔹 Optimizar restricciones UNIQUE de mentor activo.