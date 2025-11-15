// src/app/dashboard/page.tsx

export default function DashboardPage() {
  // ===== Datos mock (luego vendrán de Supabase) =====
  const mentorData = {
    mentor: "Productividad",
    objetivo: "Planear la semana",
    desafio: "Procrastinación",
    ambito: "Trabajo",
    tono: "Calmado pero firme",
    canal: "Telegram",
    horaManana: "6:30 AM",
    horaNoche: "9:30 PM",
    nivelActual: 2,
    totalNiveles: 5,
    progresoNivel: 45,
  };

  const mensajesRecientes = [
    {
      id: 1,
      tipo: "mañana",
      fecha: "11 nov 2025",
      texto:
        "Activa 10 minutos de enfoque: escribe 3 tareas no negociables.",
    },
    {
      id: 2,
      tipo: "noche",
      fecha: "10 nov 2025",
      texto:
        "Registra 1 avance y 1 obstáculo. Cierra con una micro-decisión para mañana.",
    },
    {
      id: 3,
      tipo: "mañana",
      fecha: "10 nov 2025",
      texto:
        "Reduce fricción: deja preparado el escritorio y el café antes de dormir.",
    },
  ];

  return (
    // Fondo general gris, sin contenedor central
    <div className="min-h-screen w-full bg-slate-100">
      {/* Grid de 3 columnas a pantalla completa */}
      <div className="grid min-h-screen gap-0 lg:grid-cols-[260px_minmax(0,2.2fr)_minmax(0,1.8fr)]">
        {/* ================= COLUMNA 1: MENU ================= */}
        <aside className="border-b border-slate-200 bg-slate-50 px-5 py-4 lg:border-b-0 lg:border-r">
          {/* Header logo + marca */}
          <div className="mb-4 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-sky-400 px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-lg font-semibold">
                F
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium leading-tight">
                  FinKus
                </span>
                <span className="text-xs opacity-80">
                  IA para enfoque diario
                </span>
              </div>
            </div>
          </div>

          {/* Usuario + estado */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-900">
                Carlos
              </span>
              <span className="text-xs text-emerald-600">Activo</span>
            </div>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700">
              ● Activo
            </span>
          </div>

          {/* Menú simple (solo UI) */}
          <nav className="space-y-1 text-[14px]">
            <button className="flex w-full items-center gap-2 rounded-xl bg-slate-200 px-3 py-2.5 text-left font-medium text-slate-900">
              <span className="text-lg">📊</span>
              <span>Dashboard</span>
            </button>
            <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-slate-600 hover:bg-slate-200/60">
              <span className="text-lg">🧩</span>
              <span>Plantillas / Extras</span>
            </button>
            <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-slate-600 hover:bg-slate-200/60">
              <span className="text-lg">💳</span>
              <span>Suscripción / Pagos</span>
            </button>
            <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-slate-600 hover:bg-slate-200/60">
              <span className="text-lg">⚙️</span>
              <span>Configuración</span>
            </button>
          </nav>
        </aside>

        {/* ============ COLUMNA 2: MENTORÍA ============ */}
        <section className="border-b border-slate-200 bg-slate-50 px-6 py-6 text-[15px] text-slate-700 lg:border-b-0 lg:border-r">
          {/* Título */}
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-sky-400 text-sm text-white">
              🎯
            </div>
            <h1 className="text-lg font-semibold text-slate-900">Mentoría</h1>
          </div>

          {/* Contenido mentoría */}
          <div className="space-y-5">
            {/* Mentor */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Mentor
              </p>
              <p className="mt-1 text-xl font-semibold text-slate-900">
                {mentorData.mentor}
              </p>
            </div>

            {/* Objetivo / Desafío */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Objetivo
                </p>
                <p className="mt-1">{mentorData.objetivo}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Desafío
                </p>
                <p className="mt-1">{mentorData.desafio}</p>
              </div>
            </div>

            {/* Ámbito / Tono / Canal / Horarios */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Ámbito
                </p>
                <p className="mt-1">{mentorData.ambito}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Tono
                </p>
                <p className="mt-1">{mentorData.tono}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Canal
                </p>
                <p className="mt-1">{mentorData.canal}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Mañana
                  </p>
                  <p className="mt-1">{mentorData.horaManana}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Noche
                  </p>
                  <p className="mt-1">{mentorData.horaNoche}</p>
                </div>
              </div>
            </div>

            {/* Progreso nivel */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>
                  Nivel {mentorData.nivelActual} de {mentorData.totalNiveles}
                </span>
                <span>Progreso del nivel</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-sky-400"
                  style={{ width: `${mentorData.progresoNivel}%` }}
                />
              </div>
            </div>

            {/* Botones */}
            <div className="mt-2 flex flex-col gap-3 md:flex-row">
              <button className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-200/70">
                Editar
              </button>
              <button className="inline-flex flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-sky-400 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-95">
                Reiniciar mentoría
              </button>
            </div>
          </div>
        </section>

        {/* ============ COLUMNA 3: MENSAJES ============ */}
        <section className="bg-slate-50 px-6 py-6 text-[15px] text-slate-700">
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm text-white">
              💬
            </div>
            <h2 className="text-lg font-semibold text-slate-900">
              Mensajes recientes
            </h2>
          </div>

          <div className="space-y-3">
            {mensajesRecientes.map((msg) => {
              const esManana = msg.tipo === "mañana";
              const icono = esManana ? "🌅" : "🌙";
              const etiqueta = esManana ? "Mañana" : "Noche";

              return (
                <article
                  key={msg.id}
                  className="rounded-2xl bg-white/80 px-4 py-3 text-slate-800 shadow-[0_4px_10px_rgba(15,23,42,0.04)]"
                >
                  <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-50 text-base">
                        {icono}
                      </span>
                      <span className="font-medium text-slate-700">
                        {etiqueta}
                      </span>
                    </div>
                    <span className="text-slate-400">{msg.fecha}</span>
                  </div>
                  <p className="leading-snug">{msg.texto}</p>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
