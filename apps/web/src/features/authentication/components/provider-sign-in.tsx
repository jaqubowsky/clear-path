"use client";

import { supabaseBrowser } from "@repo/supabase/browser";
import { Button } from "@repo/ui/components/button";
import { useCallback, useState } from "react";

type Props = {
  returnUrl?: string | null;
  onError?: (message: string) => void;
};

export function ProviderSignIn({ returnUrl, onError }: Props) {
  const [loadingProvider, setLoadingProvider] = useState<
    "google" | "github" | null
  >(null);

  const handleClick = useCallback(
    async (provider: "google" | "github") => {
      try {
        setLoadingProvider(provider);
        const supabase = supabaseBrowser();
        const redirectTo =
          typeof window !== "undefined" ? window.location.origin : undefined;
        const { error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo,
            queryParams: returnUrl ? { returnUrl } : undefined,
          },
        });
        if (error) throw error;
      } catch (e) {
        const message = (e as Error).message ?? "Sign-in failed";
        onError?.(message);
        setLoadingProvider(null);
      }
    },
    [onError, returnUrl],
  );

  return (
    <div className="flex flex-col gap-3">
      <Button
        onClick={() => handleClick("google")}
        disabled={loadingProvider !== null}
        variant="default"
      >
        {loadingProvider === "google" ? "Redirecting…" : "Continue with Google"}
      </Button>
      <Button
        onClick={() => handleClick("github")}
        disabled={loadingProvider !== null}
        variant="secondary"
      >
        {loadingProvider === "github" ? "Redirecting…" : "Continue with GitHub"}
      </Button>
    </div>
  );
}
