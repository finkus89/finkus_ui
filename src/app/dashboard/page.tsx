"use client";

// src/app/dashboard/page.tsx
// Dashboard básico de Finkus (estilo similar a Vasbel, adaptado a 2 columnas)
// - Sidebar con íconos + header superior
// - Columna izquierda: mentoría
// - Columna derecha: mensajes recientes
// - Responsive: en móvil el sidebar se oculta y aparece como drawer

import { useState, type ReactNode } from "react";
import Image from "next/image";



// Íconos lucide-react
import {
  LayoutDashboard,
  Sparkles,
  MessageCircle,
  Wand2,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

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
    texto: "Activa 10 minutos de enfoque: escribe 3 tareas no negociables.",
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

export default function DashboardPage() {
  // 💡 En el futuro, estos datos (nombre, estado, etc.) vendrán del usuario autenticado
  const userName = "Carlos";

  // Controla si el sidebar móvil (drawer) está abierto o cerrado
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    // Fondo general gris
    <div className="min-h-screen flex bg-slate-100">
      {/* =============== SIDEBAR DESKTOP (FIJO) =============== */}
      {/* Solo se muestra en pantallas medianas en adelante */}
      <aside className="hidden md:flex w-64 flex-col finkus-sidebar text-slate-100">
        <SidebarContent
          userName={userName}
          onCloseMobileSidebar={undefined}
          showCloseButton={false}
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
              userName={userName}
              showCloseButton
              onCloseMobileSidebar={() => setIsMobileSidebarOpen(false)}
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
                Hola, {userName}
              </h1>
            </div>
          </div>

          {/* Avatar simple con inicial */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-slate-800">
                {userName}
              
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-fuchsia-500 to-sky-400 flex items-center justify-center text-xs font-semibold text-white">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* CONTENIDO PRINCIPAL */}
        <main className="flex-1 bg-slate-100 px-4 sm:px-6 py-6">
          {/* Grid principal: 2 columnas (mentoría / mensajes) */}
          <div className="grid gap-6 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1.8fr)]">
            {/* ============ COLUMNA 1: MENTORÍA ============ */}
            <section className="finkus-card px-5 py-5 text-[15px] text-slate-700">
              {/* Título / icono */}
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-sky-400 text-sm text-white">
                  <Sparkles size={18} />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Mentoría
                </h2>
              </div>

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
}

function SidebarContent({
  userName,
  showCloseButton = false,
  onCloseMobileSidebar,
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
          label="Mentoría"
          icon={<Sparkles size={18} />}
        />
        <SidebarItem
          label="Mensajes"
          icon={<MessageCircle size={18} />}
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
          className="finkus-logout w-full">
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
