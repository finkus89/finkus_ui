// Página principal del login de Finkus
"use client";
//Importa Framer Motion*
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// 🔹 Import para navegación después del login
import { useRouter } from "next/navigation";

// 🔹 Cliente de Supabase en el navegador
import { createClient } from "@/lib/supabase/browser";

// Frases que rotan (puedes agregar o cambiar libremente)
const frases = [
  "Cada inicio es una oportunidad de enfoque.",
  "Hoy no necesitas hacerlo perfecto, solo avanzar.",
  "La claridad llega cuando te mueves.",
  "Un pequeño paso cambia tu dirección.",
  "Tu constancia pesa más que la motivación.",
];

export default function LoginPage() {
  const router = useRouter();

  // Estado para controlar la frase actual
  const [indice, setIndice] = useState(0);

  // 🔹 Estado del formulario de login (controlado)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔹 Estado para errores y envío
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Rotación automática cada 5 segundos (5000)
  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndice((prev) => (prev + 1) % frases.length);
    }, 5000);
    return () => clearInterval(intervalo);
  }, [frases.length]);

  // 🔹 Lógica principal de login:
  // 1) Validar campos
  // 2) Hacer signInWithPassword en Supabase
  // 3) Consultar user_mentors para decidir a dónde redirigir
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones rápidas en frontend
    if (!email.trim()) {
      setErrorMessage("Ingresa tu correo electrónico.");
      return;
    }
    if (!password) {
      setErrorMessage("Ingresa tu contraseña.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const supabase = createClient();

    try {
      // 🔹 1. Login en Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data?.user) {
        // Mensaje genérico por seguridad (no distinguimos si falló correo o password)
        setErrorMessage("Correo o contraseña incorrectos.");
        setIsSubmitting(false);
        return;
      }

      const user = data.user;

      // 🔹 2. Revisar si el usuario ya tiene mentor en user_mentors
      const { data: mentors, error: mentorsError } = await supabase
        .from("user_mentors")
        .select("id")
        .eq("user_id", user.id)
        .limit(1);

      // Si hay error al leer user_mentors, por seguridad lo mandamos a onboarding
      if (mentorsError) {
        console.error("Error leyendo user_mentors:", mentorsError);
        router.push("/onboarding");
        return;
      }

      // 🔹 3. Decisión de redirección:
      //    - Sin mentor → /onboarding
      //    - Con mentor → /dashboard
      if (!mentors || mentors.length === 0) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Error inesperado en login:", err);
      setErrorMessage("Ocurrió un problema al iniciar sesión. Intenta de nuevo.");
      setIsSubmitting(false);
      return;
    } finally {
      // Nota: después de router.push no es crítico, pero lo dejamos por si el flujo cambia.
      setIsSubmitting(false);
    }
  };

  return (
    // Contenedor general: ocupa toda la pantalla, centra el contenido
    <div className="min-h-screen w-full flex items-center justify-center px-4">
      {/* ─────────────────────────────── */}
      {/* TARJETA FLOTANTE (Glassmorphism) */}
      {/* ─────────────────────────────── */}
      <div
        className="
          w-full max-w-md                 /* ancho máximo  (responsive) */
          rounded-2xl                     /* bordes redondeados grandes */
          border border-white/20          /* borde blanco semitransparente */
          bg-white/10                     /* fondo blanco con opacidad (vidrio) */
          backdrop-blur-xl                /* desenfoque del fondo detrás */
          shadow-2xl shadow-black/20      /* sombra suave para flotación */
          p-8                             /* padding interno */
        "
      >
        {/* LOGO REAL (optimizado con next/image) */}
        <div className="mx-auto mb-6 flex justify-center">
          <Link href="https://finkus.app/" target="_blank">
            <Image
              src="/assets/logo_finkus.png" // <- desde /public
              alt="Logo Finkus"
              width={96} // ajusta tamaño
              height={96}
              className="opacity-90"
              priority // carga prioritaria
            />
          </Link>
        </div>

        {/* TÍTULO PRINCIPAL */}
        <h1 className="text-center text-5xl font-ligth 300 text-white leading-relaxed">
          FinKus
        </h1>

        {/* MENSAJE DEL MENTOR CON ANIMACION */}
        <div className="relative mt-3 h-12 text-center text-lg font-light text-white/80 leading-snug">
          <AnimatePresence mode="wait">
            <motion.p
              key={indice}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6 }}
              className="absolute w-full"
            >
              {frases[indice]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* FORMULARIO */}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40"
              // 🔹 Campo controlado: email
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40"
              // 🔹 Campo controlado: password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* BOTÓN PRINCIPAL */}
          <button
            type="submit"
            className="finkus-btn"
            // 🔹 Evitar dobles envíos mientras se procesa
            disabled={isSubmitting}
          >
            Iniciar sesión
          </button>
        </form>

        {/* MENSAJE DE ERROR (si algo falla en login) */}
        {errorMessage && (
          <p className="mt-3 text-center text-sm text-red-300">
            {errorMessage}
          </p>
        )}

        {/* ENLACE SECUNDARIO (crear cuenta) */}
        <div className="mt-4 text-center text-sm text-white/70">
          ¿Nuevo en Finkus?{" "}
          <a href="/register" className="underline underline-offset-4">
            Crear cuenta
          </a>
        </div>

        {/* ENLACE terciario (olvidaste contraseña) */}
        <div className="mt-2 text-center text-xs text-white/60">
          <a href="/forgot-password" className="hover:underline">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>
    </div>
  );
}
