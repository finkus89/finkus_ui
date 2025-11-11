// Página principal del login de Finkus
"use client";
//Importa Framer Motion*
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";


// Frases que rotan (puedes agregar o cambiar libremente)
const frases = [
    "Cada inicio es una oportunidad de enfoque.",
    "Hoy no necesitas hacerlo perfecto, solo avanzar.",
    "La claridad llega cuando te mueves.",
    "Un pequeño paso cambia tu dirección.",
    "Tu constancia pesa más que la motivación.",
  ];

export default function LoginPage() {

  // Estado para controlar la frase actual
  const [indice, setIndice] = useState(0);

  // Rotación automática cada 5 segundos (5000)
  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndice((prev) => (prev + 1) % frases.length);
    }, 5000);
    return () => clearInterval(intervalo);
  }, [frases.length]);


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
        <Image
          src="/assets/logo_finkus.png"  // <- desde /public
          alt="Logo Finkus"
          width={96}                            // ajusta tamaño
          height={96}
          className="opacity-90"
          priority                               // carga prioritaria
        />
      </div>

        {/* TÍTULO PRINCIPAL */}
        <h1 className="text-center text-4xl font-ligth 300 text-white leading-relaxed">FinKus</h1>

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

        {/* BLOQUE RESERVADO PARA EL FORMULARIO (inputs y botón irán aquí) */}
        <div className="mt-6 h-24 rounded-xl border border-white/15 bg-white/5" />

        {/* ENLACE SECUNDARIO (crear cuenta) */}
        <div className="mt-4 text-center text-sm text-white/70">
          ¿Nuevo en Finkus?{" "}
          <a 
            href="/register" 
            className="underline underline-offset-4">Crear cuenta
          </a>
        </div>
      </div>
    </div>
  );
}
