"use client";

import { supabaseBrowser } from "@repo/supabase/browser";
import type { Session, User } from "@supabase/supabase-js";
import { useEffect, useMemo, useState } from "react";

export type SessionStatus = "loading" | "authenticated" | "unauthenticated";

type State = {
  session: Session | null;
  user: User | null;
  status: SessionStatus;
  error: { code: string; message: string } | null;
};

export function useSession(): State {
  const supabase = useMemo(() => {
    try {
      return supabaseBrowser();
    } catch {
      return null;
    }
  }, []);

  const [state, setState] = useState<State>({
    session: null,
    user: null,
    status: "loading",
    error: null,
  });

  useEffect(() => {
    if (!supabase) {
      setState((s) => ({ ...s, status: "unauthenticated" }));
      return;
    }

    let mounted = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;
      if (error) {
        setState({
          session: null,
          user: null,
          status: "unauthenticated",
          error: { code: error.name ?? "auth_error", message: error.message },
        });
      } else {
        setState({
          session: data.session,
          user: data.session?.user ?? null,
          status: data.session ? "authenticated" : "unauthenticated",
          error: null,
        });
      }
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;
        setState({
          session,
          user: session?.user ?? null,
          status: session ? "authenticated" : "unauthenticated",
          error: null,
        });
      },
    );

    return () => {
      mounted = false;
      subscription?.subscription.unsubscribe();
    };
  }, [supabase]);

  return state;
}
