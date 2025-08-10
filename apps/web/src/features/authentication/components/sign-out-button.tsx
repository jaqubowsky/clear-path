"use client";

import { supabaseBrowser } from "@repo/supabase/browser";
import { Button } from "@repo/ui/components/button";
import { useState } from "react";

type Props = { onSignedOut?: () => void };

export function SignOutButton({ onSignedOut }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    try {
      setLoading(true);
      const supabase = supabaseBrowser();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      if (typeof window !== "undefined") {
        window.location.assign("/auth/sign-in");
      }
      onSignedOut?.();
    } catch {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleSignOut} disabled={loading} variant="destructive">
      {loading ? "Signing out…" : "Sign out"}
    </Button>
  );
}
