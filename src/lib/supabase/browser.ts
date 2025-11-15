// src/lib/supabase/browser.ts
// ------------------------------------------------------
// Cliente Supabase para COMPONENTES CLIENTE (UI)
// Se usa en formularios: register, login, onboarding, etc.
// ------------------------------------------------------

    import { createBrowserClient } from "@supabase/ssr"; 
// createBrowserClient: cliente para uso en el navegador (browser)

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  );
}

// ------------------------------------------------------
// Cómo usarlo:
// const supabase = createBrowserSupabaseClient();
// const { data, error } = await supabase.auth.signUp({ email, password });
// ------------------------------------------------------
