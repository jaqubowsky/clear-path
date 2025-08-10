import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { validateEnv } from "./env";

export type ServerAdapters = {
  getHeader?: (key: string) => string | undefined;
  getCookie?: (name: string) => string | undefined;
};

export function createSupabaseServerClient(
  adapters?: ServerAdapters,
  url?: string,
  anonKey?: string,
): SupabaseClient {
  const env = validateEnv({
    NEXT_PUBLIC_SUPABASE_URL: url,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey,
  });

  const client = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
      global: {
        headers: adapters?.getHeader
          ? { Authorization: adapters.getHeader("Authorization") ?? "" }
          : undefined,
      },
    },
  );
  return client;
}
