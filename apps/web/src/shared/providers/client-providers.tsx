"use client";

import { initSupabaseBrowser } from "@repo/supabase/browser";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type PropsWithChildren, useEffect, useState } from "react";

export function ClientProviders({ children }: PropsWithChildren) {
  const [client] = useState(() => new QueryClient());

  useEffect(() => {
    try {
      // Initialize Supabase on client so OAuth URL fragments are handled
      void initSupabaseBrowser();
    } catch {
      // ignore missing env during setup
    }
  }, []);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
