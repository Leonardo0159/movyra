"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/auth/actions";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full bg-amber text-[oklch(0.1_0.005_45)] hover:bg-amber/90 font-heading uppercase tracking-wider" disabled={pending}>
      {pending ? "Signing in..." : "Sign In"}
    </Button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(loginUser, { success: false });
  const router = useRouter();

  useEffect(() => {
    if (state?.success && state.redirect) {
      router.push(state.redirect);
    }
  }, [state, router]);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[oklch(0.1_0.005_45)] px-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.12_0.01_45)] via-[oklch(0.1_0.005_45)] to-[oklch(0.08_0.01_85)]" />
      <div className="absolute inset-0 film-grain" />
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-amber/5 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-amber/5 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="font-heading text-4xl uppercase tracking-[0.2em] text-amber">
            Movyra
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-sm border border-zinc-800/50 bg-zinc-900/50 p-8 backdrop-blur-sm">
          <div className="mb-6">
            <h1 className="font-heading text-2xl uppercase tracking-wider text-white">Sign In</h1>
            <p className="mt-1 text-sm text-zinc-500">Enter your credentials to continue</p>
          </div>

          <form action={formAction} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="border-zinc-700/50 bg-zinc-800/50 text-white placeholder:text-zinc-600 focus:border-amber/40 focus:ring-amber/20"
                aria-describedby={state?.error ? "login-error" : undefined}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                required
                className="border-zinc-700/50 bg-zinc-800/50 text-white placeholder:text-zinc-600 focus:border-amber/40 focus:ring-amber/20"
              />
            </div>
            {state?.error && (
              <p
                id="login-error"
                className="text-sm text-destructive"
                role="alert"
                aria-live="polite"
              >
                {state.error}
              </p>
            )}
            <SubmitButton />
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-zinc-500">Don&apos;t have an account? </span>
            <Link href="/register" className="text-amber transition-colors hover:text-amber/80">
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
