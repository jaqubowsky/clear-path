import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { validateEnv } from "./env";

let singletonClient: SupabaseClient | null = null;

type InitOptions = { url?: string; anonKey?: string };

export function initSupabaseBrowser(options?: InitOptions): SupabaseClient {
  if (typeof window === "undefined") {
    throw new Error(
      "initSupabaseBrowser() must be called in a browser environment",
    );
  }
  if (singletonClient) return singletonClient;

  const env = validateEnv({
    NEXT_PUBLIC_SUPABASE_URL:
      options?.url ?? process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      options?.anonKey ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  singletonClient = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    },
  );
  return singletonClient;
}

export function supabaseBrowser(): SupabaseClient {
  if (!singletonClient) {
    // Attempt lazy initialization from process.env for convenience
    initSupabaseBrowser();
  }
  if (!singletonClient) {
    throw new Error(
      "Supabase browser client is not initialized. Call initSupabaseBrowser() on the client first.",
    );
  }
  return singletonClient;
}
