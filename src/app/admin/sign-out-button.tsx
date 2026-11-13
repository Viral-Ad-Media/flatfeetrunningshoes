"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await authClient.signOut();
        router.push("/admin/sign-in/");
      }}
      className="rounded-full border border-line px-5 py-2 text-sm font-semibold"
    >
      Sign out
    </button>
  );
}
