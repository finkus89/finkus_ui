"use client";

import { useState } from "react";
import Image from "next/image";
import {
  MENTORS_CONFIG,
  type MentorId,
  type MentorConfig,
} from "@/lib/finkus/mentors-config";

type ActiveSection = "mentor" | "objective" | "challenge" | "vars";

export default function OnboardingStep1Page() {
  const [selectedMentorId, setSelectedMentorId] =
    useState<MentorId>("productivity");

  const [selectedObjectiveId, setSelectedObjectiveId] = useState<string>("");
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>("");
  const [selectedAmbitId, setSelectedAmbitId] = useState<string>("");
  const [selectedToneId, setSelectedToneId] = useState<string>("");

  const [activeSection, setActiveSection] = useState<ActiveSection>("mentor");

  const currentMentor: MentorConfig = MENTORS_CONFIG[selectedMentorId];

  const objectives = currentMentor.objectives;

  const challenges = currentMentor.challenges.filter((ch) => {
    if (!selectedObjectiveId || !ch.objectiveUse) return true;
    return ch.objectiveUse.includes(selectedObjectiveId);
  });

  const ambits = currentMentor.ambits.filter((amb) => {
    if (!selectedObjectiveId || !amb.objectiveUse) return true;
    return amb.objectiveUse.includes(selectedObjectiveId);
  });

  const tones = currentMentor.tones;

  const panelText = currentMentor.panelTexts[activeSection];

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

        {/* Contenido central (mentor actual) */}
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

          {/* Panel dinámico según sección activa */}
          <div className="mt-4 rounded-2xl bg-black/15 border border-white/20 p-4 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-wide text-slate-100/80 mb-1">
              Paso actual
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
            Paso 1 de 2 · Tu mentoría
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            Elige el mentor y el contexto principal con el que quieres trabajar.
          </p>

          {/* Tarjeta del formulario */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // 🔜 Aquí luego iría la lógica para ir al paso 2
            }}
            className="bg-white border border-slate-200 shadow-lg rounded-2xl p-6 space-y-4"
          >
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

            {/* Objetivo */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                ¿Cuál de estos objetivos quieres lograr? *
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
                ¿Qué es lo que más te está impidiendo avanzar con ese objetivo? *
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

            {/* Botones abajo – solo UI por ahora */}
            <div className="pt-4 flex justify-end gap-3">
              
              <button
                type="submit"
                className="finkus-btn px-5 py-2.5 rounded-lg text-sm font-medium"
              >
                Continuar
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
