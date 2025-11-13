"use client";
import { useState } from "react";

export default function DashboardWireframes() {
  const [layout, setLayout] = useState<"A" | "B">("B");

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-white/10" />
          <div className="text-xl font-semibold">Finkus • Dashboard</div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setLayout("A")} className={`px-3 py-2 rounded-lg border ${layout === "A" ? "bg-white/10" : "border-white/10"}`}>Layout A</button>
          <button onClick={() => setLayout("B")} className={`px-3 py-2 rounded-lg border ${layout === "B" ? "bg-white/10" : "border-white/10"}`}>Layout B</button>
          <div className="h-9 w-9 rounded-full bg-white/10" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-5">
        {/* Sidebar (colapsable en real) */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-2 space-y-2">
          {[
            "Mentoría",
            "Mensajes",
            "Plantillas / Extras",
            "Configuración",
          ].map((t) => (
            <div key={t} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm hover:bg-white/10 transition">
              {t}
            </div>
          ))}
        </aside>

        {/* Main area */}
        <main className="col-span-12 md:col-span-9 lg:col-span-10">
          {layout === "A" ? <LayoutA /> : <LayoutB />}
        </main>
      </div>
    </div>
  );
}

function Card({ title, children, className = "" }: { title: string; children?: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/20 ${className}`}>
      <div className="mb-3 text-sm uppercase tracking-wide text-white/70">{title}</div>
      {children || <div className="h-24 rounded-xl bg-white/5" />}
    </div>
  );
}

function LayoutA() {
  return (
    <div className="grid grid-cols-12 gap-5">
      {/* Mentoría grande */}
      <Card title="Mentoría" className="col-span-12 lg:col-span-8">
        <MentoriaContent />
      </Card>
      {/* Racha + Próximo */}
      <Card title="Racha / Progreso" className="col-span-12 lg:col-span-4">
        <div className="h-24 rounded-xl bg-white/5 mb-3" />
        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-cyan-400/80" />
        </div>
      </Card>
      <Card title="Próximo mensaje" className="col-span-12 lg:col-span-4">
        <div className="space-y-2 text-white/80 text-sm">
          <p>🌅 Mañana • 6:30 AM</p>
          <p className="line-clamp-2">Vista previa breve del contenido del próximo mensaje para mantener enfoque sin revelar todo.</p>
        </div>
      </Card>
      <Card title="Mensajes recientes" className="col-span-12 lg:col-span-8">
        <MensajesPreview />
      </Card>
    </div>
  );
}

function LayoutB() {
  return (
    <div className="grid grid-cols-12 gap-5">
      {/* Mentoría grande */}
      <Card title="Mentoría" className="col-span-12">
        <MentoriaContent />
      </Card>

      {/* Fila completa de mensajes */}
      <Card title="Mensajes recientes" className="col-span-12">
        <MensajesPreview />
      </Card>

      {/* Extras opcionales */}
      <Card title="Plantillas / Extras" className="col-span-12 lg:col-span-7">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {["Nivel 1","Nivel 2","Nivel 3","Nivel 4","Nivel 5","Desbloqueos"].map((n) => (
            <div key={n} className="rounded-xl border border-white/10 bg-white/5 p-4 h-24 flex items-center justify-center text-white/70 text-sm">
              {n}
            </div>
          ))}
        </div>
      </Card>
      <Card title="Racha / Progreso" className="col-span-12 lg:col-span-5">
        <div className="h-28 rounded-xl bg-white/5 mb-4" />
        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-cyan-400/80" />
        </div>
      </Card>
    </div>
  );
}

function MentoriaContent() {
  return (
    <div className="grid grid-cols-12 gap-4 text-sm">
      <div className="col-span-12 lg:col-span-8 space-y-3">
        <div className="rounded-xl bg-white/5 p-4">
          <div className="text-white/70">Mentor</div>
          <div className="text-lg font-medium">Productividad</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            ["Objetivo","Planear la semana"],
            ["Desafío","Procrastinación"],
            ["var1","Ámbito: trabajo"],
            ["var2","Área: ejecución"],
          ].map(([k,v]) => (
            <div key={k} className="rounded-xl bg-white/5 p-4">
              <div className="text-white/70">{k}</div>
              <div className="font-medium">{v}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            ["Mañana","6:30 AM"],
            ["Noche","9:30 PM"],
            ["Canal","Telegram"],
          ].map(([k,v]) => (
            <div key={k} className="rounded-xl bg-white/5 p-4 text-center">
              <div className="text-white/70">{k}</div>
              <div className="font-medium">{v}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="col-span-12 lg:col-span-4 space-y-3">
        <div className="rounded-xl bg-white/5 p-4">
          <div className="text-white/70 mb-1">Progreso</div>
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-cyan-400/80" />
          </div>
          <div className="mt-2 text-white/70 text-xs">Día 12 de 60</div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {["Cambiar mentor","Editar datos","Reiniciar"].map((b) => (
            <button key={b} className="rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition px-3 py-2 text-sm">
              {b}
            </button>
          ))}
        </div>
        <div className="rounded-xl bg-white/5 p-4 text-white/80 text-sm">
          <p className="line-clamp-3">Breve guía de orientación: recuerda que los mensajes se adaptan a tu objetivo y desafío. Ajusta tus horarios cuando sea necesario.</p>
        </div>
      </div>
    </div>
  );
}

function MensajesPreview() {
  const items = [
    { tipo: "🌅 Mañana", fecha: "11 nov 2025", txt: "Activa 10 minutos de enfoque: escribe 3 tareas no negociables." },
    { tipo: "🌙 Noche", fecha: "10 nov 2025", txt: "Registra 1 avance y 1 obstáculo. Cierra con una micro‑decisión para mañana." },
    { tipo: "🌅 Mañana", fecha: "10 nov 2025", txt: "Reduce fricción: deja preparado el escritorio y el café." },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {items.map((m, i) => (
        <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between text-xs text-white/70 mb-2">
            <span>{m.tipo}</span>
            <span>{m.fecha}</span>
          </div>
          <div className="text-sm text-white/90 line-clamp-3">{m.txt}</div>
          <div className="mt-3 flex items-center justify-between text-xs text-white/60">
            <span className="rounded-full bg-white/5 px-2 py-1">ver completo</span>
            <span className="rounded-full bg-white/5 px-2 py-1">guardar</span>
          </div>
        </div>
      ))}
    </div>
  );
}
