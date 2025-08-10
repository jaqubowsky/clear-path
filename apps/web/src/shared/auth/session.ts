"use client";

import { supabaseBrowser } from "@repo/supabase/browser";
import type { Session, User } from "@supabase/supabase-js";

export type AuthErrorDto = { code: string; message: string };

export async function getSession(): Promise<{
  session: Session | null;
  error: AuthErrorDto | null;
}> {
  try {
    const supabase = supabaseBrowser();
    const { data, error } = await supabase.auth.getSession();
    if (error)
      return {
        session: null,
        error: { code: error.name ?? "auth_error", message: error.message },
      };
    return { session: data.session, error: null };
  } catch (e) {
    const err = e as Error;
    return {
      session: null,
      error: { code: "auth_exception", message: err.message },
    };
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const { session } = await getSession();
  return session?.user ?? null;
}

export function isAuthenticatedSync(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const token = window.localStorage.getItem("supabase.auth.token");
    return Boolean(token);
  } catch {
    return false;
  }
}
