// lib/finkus/time-slots.ts
// Catálogo centralizado de horarios para mañana y noche.
// Formato interno: "HH:MM" (24 horas) → lo que se guarda en Supabase.
// Formato visible: "h:mm am/pm" → lo que ve el usuario.

export const MORNING_TIME_OPTIONS = [
  { id: "06:00:00", label: "6:00 am" },
  { id: "07:00:00", label: "7:00 am" },
  { id: "08:00:00", label: "8:00 am" },
  { id: "09:00:00", label: "9:00 am" },
] as const;

export const NIGHT_TIME_OPTIONS = [
  { id: "17:00:00", label: "5:00 pm" },
  { id: "18:00:00", label: "6:00 pm" },
  { id: "19:00:00", label: "7:00 pm" },
  { id: "20:00:00", label: "8:00 pm" },
  { id: "21:00:00", label: "9:00 pm" },
] as const;