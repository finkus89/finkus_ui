"use client";
// src/app/dashboard/page.tsx
// Dashboard básico de Finkus (estilo similar a Vasbel, adaptado a 2 columnas)
// - Sidebar con íconos + header superior
// - Columna izquierda: mentoría
// - Columna derecha: mensajes recientes
// - Responsive: en móvil el sidebar se oculta y aparece como drawer

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
// 🔹 Cliente de Supabase en el navegador
import { createClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";

// Íconos lucide-react
import {LayoutDashboard, Sparkles, MessageCircle, Wand2, CreditCard, Settings, LogOut, Menu, X,
} from "lucide-react";

import {
  MENTORS_CONFIG,
  type MentorId,
} from "@/lib/finkus/mentors-config"; 
import { MORNING_TIME_OPTIONS, NIGHT_TIME_OPTIONS } from "@/lib/finkus/time-slots";

const mensajesRecientes = [
  {
    id: 1, tipo: "mañana", fecha: "11 nov 2025",  texto: "Activa 10 minutos de enfoque: escribe 3 tareas no negociables.",
  },
  {
    id: 2, tipo: "noche", fecha: "10 nov 2025", texto: "Registra 1 avance y 1 obstáculo. Cierra con una micro-decisión para mañana.",
  },
  {
    id: 3, tipo: "mañana", fecha: "10 nov 2025", texto: "Reduce fricción: deja preparado el escritorio y el café antes de dormir.",
  },
];

export default function DashboardPage() {
  // Nombre del usuario (viene de Supabase -> tabla profiles)
  const [userName, setUserName] = useState<string | null>(null);
  
  // Estado UI de la mentoría (lo vamos a llenar con datos de user_mentors)
  const [mentorStatusUi, setMentorStatusUi] = useState<{
    label: string;
    message: string;
    badgeClass: string;
  } | null>(null);

  // Datos que se muestran en la tarjeta de mentoría en el dashboard.
  type MentorUIData = {
    mentor: string;
    objetivo: string;
    desafio: string;
    ambito: string;
    tono: string;
    canal: string;
    horaManana: string;
    horaNoche: string;
    nivelActual: number;
    totalNiveles: number;
    progresoNivel: number;
  };

  const [mentorData, setMentorData] = useState<MentorUIData>({
    mentor: "—",
    objetivo: "—",
    desafio: "—",
    ambito: "—",
    tono: "—",
    canal: "—",
    horaManana: "—",
    horaNoche: "—",
    nivelActual: 0,
    totalNiveles: 5,
    progresoNivel: 0,
  });
  
  // Formatea el nombre: toma solo el primero y capitaliza la primera letra
  function formatName(name: string | null): string {
    if (!name) return "Usuario";

    const firstName = name.split(" ")[0]; // solo el primer nombre
    return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  }

   // Convierte el preferred_channel de BD a un texto legible para la UI
  function formatChannel(channel: string | null | undefined): string {
    if (!channel) return "App";

    switch (channel) {
      case "email":
        return "Email";
      case "telegram":
        return "Telegram";
      case "whatsapp":
        return "WhatsApp";
      case "app":
      default:
        return "App";
    }
  }

  ///funciones para mapear los horarios
  function getMorningLabel(time: string | null): string {
    if (!time) return "—";
    return MORNING_TIME_OPTIONS.find((t) => t.id === time)?.label || time;
  }

  function getNightLabel(time: string | null): string {
    if (!time) return "—";
    return NIGHT_TIME_OPTIONS.find((t) => t.id === time)?.label || time;
  }

  useEffect(() => {
    const supabase = createClient();

    const loadData = async () => {
      // 1) Obtener usuario autenticado (auth.users)
      const {data: { user }, error: userError, } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("No se pudo obtener el usuario actual", userError);
        return;
      }

      // 2) Cargar perfil en 'profiles' (name y preferred_channel)
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("name, preferred_channel")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Error cargando el perfil:", profileError);
      }

      if (profile?.name) {
        setUserName(formatName(profile.name));
      } 
      //canal crudo
      const preferredChannelRaw = (profile?.preferred_channel as string | null) ?? "app";


      // 3) Cargar mentoría actual desde 'user_mentors'
      const { data: mentor, error: mentorError } = await supabase
        .from("user_mentors")
        .select(
          `
          status,
          trial_end,
          created_at,
          start_date,
          mentor_slug,
          objective_text,
          challenge_text,
          var1,
          var2,
          morning_time,
          night_time
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (mentorError) {
        console.error("Error cargando la mentoría actual:", mentorError);
        // Si hay error, dejamos un estado neutro
        setMentorStatusUi({
          label: "Sin mentoría activa",
          message: "Configura tu primera mentoría para empezar a recibir mensajes.",
          badgeClass: "border-slate-200 bg-slate-50 text-slate-600",
        });
        return;
      }

      if (!mentor) {
        // Usuario sin mentoría aún
        setMentorStatusUi({
          label: "Sin mentoría activa",
          message: "Configura tu primera mentoría para empezar a recibir mensajes.",
          badgeClass: "border-slate-200 bg-slate-50 text-slate-600",
        });
        return;
      }

      // 4) Traducir estado de BD -> UI
      const rawStatus = (mentor as any).status as string | null;
      const rawTrialEnd = (mentor as any).trial_end as string | null;

      const today = new Date();
      const trialEndDate = rawTrialEnd ? new Date(rawTrialEnd) : null;

      // Por ahora, lógica simple:
      // - Si status = 'trial' y aún no se vence -> En prueba (verde)
      // - Si status = 'trial' y ya se venció -> Prueba vencida (testing) (amarillo)
      // - Otros estados: active/paused/ended (por si acaso, aunque en MVP uses solo trial)
      if (rawStatus === "trial") {
        const trialVencido =
          trialEndDate !== null && today.getTime() > trialEndDate.getTime();

        if (trialVencido) {
          setMentorStatusUi({
            label: "Prueba vencida (testing)",
            message:
              "Tu periodo de prueba terminó, pero seguimos en modo testing sin pagos activos.",
            badgeClass: "border-amber-200 bg-amber-50 text-amber-700",
          });
        } else {
          setMentorStatusUi({
            label: "En prueba",
            message: "Tu mentoría está en periodo de prueba.",
            badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
          });
        }
      } else if (rawStatus === "active") {
        setMentorStatusUi({
          label: "Activa",
          message: "Tu mentoría está activa y lista para enviarte mensajes.",
          badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
        });
      } else if (rawStatus === "paused") {
        setMentorStatusUi({
          label: "Pausada",
          message: "Has pausado tu mentoría. Puedes reactivarla cuando quieras.",
          badgeClass: "border-amber-200 bg-amber-50 text-amber-700",
        });
      } else if (rawStatus === "canceled") {
        setMentorStatusUi({
          label: "Cancelada",
          message: "Esta mentoría fue cancelada. Puedes crear una nueva cuando quieras.",
          badgeClass: "border-rose-200 bg-rose-50 text-rose-700",
        });
      } else {
        // Estado desconocido / nulo
        setMentorStatusUi({
          label: "Estado desconocido",
          message: "No pudimos determinar el estado actual de tu mentoría.",
          badgeClass: "border-slate-200 bg-slate-50 text-slate-600",
        });
      }

      // 5) Construir datos reales para la tarjeta de mentoría
      const m = mentor;
      // Mentor
      const mentorId = m.mentor_slug as MentorId;
      const mentorConfig = MENTORS_CONFIG[mentorId];
      // Objetivo
      const objectiveName =
        mentorConfig.objectives.find((o) => o.id === m.objective_text)?.name ||
        m.objective_text;
      // Desafío
      const challengeName =
        mentorConfig.challenges.find((c) => c.id === m.challenge_text)?.name ||
        m.challenge_text;
      // var1
      const ambitName =
        mentorConfig.ambits.find((a) => a.id === m.var1)?.name || m.var1;

      // var2
      const toneName =
        mentorConfig.tones.find((t) => t.id === m.var2)?.name || m.var2;

      // ------------ Cálculo de n_días a partir de start_date ------------
      let n_days = 1; // por defecto
      if (m.start_date) {
        const start = new Date(m.start_date as string);
        const today = new Date();
        // Diferencia en días (ignorando horas)
        const diffMs = today.getTime() - start.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        n_days = diffDays + 1; // día 1 = día de inicio
        if (n_days < 1) {
          n_days = 1;
        }
      }
      // ------------ Buscar nivel actual según n_days ------------
      const levels = mentorConfig.levels;
      const totalLevels = levels.length;
      let nivelActual = 1;
      let progresoNivel = 0;

      if (levels.length > 0) {
        // Por defecto usamos el primer nivel
        let current = levels[0];

        // Buscar el nivel cuyo rango contenga el dayNumber
        for (const lvl of levels) {
          if (n_days >= lvl.startDay && n_days <= lvl.endDay) {
            current = lvl;
            break;
          }
          // Si el día ya está por encima del último rango, usamos el último
          if (n_days > levels[levels.length - 1].endDay) {
            current = levels[levels.length - 1];
          }
        }

        nivelActual = current.level;
        const steps = current.endDay - current.startDay; // ej: 7 - 1 = 6

        if (steps <= 0) {
          // Nivel de un solo día: progreso completo
          progresoNivel = 100;
        } else {
          const rawProgress = ((n_days   - current.startDay) / steps) * 100;

          if (rawProgress < 0) {
            progresoNivel = 0;
          } else if (rawProgress > 100) {
            progresoNivel = 100;
          } else {
            progresoNivel = Math.round(rawProgress);
          }
        }

      }

      const uiData: MentorUIData = {
        mentor: mentorConfig.name,
        objetivo: objectiveName,
        desafio: challengeName,
        ambito: ambitName,
        tono: toneName,
        canal: formatChannel(preferredChannelRaw),
        horaManana: getMorningLabel(m.morning_time as string | null),
        horaNoche: getNightLabel(m.night_time as string | null),
        nivelActual,
        totalNiveles: totalLevels,
        progresoNivel,
      };

      setMentorData(uiData);;

    };
    loadData();
  }, []);

    // Controla si el sidebar móvil (drawer) está abierto o cerrado
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Cerrar sesión y redirigir a login
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // Opcional: mostrar un toast en el futuro
    }
  };
  return (
    // Fondo general gris
    <div className="min-h-screen flex bg-slate-100">
      {/* =============== SIDEBAR DESKTOP (FIJO) =============== */}
      {/* Solo se muestra en pantallas medianas en adelante */}
      <aside className="hidden md:flex w-64 flex-col finkus-sidebar text-slate-100">
        <SidebarContent
          userName={userName ?? "Usuario"}
          onCloseMobileSidebar={undefined}
          showCloseButton={false}
          onLogout={handleLogout}
        />
      </aside>

      {/* =============== SIDEBAR MÓVIL (DRAWER) =============== */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          {/* Fondo oscuro clickeable para cerrar */}
          <button
            type="button"
            className="flex-1 bg-black/40"
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-label="Cerrar menú lateral"
          />
          {/* Panel lateral */}
          <div className="relative w-72 max-w-full h-full finkus-sidebar text-slate-100 shadow-xl">
            <SidebarContent
              userName={userName ?? "Usuario"}
              showCloseButton
              onCloseMobileSidebar={() => setIsMobileSidebarOpen(false)}
              onLogout={handleLogout}
            />
          </div>
        </div>
      )}

      {/* =============== ZONA PRINCIPAL (HEADER + CONTENIDO) =============== */}
      <div className="flex-1 flex flex-col">
        {/* HEADER SUPERIOR */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-white border-b border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Botón hamburguesa: solo móvil */}
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-600 hover:bg-slate-100 md:hidden"
              onClick={() => setIsMobileSidebarOpen(true)}
              aria-label="Abrir menú lateral"
            >
              <Menu size={20} />
            </button>

            <div>
              <p className="text-xs uppercase tracking-wide text-fuchsia-500">
                Finkus
              </p>
              <h1 className="text-lg font-semibold text-slate-900">
                Hola, {userName ?? "Usuario"}
              </h1>
            </div>
          </div>

          {/* Avatar simple con inicial */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-slate-800">
                {userName ?? "Usuario"}

              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-fuchsia-500 to-sky-400 flex items-center justify-center text-xs font-semibold text-white">
              {(userName ?? "U").charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* CONTENIDO PRINCIPAL */}
        <main className="flex-1 bg-slate-100 px-4 sm:px-6 py-6">
          {/* Grid principal: 2 columnas (mentoría / mensajes) */}
          <div className="grid gap-6 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1.8fr)]">
            {/* ============ COLUMNA 1: MENTORÍA ============ */}
            <section className="finkus-card px-5 py-5 text-[15px] text-slate-700">
              {/* Título /  icono + estado mentoría  */}
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-sky-400 text-sm text-white">
                    <Sparkles size={18} />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Mentoría
                  </h2>
                </div>

                {/* Badge de estado de la mentoría */}
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${
                    mentorStatusUi?.badgeClass ??
                    "border-emerald-200 bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {mentorStatusUi?.label ?? "En prueba"}
                </span>
              </div>

              {/* Mensajito pequeño bajo el título */}
              <p className="mb-5 text-xs text-slate-500">
                {mentorStatusUi?.message ??
                  "Tu mentoría está en periodo de prueba."}
              </p>  

              {/* Contenido mentoría (lo que ya tenías, reorganizado) */}
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
                      Nivel {mentorData.nivelActual} de{" "}
                      {mentorData.totalNiveles}
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
                <div className="mt-2 flex flex-col gap-3 md:flex-row md:justify-center">
                  <button className="finkus-btn-secondary px-6 py-2.5">Editar mentoría</button>
                  <button className="finkus-btn-primary px-6 py-2.5">Reiniciar mentoría</button>
                </div>
              </div>
            </section>

            {/* ============ COLUMNA 2: MENSAJES ============ */}
            <section className="finkus-card px-5 py-5 text-[15px] text-slate-700">

              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-sky-400 text-sm text-white">
                  <MessageCircle size={18} />
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
                      className="rounded-2xl bg-white/90 px-4 py-3 text-slate-800 shadow-[0_4px_10px_rgba(15,23,42,0.04)]"
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
        </main>
      </div>
    </div>
  );
}

/**
 * Contenido del sidebar de Finkus.
 * Se reutiliza tanto en desktop como en móvil.
 */
interface SidebarContentProps {
  userName: string;
  showCloseButton?: boolean;
  onCloseMobileSidebar?: () => void;
  onLogout: () => void;
}

function SidebarContent({
  userName,
  showCloseButton = false,
  onCloseMobileSidebar,
  onLogout,
}: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Header logo + marca */}
      <div className="relative border-b border-slate-800 px-5 py-4"> 
           <div className="finkus-sidebar-header">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/14">
              <Image
                src="/assets/logo_finkus.png"
                alt="Logo Finkus"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-tight text-white">
                Finkus
              </span>
              <span className="text-xs text-white/70">
                IA para enfoque diario
              </span>
            </div>

        </div>

        {/* Botón de cierre solo en móvil (drawer) */}
        {showCloseButton && onCloseMobileSidebar && (
          <button
            type="button"
            className="absolute right-3 top-3 inline-flex items-center justify-center rounded-md p-1 text-slate-100 hover:bg-slate-700 md:hidden"
            onClick={onCloseMobileSidebar}
            aria-label="Cerrar menú lateral"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Usuario + estado */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-50">
            {userName}
          </span>
          
        </div>
        <span className="finkus-badge">
          <span>●</span>
          <span>Activo</span>
        </span>
      </div>

      {/* Menú principal */}
      <nav className="flex-1 space-y-1 px-3 pb-4 text-[14px]">
        <SidebarItem
          label="Dashboard"
          active
          icon={<LayoutDashboard size={18} />}
        />
      
        <SidebarItem
          label="Plantillas / Extras"
          icon={<Wand2 size={18} />}
        />
        <SidebarItem
          label="Suscripción / Pagos"
          icon={<CreditCard size={18} />}
        />
        <SidebarItem
          label="Configuración"
          icon={<Settings size={18} />}
        />
      </nav>

      {/* Botón Cerrar sesión */}
      <div className="border-t border-slate-800 p-4">
        <button
          type="button"
          className="finkus-logout w-full"
          onClick={onLogout} // 🔹 aquí
        >
          <LogOut size={16} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}

/**
 * Componente pequeño para los items del sidebar.
 * La idea es reutilizarlo y solo cambiar label / icono / estado.
 */
interface SidebarItemProps {
  label: string;
  active?: boolean;
  icon?: ReactNode; // ícono opcional
}

function SidebarItem({ label, active = false, icon }: SidebarItemProps) {
  return (
    <button
      type="button"
      className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-left transition
      ${
        active
          ? "finkus-sidebar-active"
          : "text-white/70 finkus-hover"
      }`}
    >
      {/* Ícono a la izquierda (si existe) */}
      {icon && <span className="flex-shrink-0">{icon}</span>}

      {/* Texto */}
      <span className="truncate">{label}</span>
    </button>
  );
}
