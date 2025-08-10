"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ProviderSignIn } from "../../../src/features/authentication/components/provider-sign-in";

export default function SignInPage() {
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const returnUrl = useMemo(() => params.get("returnUrl"), [params]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-6 p-6">
      <div className="w-full">
        <h1 className="mb-2 text-2xl font-semibold">Sign in</h1>
        <p className="text-sm text-neutral-600">
          Choose a provider to continue.
        </p>
      </div>
      {error ? (
        <div
          role="alert"
          className="w-full rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800"
        >
          {error}
        </div>
      ) : null}
      <ProviderSignIn returnUrl={returnUrl} onError={setError} />
    </main>
  );
}
