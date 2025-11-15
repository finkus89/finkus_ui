import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sulphur_Point } from "next/font/google";   //importa Tipo de fuente pra la webapp


// Configura la familia y pesos que vas a usar en toda la app
const sulphur = Sulphur_Point({
  subsets: ["latin"],
  weight: ["300", "400", "700"], // las tres variantes disponibles
});




export const metadata: Metadata = {
  title: "Finkus | Guía diaria con IA",
  icons: {
    icon: "/assets/logo_finkus.png",   // 👈 tu favicon
  },
};

/**     se escgoge el tipo de letra global para la webapp   */
/* 
        Aplica:
        - finkus-bg  -> tu fondo (gradiente + patrón)
        - sulphur.className -> tipografía global
        - text-white/antialiased -> legibilidad sobre el fondo
      */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`finkus-bg ${sulphur.className}`}>
        {children}
      </body>
    </html>
  );
}