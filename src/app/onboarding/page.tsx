// src/app/onboarding/page.tsx

"use client";

import { useState } from "react";
import Image from "next/image";
import {
  MENTORS_CONFIG,
  type MentorId,
  type MentorConfig,
} from "@/lib/finkus/mentors-config";

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

// Opciones de horario de la mañana (step 2) → puedes agregar más
const MORNING_TIME_OPTIONS = [
  { id: "06:00", label: "6:00 am" },
  { id: "07:00", label: "7:00 am" },
  { id: "08:00", label: "8:00 am" },
];

// Opciones de horario de la noche (step 2) → puedes agregar más
const NIGHT_TIME_OPTIONS = [
  { id: "17:00", label: "5:00 pm" },
  { id: "19:00", label: "7:00 pm" },
  { id: "21:00", label: "9:00 pm" },
];

export default function OnboardingPage() {
  // ---------------------------
  // Estado global del onboarding
  // ---------------------------

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

  // Sección activa para el panel izquierdo (solo aplica en step 1)
  const [activeSection, setActiveSection] = useState<ActiveSection>("mentor");

  const currentMentor: MentorConfig = MENTORS_CONFIG[selectedMentorId];

  // Listas derivadas según mentor y objective
  const objectives = currentMentor.objectives;

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

  // ---------------------------
  // Handlers de envío de formulario
  // ---------------------------

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (step === 1) {
      // Validación simple del STEP 1 (puedes mejorarla después)
      if (
        !selectedMentorId ||
        !selectedObjectiveId ||
        !selectedChallengeId ||
        !selectedAmbitId ||
        !selectedToneId
      ) {
        alert("Por favor completa todos los campos del Paso 1.");
        return;
      }

      // Si todo está OK → pasar al STEP 2
      setStep(2);
      return;
    }

    if (step === 2) {
      // Validación simple del STEP 2
      if (!phoneNumber || !channelId || !morningTimeId || !nightTimeId) {
        alert("Por favor completa todos los campos del Paso 2.");
        return;
      }

      // 🔜 FUTURO:
      // Aquí es donde se debería:
      // 1) Enviar toda la configuración (step 1 + step 2) a Supabase.
      // 2) Redirigir al usuario al dashboard (ej. /dashboard).
      // Por ahora solo mostramos en consola.
      console.log("Onboarding completo:", {
        mentorId: selectedMentorId,
        objectiveId: selectedObjectiveId,
        challengeId: selectedChallengeId,
        ambitId: selectedAmbitId,
        toneId: selectedToneId,
        phoneNumber: `+57 ${phoneNumber}`,
        channelId,
        morningTimeId,
        nightTimeId,
      });

      alert("Onboarding completado (simulado). Aquí luego irás al dashboard.");
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
            {step === 1 ? "Paso 1 de 2 · Tu mentoría" : "Paso 2 de 2 · Canal y horarios"}
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            {step === 1
              ? "Elige el mentor y el contexto principal con el que quieres trabajar."
              : "Define cómo y cuándo quieres recibir tus mensajes diarios."}
          </p>

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
                    ¿Cuál de estos objetivos de quieres lograr? *
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
                    ¿Qué es lo que más te está impidiendo avanzar? *
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
                    ¿En qué ámbito quieres aplicar tu guía? *
                  </label>
                  <select
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring focus:ring-slate-200 bg-white text-sm"
                    value={selectedAmbitId}
                    onChange={(e) => {
                      setSelectedAmbitId(e.target.value);
                    }}
                    onFocus={() => setActiveSection("vars")}
                  >
                    <option value="">Selecciona el ambito</option>
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
                    ¿Que tono prefieres? *
                  </label>
                  <select
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring focus:ring-slate-200 bg-white text-sm"
                    value={selectedToneId}
                    onChange={(e) => {
                      setSelectedToneId(e.target.value);
                    }}
                    onFocus={() => setActiveSection("vars")}
                  >
                    <option value="">Selecciona el tono</option>
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
                    className="finkus-btn px-5 py-2.5 rounded-lg text-sm font-medium"
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
                      +57
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

                {/* Botones STEP 2 */}
                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    className="text-sm text-slate-500 hover:text-slate-700"
                    onClick={() => setStep(1)}
                  >
                    Volver al paso 1
                  </button>
                  <button
                    type="submit"
                    className="finkus-btn px-5 py-2.5 rounded-lg text-sm font-medium"
                  >
                    Finalizar
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
