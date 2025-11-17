# 📊 Finkus – Dashboard (Estado Actual del Desarrollo)

Este documento resume todas las funcionalidades ya implementadas en el Dashboard de Finkus, además del estado actual de la arquitectura de datos y lógica, y lo que queda pendiente.

## ✅ 1. Datos cargados desde Supabase (completamente funcional)
### 1.1 Perfil del usuario (profiles)

Se cargan y muestran:
name (formateado: solo nombre, primera letra capitalizada)
preferred_channel
Estado del usuario visible en el badge (separado del estado de la mentoría)

### 1.2 Mentoría actual (user_mentors)
Se obtiene la última mentoría activa/trial del usuario con:

status (trial / active / paused / canceled)
start_date
trial_end
objective_text
challenge_text
var1
var2
morning_time
night_time
El dashboard muestra estos datos ya traducidos con los catálogos estáticos.

## ✅ 2. Traducción completa con catálogos estáticos
### 2.1 mentors-config.ts

Implementado un traductor que:

Convierte:

mentor
objective
challenge
var1 (ámbito)
var2 (tono)
Devuelve nombres legibles para el usuario.
Permite usar configuraciones específicas por mentor.

Se agregó además:
✔️ Sistema de niveles por mentor

Cada mentor define:
levels: [
  { level, startDay, endDay },
  ...
]

Productividad incluye niveles oficiales: 1–7, 8–15, 16–25, 26–40, 41–60.
Sabiduría queda lista para completar.

## ✅ 3. Traducción de horarios (time-slots.ts)

Se traduce:

Horas guardadas como HH:MM:SS
A formato visible h:mm am/pm
Con catálogo estático para horas válidas.
Listo para ampliarse en un futuro (5:30, 6:30, etc.)

## ✅ 4. Cálculo real del nivel actual

Implementado cálculo independiente del mentor:
✔️ dayNumber (día N desde el inicio)
dayNumber = floor(hoy - start_date) + 1
✔️ Nivel actual según rango del mentor
Devuelve:
nivelActual
totalNiveles
✔️ Progreso dentro del nivel (% correcto)
Fórmula corregida:
progreso = ((dayNumber - startDay) / (endDay - startDay)) * 100

Día inicial del nivel = 0%
Día final del nivel = 100%

## 5. Estado de mentoría en UI

Se muestra en el badge:

trial
active
paused
canceled
trial vencido (calculado localmente)

Con colores (verde, amarillo, rojo, gris).

## ✅ 6. Logout completamente funcional

Implementado botón en sidebar.

Llama a:
await supabase.auth.signOut();
router.push("/login");

Funciona en desktop y móvil.

## 🧱 7. Estructura UI ya implementada
Sidebar:

Logo + eslogan
Nombre del usuario
Estado (activo)
Navegación (Dashboard, Plantillas, Pagos, Configuración)
Cerrar sesión

Dos columnas:

Columna izquierda: Mentoría actual
Columna derecha: Mensajes recientes (mock)

Vista responsive con drawer en móvil.

## ⚠️ PENDIENTES SIGUIENTES (MVP)

Cargar mensajes reales desde Supabase (tabla messages)
Middleware de protección
Si no hay sesión → redirect a login
Si no tiene mentoría → redirect onboarding
Si ya tiene mentoría → redirect dashboard
Componente de formulario reutilizable Para onboarding y edición de mentoría Disminuye duplicación de código
Pantalla “Editar mentoría”
Form dinámico para cambiar objetivo, desafío, tono, ámbito y horarios
Reiniciar mentoría
Update de start_date a now()
Mostrar “Día N” en UI
(detalle visual del progreso real)
Rutas reales para el Sidebar
Plantillas / Extras
Suscripción / Pagos
Configuración

# 🟣 Estado General

El Dashboard está en estado MVP funcional, con:
Autenticación integrada
Carga de datos reales
Traducciones completas
Niveles y progreso reales
Logout funcionando
UI lista para conectar funciones
Lo siguiente será conectar las piezas finales: middleware, formularios, edición y mensajes reales.