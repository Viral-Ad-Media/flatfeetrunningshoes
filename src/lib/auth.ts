import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { requireDb } from "@/db";
import * as schema from "@/db/schema";

/** Only these emails may create an account. Comma separated, e.g. "you@example.com". */
const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function isAdminEmail(email: string | null | undefined) {
  return !!email && adminEmails.includes(email.toLowerCase());
}

let instance: ReturnType<typeof createAuth> | null = null;

function createAuth() {
  return betterAuth({
    database: drizzleAdapter(requireDb(), { provider: "pg", schema }),
    emailAndPassword: { enabled: true, minPasswordLength: 12 },
    rateLimit: { enabled: true },
    hooks: {
      before: createAuthMiddleware(async (ctx) => {
        if (ctx.path === "/sign-up/email") {
          const email = (ctx.body as { email?: string } | undefined)?.email;
          if (!isAdminEmail(email)) {
            throw new APIError("FORBIDDEN", { message: "Sign-ups are closed." });
          }
        }
      }),
    },
    plugins: [nextCookies()],
  });
}

/** Lazily created so pages that don't need auth can build without a database. */
export function getAuth() {
  instance ??= createAuth();
  return instance;
}
