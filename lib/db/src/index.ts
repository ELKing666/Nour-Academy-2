import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.warn("WARNING: DATABASE_URL is not set. Database features will not work.");
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? "",
  ssl: process.env.DATABASE_URL?.includes("railway") || process.env.DATABASE_SSL === "true"
    ? { rejectUnauthorized: false }
    : false,
});
export const db = drizzle(pool, { schema });

export * from "./schema";
