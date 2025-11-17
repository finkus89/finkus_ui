// src/app/onboarding/page.tsx

"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

import {
  MENTORS_CONFIG,
  type MentorId,
  type MentorConfig,
} from "@/lib/finkus/mentors-config";

// 🔹 Países (por ahora solo Colombia, pero listo para crecer) lib/finkus/countries-config.ts
import {
  COUNTRIES_CONFIG,
  type CountryId,
} from "@/lib/finkus/countries-config";

// Horarios centralizados de la mañana y noche, es un script en /lib/finkus/time-slots.ts
import {
  MORNING_TIME_OPTIONS,
  NIGHT_TIME_OPTIONS,
} from "@/lib/finkus/time-slots";


// Paso activo del onboarding (1 = mentoría, 2 = canal/horarios)
type OnboardingStep = 1 | 2;

// Secciones del panel izquierdo (solo se usan en el step 1)
type ActiveSection = "mentor" | "objective" | "challenge" | "vars";

// Opciones de canal (step 2)
const CHANNEL_OPTIONS = [
  { id: "telegram", label: "Telegram" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "email", label: "Email" },
];


export default function OnboardingPage() {
  // ---------------------------
  // Estado global del onboarding
  // ---------------------------

  const router = useRouter(); // 🔹 Para redirigir al dashboard después del onboarding

  // 🔹 País seleccionado (MVP: fijo en Colombia, pero ya con config)
  const [countryId] = useState<CountryId>("CO");

  // Paso actual (1 = elegir mentoría, 2 = canal y horarios)
  const [step, setStep] = useState<OnboardingStep>(1);

  // Mentor seleccionado (por defecto productividad)
  const [selectedMentorId, setSelectedMentorId] =
    useState<MentorId>("productivity");

  // Valores del STEP 1
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<string>("");
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>("");
  const [selectedAmbitId, setSelectedAmbitId] = useState<string>("");
  const [selectedToneId, setSelectedToneId] = useState<string>("");

  // Valores del STEP 2
  const [phoneNumber, setPhoneNumber] = useState<string>(""); // solo el número, sin prefijo
  const [channelId, setChannelId] = useState<string>("");
  const [morningTimeId, setMorningTimeId] = useState<string>("");
  const [nightTimeId, setNightTimeId] = useState<string>("");
  const [marketingOptIn, setMarketingOptIn] = useState<boolean>(false);

  // 🔹 País actual según config (por ahora siempre CO)
  const currentCountry = COUNTRIES_CONFIG[countryId];

  // Sección activa para el panel izquierdo (solo aplica en step 1)
  const [activeSection, setActiveSection] = useState<ActiveSection>("mentor");

  const currentMentor: MentorConfig = MENTORS_CONFIG[selectedMentorId];
  // 🔹 Preguntas específicas del mentor actual (vienen de mentors-config)
  const questions = currentMentor.questions;

  // Listas derivadas según mentor y objective
  const objectives = currentMentor.objectives;

  // ⬇️ Nuevo: estado para mostrar errores al usuario
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ⬇️ Nuevo: estado de envío para evitar dobles envíos en Step 2
  const [isSubmitting, setIsSubmitting] = useState(false);

  const challenges = currentMentor.challenges.filter((ch) => {
    // Si no hay objective o no hay reglas, mostramos todo
    if (!selectedObjectiveId || !ch.objectiveUse) return true;
    return ch.objectiveUse.includes(selectedObjectiveId);
  });

  const ambits = currentMentor.ambits.filter((amb) => {
    if (!selectedObjectiveId || !amb.objectiveUse) return true;
    return amb.objectiveUse.includes(selectedObjectiveId);
  });

  const tones = currentMentor.tones;

  // Texto del panel izquierdo:
  // - Step 1: usa panelTexts del mentor
  // - Step 2: texto fijo sobre canal y horarios
  const panelText =
    step === 1
      ? currentMentor.panelTexts[activeSection]
      : "El canal define por dónde recibirás tus mensajes diarios. Los horarios marcan la franja aproximada en la que llegarán (mañana y noche), para que se integren a tu rutina.";

  // 🔹 Helper para formatear fechas a 'YYYY-MM-DD' (para columnas date en Supabase)
  function formatDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  // ---------------------------
  // Handlers de envío de formulario
  // ---------------------------

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 🔹 Limpiar errores previos al intentar enviar
    setErrorMessage(null);

    if (step === 1) {
      // Validación simple del STEP 1 (puedes mejorarla después)
      if (
        !selectedMentorId ||
        !selectedObjectiveId ||
        !selectedChallengeId ||
        !selectedAmbitId ||
        !selectedToneId
      ) {
        setErrorMessage("Por favor completa todos los campos del Paso 1.");
        return;
      }

      // Si todo está OK → pasar al STEP 2
      setStep(2);
      return;
    }

    if (step === 2) {
      // Validación simple del STEP 2 (campos requeridos)
      if (!phoneNumber || !channelId || !morningTimeId || !nightTimeId) {
        setErrorMessage("Por favor completa todos los campos del Paso 2.");
        return;
      }

      // 🔹 Validar teléfono (solo números, 7 a 10 dígitos para Colombia)
      const cleanedNumber = phoneNumber.replace(/\D/g, "");
      if (cleanedNumber.length < 7 || cleanedNumber.length > 10) {
        setErrorMessage(
          "El número de celular debe tener entre 7 y 10 dígitos (solo números)."
        );
        return;
      }

      // 🔹 Cliente de Supabase en el navegador
      const supabase = createClient();

      // 🔹 Activar estado de envío para bloquear botón Finalizar
      setIsSubmitting(true);

      // 1) Obtener usuario actual (debe estar logueado)
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("❌ Error obteniendo usuario en onboarding:", userError);
        setErrorMessage("Tu sesión ha expirado. Vuelve a iniciar sesión.");
        setIsSubmitting(false);
        router.push("/login");
        return;
      }

      // 2) Construir datos de teléfono y timezone a partir del país actual
      const phoneCountryCode = currentCountry.dialCode; // ej. "+57"
      const phoneNational = cleanedNumber; // ya validado solo números
      const phoneE164 = `${phoneCountryCode}${phoneNational}`; // ej. "+573001234567"
      const timezone = currentCountry.defaultTimezone; // ej. "America/Bogota"

      // 3) Actualizar perfil del usuario en profiles
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          country: countryId,
          timezone: timezone,
          phone_country_code: phoneCountryCode,
          phone_national: phoneNational,
          phone_e164: phoneE164,
          preferred_channel: channelId, // "telegram" | "whatsapp" | "email" | "app"
          marketing_opt_in: marketingOptIn,
        })
        .eq("id", user.id);

      if (profileError) {
        console.error("❌ Error actualizando profiles en onboarding:", profileError);
        setErrorMessage(
          "Hubo un problema guardando tu información de contacto. Intenta de nuevo."
        );
        setIsSubmitting(false);
        return;
      }

      // 4) Calcular start_date (mañana) y trial_end (7 días de trial: día 1–7)
      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(startDate.getDate() + 1); // día siguiente

      const trialEnd = new Date(startDate);
      trialEnd.setDate(trialEnd.getDate() + 6); // start_date + 6 días => total 7 días

      const start_date_str = formatDate(startDate); // "YYYY-MM-DD"
      const trial_end_str = formatDate(trialEnd); // "YYYY-MM-DD"

      // 5) Crear la mentoría en user_mentors
      const { error: mentorError } = await supabase.from("user_mentors").insert({
        user_id: user.id,
        mentor_slug: selectedMentorId, // ej. "productivity"
        status: "trial", // onboarding siempre arranca en trial
        start_date: start_date_str,
        trial_end: trial_end_str,
        morning_time: morningTimeId, // "06:00" etc.
        night_time: nightTimeId, // "21:00" etc.
        objective_text: selectedObjectiveId, // aquí guardamos el ID interno del objetivo
        challenge_text: selectedChallengeId, // ID interno del desafío
        var1: selectedAmbitId, // ámbito (ambitId)
        var2: selectedToneId, // tono (toneId)
        // metadata: {} // si quieres añadir algo más en el futuro
      });

      if (mentorError) {
        console.error("❌ Error creando user_mentors en onboarding:", mentorError);
        setErrorMessage(
          "Tu configuración no pudo guardarse por un problema interno. Intenta de nuevo más tarde."
        );
        setIsSubmitting(false);
        return;
      }

      // 6) Si todo fue bien, podemos loguear en consola y redirigir al dashboard
      console.log("✅ Onboarding completado:", {
        userId: user.id,
        mentorId: selectedMentorId,
        objectiveId: selectedObjectiveId,
        challengeId: selectedChallengeId,
        ambitId: selectedAmbitId,
        toneId: selectedToneId,
        countryId,
        phoneCountryCode,
        phoneNumberNational: phoneNational,
        phoneE164,
        timezone,
        channelId,
        morningTimeId,
        nightTimeId,
        marketingOptIn,
      });

      // Opcionalmente podríamos resetear isSubmitting, pero en la práctica
      // el push te saca de esta página:
      // setIsSubmitting(false);

      router.push("/dashboard");
    }
  };

  // ---------------------------
  // Render
  // ---------------------------

  return (
    <main className="grid grid-cols-1 md:grid-cols-2 md:h-screen">
      {/* ========================== */}
      {/* BLOQUE IZQUIERDO (BRANDING / PANEL) */}
      {/* ========================== */}
      <section className="relative hidden md:flex finkus-bg text-white md:sticky md:top-0 md:h-screen items-center">
        {/* Barra superior: solo logo */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-6">
          <Image
            src={"/assets/logo_finkus.png"}
            alt="Logo Finkus"
            width={120}
            height={32}
            className="object-contain"
          />
        </div>

        {/* Contenido central (mentor actual + texto) */}
        <div className="m-auto max-w-md p-10 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">
              Configura tu mentoría
            </h2>
          </div>

          {/* Mentor seleccionado */}
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-slate-200/80">
              Mentor seleccionado
            </p>
            <p className="text-lg font-semibold">{currentMentor.name}</p>
            <p className="text-sm text-slate-100/90">
              {currentMentor.shortDescription}
            </p>
          </div>

          {/* Panel dinámico según paso / sección */}
          <div className="mt-4 rounded-2xl bg-black/15 border border-white/20 p-4 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-wide text-slate-100/80 mb-1">
              {step === 1 ? "Paso actual" : "Canal y horarios"}
            </p>
            <p className="text-sm leading-relaxed text-slate-50">
              {panelText}
            </p>
          </div>
        </div>
      </section>

      {/* ========================== */}
      {/* BLOQUE DERECHO (FORMULARIO) */}
      {/* ========================== */}
      <section className="bg-slate-50 flex justify-center p-6 md:h-screen md:overflow-y-auto">
        <div className="w-full max-w-md mt-4 md:mt-12 lg:mt-16">
          {/* Encabezado */}
          <h1 className="text-2xl font-semibold text-slate-900 ">
            {step === 1
              ? "Paso 1 de 2 · Tu mentoría"
              : "Paso 2 de 2 · Canal y horarios"}
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            {step === 1
              ? "Elige el mentor y el contexto principal con el que quieres trabajar."
              : "Define cómo y cuándo quieres recibir tus mensajes diarios."}
          </p>

          {/* Mensaje de error global (Step 1 / Step 2) */}
          {errorMessage && (
            <p className="mb-3 text-sm text-red-600">
              {errorMessage}
            </p>
          )}

          {/* Tarjeta del formulario (un solo <form> para ambos pasos) */}
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-slate-200 shadow-lg rounded-2xl p-6 space-y-4"
          >
            {/* ================= STEP 1 ================= */}
            {step === 1 && (
              <>
                {/* Mentor */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    ¿Qué tipo de guía te gustaría tener? *
                  </label>
                  <select
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring focus:ring-slate-200 bg-white text-sm"
                    value={selectedMentorId}
                    onChange={(e) => {
                      const value = e.target.value as MentorId;
                      setSelectedMentorId(value);
                      // Reset de campos dependientes
                      setSelectedObjectiveId("");
                      setSelectedChallengeId("");
                      setSelectedAmbitId("");
                      setSelectedToneId("");
                      setActiveSection("mentor");
                    }}
                    onFocus={() => setActiveSection("mentor")}
                  >
                    {Object.values(MENTORS_CONFIG).map((mentor) => (
                      <option key={mentor.id} value={mentor.id}>
                        {mentor.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Objective */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    {questions.objectiveLabel}
                  </label>
                  <select
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring focus:ring-slate-200 bg-white text-sm"
                    value={selectedObjectiveId}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedObjectiveId(value);
                      setSelectedChallengeId("");
                      setSelectedAmbitId("");
                      setActiveSection("objective");
                    }}
                    onFocus={() => setActiveSection("objective")}
                  >
                    <option value="">Selecciona un objetivo</option>
                    {objectives.map((obj) => (
                      <option key={obj.id} value={obj.id}>
                        {obj.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Challenge */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    {questions.challengeLabel}
                  </label>
                  <select
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring focus:ring-slate-200 bg-white text-sm"
                    value={selectedChallengeId}
                    onChange={(e) => {
                      setSelectedChallengeId(e.target.value);
                    }}
                    onFocus={() => setActiveSection("challenge")}
                  >
                    <option value="">Selecciona un desafío</option>
                    {challenges.map((ch) => (
                      <option key={ch.id} value={ch.id}>
                        {ch.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ambit (var1) */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    {questions.ambitLabel}
                  </label>
                  <select
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring focus:ring-slate-200 bg-white text-sm"
                    value={selectedAmbitId}
                    onChange={(e) => {
                      setSelectedAmbitId(e.target.value);
                    }}
                    onFocus={() => setActiveSection("vars")}
                  >
                    <option value="">Selecciona una opción</option>
                    {ambits.map((amb) => (
                      <option key={amb.id} value={amb.id}>
                        {amb.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tone (var2) */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    {questions.toneLabel}
                  </label>
                  <select
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring focus:ring-slate-200 bg-white text-sm"
                    value={selectedToneId}
                    onChange={(e) => {
                      setSelectedToneId(e.target.value);
                    }}
                    onFocus={() => setActiveSection("vars")}
                  >
                    <option value="">Selecciona una opción</option>
                    {tones.map((tone) => (
                      <option key={tone.id} value={tone.id}>
                        {tone.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Botón continuar STEP 1 */}
                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="finkus-btn"
                  >
                    Continuar
                  </button>
                </div>
              </>
            )}

            {/* ================= STEP 2 ================= */}
            {step === 2 && (
              <>
                {/* Número de celular */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Número de celular *
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    {/* Prefijo fijo (MVP) */}
                    <span className="inline-flex items-center rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                      {currentCountry.dialCode}
                    </span>

                    {/* Input número */}
                    <input
                      type="tel"
                      className="flex-1 rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring focus:ring-slate-200 text-sm"
                      placeholder="Número de celular"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                  {/* FUTURO:
                      Reemplazar este bloque por un componente de teléfono
                      con selector de país (banderas, nombre y prefijo).
                      Cuando quieras hacerlo, pide algo así:
                      "Quiero reemplazar el input de celular por un componente
                       con selector de país (Tailwind + banderas + prefijos)". */}
                </div>

                {/* Canal de envío */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Canal de envío *
                  </label>
                  <select
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring focus:ring-slate-200 bg-white text-sm"
                    value={channelId}
                    onChange={(e) => setChannelId(e.target.value)}
                  >
                    <option value="">Selecciona el canal</option>
                    {CHANNEL_OPTIONS.map((ch) => (
                      <option key={ch.id} value={ch.id}>
                        {ch.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Horario mañana */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Horario de envío (mañana) *
                  </label>
                  <select
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring focus:ring-slate-200 bg-white text-sm"
                    value={morningTimeId}
                    onChange={(e) => setMorningTimeId(e.target.value)}
                  >
                    <option value="">Selecciona un horario</option>
                    {MORNING_TIME_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Horario noche */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Horario de envío (noche) *
                  </label>
                  <select
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring focus:ring-slate-200 bg-white text-sm"
                    value={nightTimeId}
                    onChange={(e) => setNightTimeId(e.target.value)}
                  >
                    <option value="">Selecciona un horario</option>
                    {NIGHT_TIME_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Marketing opt-in (opcional) */}
                <div className="pt-2">
                  <label className="flex items-start gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-800 focus:ring-slate-400"
                      checked={marketingOptIn}
                      onChange={(e) => setMarketingOptIn(e.target.checked)}
                    />
                    <span>
                      Me gustaría recibir novedades, ideas y contenido extra
                      sobre Finkus (opcional).
                    </span>
                  </label>
                </div>

                {/* Botones STEP 2 */}
                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    className="finkus-btn-secondary text-sm text-slate-500 hover:text-slate-700"
                    onClick={() => setStep(1)}
                  >
                    Volver al paso 1
                  </button>
                  <button
                    type="submit"
                    className="finkus-btn-primary"
                    disabled={isSubmitting} // 🔹 Evitar doble clic
                  >
                    {isSubmitting ? "Guardando..." : "Finalizar"}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}
