"use client";

import { Button } from "@repo/ui/components/button";
import Link from "next/link";
import { useSession } from "../../../shared/auth/use-session";
import { SignOutButton } from "./sign-out-button";

export function HomeContent() {
  const { status, user } = useSession();

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-xl">Welcome</h1>
        <div className="text-sm opacity-80">Status: {status}</div>
        {user ? (
          <>
            <div className="text-sm">Signed in as {user.email ?? user.id}</div>
            <SignOutButton />
          </>
        ) : (
          <Button asChild>
            <Link href="/auth/sign-in">Go to sign in</Link>
          </Button>
        )}
      </div>
    </main>
  );
}
