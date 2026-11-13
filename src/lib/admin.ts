import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { getAuth, isAdminEmail } from "./auth";

/** Redirects to sign-in unless the visitor is a signed-in admin. */
export async function requireAdmin() {
  if (!db) redirect("/admin/sign-in/?setup=1");
  const session = await getAuth().api.getSession({ headers: await headers() });
  if (!session || !isAdminEmail(session.user.email)) redirect("/admin/sign-in/");
  return session;
}
