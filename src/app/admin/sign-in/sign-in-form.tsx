"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function SignInForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email"));
    const password = String(f.get("password"));
    const res =
      mode === "sign-in"
        ? await authClient.signIn.email({ email, password })
        : await authClient.signUp.email({ email, password, name: String(f.get("name") || email) });
    setPending(false);
    if (res.error) return setError(res.error.message ?? "Something went wrong.");
    router.push("/admin/");
    router.refresh();
  }

  const input = "mt-1 w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-navy";
  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      {mode === "sign-up" && (
        <label className="block text-sm font-medium">
          Name
          <input name="name" className={input} autoComplete="name" />
        </label>
      )}
      <label className="block text-sm font-medium">
        Email
        <input name="email" type="email" required className={input} autoComplete="email" />
      </label>
      <label className="block text-sm font-medium">
        Password
        <input
          name="password"
          type="password"
          required
          minLength={12}
          className={input}
          autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
        />
      </label>
      {error && <p className="text-sm text-coral">{error}</p>}
      <button
        disabled={pending}
        className="w-full rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Please wait…" : mode === "sign-in" ? "Sign in" : "Create admin account"}
      </button>
      <button
        type="button"
        onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}
        className="w-full text-center text-sm text-muted hover:text-navy"
      >
        {mode === "sign-in" ? "First time? Create the admin account" : "Have an account? Sign in"}
      </button>
    </form>
  );
}
