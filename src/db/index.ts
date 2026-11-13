import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;

/** null when DATABASE_URL is not set, so the public site can still build from the bundled content. */
export const db = url ? drizzle(neon(url), { schema }) : null;

export function requireDb() {
  if (!db) throw new Error("DATABASE_URL is not set. Add your Neon connection string to .env.local.");
  return db;
}
