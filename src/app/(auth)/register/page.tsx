//PAgian de registro

"use client"; // 👈 Indica que este componente se ejecuta en el cliente (usa hooks).

import { useState} from "react"; // 👈 Para manejar el estado del formulario.
import Image from "next/image";
import Link from "next/link";


// 🔹 Página de registro (mitad izquierda branding / mitad derecha formulario)
export default function RegisterPage() {
     // Password
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    
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

          {/* ========================== */}
          {/* BLOQUE EMPRESA */} 
          {/* Tarjeta del formulario */}
          <form
            onSubmit={(e) => {
                e.preventDefault();
                // 🔜 Aquí luego irá la lógica de registro con Supabase
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
                />
            </div>

            {/* Correo */}
            <div>
                <label className="block text-sm font-medium text-slate-700">Correo</label>
                <input
                type="email"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring focus:ring-slate-200"
                placeholder="ej. admin@finkus.app"
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
            >
                Crear cuenta
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

