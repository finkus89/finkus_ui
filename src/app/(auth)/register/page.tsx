//PAgian de registro

"use client"; // 👈 Indica que este componente se ejecuta en el cliente (usa hooks).

import { useState } from "react"; // 👈 Para manejar el estado del formulario.
import Image from "next/image";
import Link from "next/link";
// ⬇️ Nuevo: router para redirección después del registro
import { useRouter } from "next/navigation";
// ⬇️ Nuevo: cliente de Supabase para el navegador
import { createClient } from "@/lib/supabase/browser";


// 🔹 Página de registro (mitad izquierda branding / mitad derecha formulario)
export default function RegisterPage() {
    // Password
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    // ⬇️ Nuevo: estado para nombre completo
    const [fullName, setFullName] = useState("");

    // ⬇️ Nuevo: estado para correo
    const [email, setEmail] = useState("");

    // ⬇️ Nuevo: estado para mostrar errores al usuario
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // ⬇️ Nuevo: estado de envío (loading) para desactivar botón mientras se procesa
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ⬇️ Nuevo: instancia del router para navegar a onboarding luego del registro
    const router = useRouter();

    // ⬇️ Nuevo: cliente de Supabase para usar en este componente cliente
    const supabase = createClient();
    
    return (

    // Layout general: dos columnas (mobile = 1, desktop = 2)
    <main className="grid grid-cols-1 md:grid-cols-2 md:h-screen">
      
      {/* ========================== */}
      {/* BLOQUE IZQUIERDO (BRANDING) */}
      {/* ========================== */}
      <section className="relative hidden md:flex finkus-bg text-white md:sticky md:top-0 md:h-screen items-center">
             {/* Barra superior: logo + enlace "Iniciar sesión" */}
         <div className="absolute inset-x-0 top-0 flex items-center justify-between p-6">
             
          <Link href="https://finkus.app/" target="_blank">  
          <Image
            src={"/assets/logo_finkus.png"}
            alt="Logo Finkus"
            width={120}
            height={32}
            className="object-contain"
            />
          </Link>
          <a 
            href="/login" 
            className="text-sm hover:underline opacity-80 hover:opacity-100"
          >
            Iniciar sesión
          </a>
        </div>

        {/* Contenido central (texto de presentación) */}
        <div className="m-auto max-w-md p-10">
          <h2 className="text-2xl font-semibold mb-3">
            Finkus Guias con IA
          </h2>
          <p className="text-slate-300">
            Mensajes diarios.
          </p>
        </div>
      </section>


      {/* ========================== */}
      {/* BLOQUE DERECHO (FORMULARIO) */}
      {/* ========================== */}
      {/*<section className="bg-slate-50 flex items-center justify-center p-6">*/}
      <section className="bg-slate-50 flex justify-center p-6 md:h-screen md:overflow-y-auto">
        <div className="w-full max-w-md mt-4 md:mt-12 lg:mt-16">
          {/* Encabezado */}
          <h1 className="text-2xl font-semibold text-slate-900 ">
            Crear cuenta
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            Registrate y empieza gratis trial de 7 dias.
          </p>

          {/* ⬇️ Nuevo: bloque para mostrar errores generales de registro */}
          {errorMessage && (
            <p className="mb-3 text-sm text-red-600">
              {errorMessage}
            </p>
          )}

          {/* ========================== */}
          {/* BLOQUE EMPRESA */} 
          {/* Tarjeta del formulario */}
          <form
            onSubmit={async (e) => {
                e.preventDefault();
                // 🔜 Aquí luego irá la lógica de registro con Supabase

                // ⬇️ Nuevo: limpiar errores previos
                setErrorMessage(null);

                // ⬇️ Nuevo: validación básica de campos requeridos
                if (!fullName.trim()) {
                  setErrorMessage("Por favor ingresa tu nombre completo.");
                  return;
                }

                if (!email.trim()) {
                  setErrorMessage("Por favor ingresa tu correo electrónico.");
                  return;
                }

                // ⬇️ Nuevo: validación de contraseña mínima
                if (password.length < 8) {
                  setErrorMessage("La contraseña debe tener al menos 8 caracteres.");
                  return;
                }

                // ⬇️ Nuevo: validación de coincidencia de contraseñas
                if (password !== password2) {
                  setErrorMessage("Las contraseñas no coinciden.");
                  return;
                }

                try {
                  // ⬇️ Nuevo: activar estado de envío
                  setIsSubmitting(true);

                  // ⬇️ Nuevo: registro en Supabase Auth
                  const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                  });

                  if (error) {
                    // ⬇️ Nuevo: manejar errores de Supabase (correo duplicado, etc.)
                    const rawMsg = (error.message || "").toLowerCase();
                    if (rawMsg.includes("already registered") || rawMsg.includes("already exists")) {
                      setErrorMessage("Ya existe una cuenta con este correo. Intenta iniciar sesión.");
                    } else {
                      setErrorMessage(error.message || "No se pudo crear la cuenta. Inténtalo de nuevo.");
                    }
                    setIsSubmitting(false);
                    return;
                  }

                  // ⬇️ Nuevo: asegurar que tenemos el usuario de vuelta
                  const user = data.user;
                  if (!user) {
                    setErrorMessage("No se pudo obtener el usuario después del registro.");
                    setIsSubmitting(false);
                    return;
                  }

                  // ⬇️ Nuevo: crear fila en la tabla profiles con datos básicos
                  const { error: profileError } = await supabase
                    .from("profiles")
                    .insert({
                      id: user.id,
                      email: email,                    // correo ingresado
                      name: fullName,             // nombre completo
                      terms_accepted_at: new Date().toISOString(), // fecha/hora de aceptación de términos
                    });

                  if (profileError) {

                    setErrorMessage("La cuenta se creó, pero hubo un problema guardando tu perfil. Intenta iniciar sesión.");
                    setIsSubmitting(false);
                    return;
                  }

                  // ⬇️ Nuevo: redirigir a onboarding si todo salió bien
                  router.push("/onboarding");
                } catch (err) {
                  // ⬇️ Nuevo: manejo genérico de errores inesperados
                  setErrorMessage("Ocurrió un error inesperado. Inténtalo nuevamente.");
                  setIsSubmitting(false);
                }
            }}
            className="bg-white border border-slate-200 shadow-lg rounded-2xl p-6 space-y-4"
            >
            {/* Nombre completo */}
            <div>
                <label className="block text-sm font-medium text-slate-700">
                Nombre completo *
                </label>
                <input
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring focus:ring-slate-200"
                placeholder="Ej. Carlos Pérez"
                // ⬇️ Nuevo: vincular con estado fullName
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                />
            </div>

            {/* Correo */}
            <div>
                <label className="block text-sm font-medium text-slate-700">Correo</label>
                <input
                type="email"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring focus:ring-slate-200"
                placeholder="ej. admin@finkus.app"
                // ⬇️ Nuevo: vincular con estado email
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            {/* Contraseña */}
            <div>
                <label className="block text-sm font-medium text-slate-700">
                Contraseña *
                </label>
                <input
                type="password"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring focus:ring-slate-200"
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            {/* Confirmación */}
            <div>
                <label className="block text-sm font-medium text-slate-700">
                Confirmar contraseña *
                </label>
                <input
                type="password"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring focus:ring-slate-200"
                placeholder="Repite la contraseña"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                />
                {password && password2 && password !== password2 && (
                <p className="mt-1 text-xs text-red-600">
                    Las contraseñas no coinciden.
                </p>
                )}
            </div>

            {/* Checkbox de términos */}
            <label className="flex items-start space-x-3 text-sm text-slate-700 mt-6">
                <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-800 focus:ring-slate-400"
                required
                />
                <span>
                Acepto los{" "}
                <a href="/terminos" target="_blank" className="underline text-slate-800">
                    Términos y Condiciones
                </a>{" "}
                y la{" "}
                <a href="/privacidad" target="_blank" className="underline text-slate-800">
                    Política de Privacidad
                </a>.
                </span>
            </label>

            {/* Botón principal */}
            <button
                type="submit"
                className="finkus-btn"
                // ⬇️ Nuevo: desactivar botón mientras se envía el formulario
                disabled={isSubmitting}
            >
                {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
            </button>
            </form>


            {/* Enlace inferior (para usuarios existentes) */}
            <p className="text-sm text-slate-600 mt-4 pb-10 text-center">
                ¿Ya tienes cuenta?{" "}
                <a href="/login" className="underline">Inicia sesión</a>
            </p>

        </div>

      </section>

    </main>
  );
}
