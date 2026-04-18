/**
 * Export content tables from the Replit PostgreSQL database to a JSON file.
 *
 * Usage:
 *   DATABASE_URL="<replit-db-url>" pnpm --filter @workspace/scripts export-data
 *
 * The script writes `data-export.json` in the project root.
 * Pass a custom output path as the first argument:
 *   DATABASE_URL="..." pnpm --filter @workspace/scripts export-data -- ./my-export.json
 */

import pg from "pg";
import fs from "node:fs/promises";
import path from "node:path";

const { Pool } = pg;

const OUTPUT_FILE = process.argv[2] ?? path.resolve(process.cwd(), "data-export.json");

async function tableExists(client: pg.PoolClient, tableName: string): Promise<boolean> {
  const { rows } = await client.query(
    `SELECT 1 FROM information_schema.tables
     WHERE table_schema = 'public' AND table_name = $1`,
    [tableName],
  );
  return rows.length > 0;
}

async function exportTable(
  client: pg.PoolClient,
  tableName: string,
): Promise<Record<string, unknown>[]> {
  const exists = await tableExists(client, tableName);
  if (!exists) {
    console.warn(`  Table "${tableName}" does not exist — skipping.`);
    return [];
  }
  const { rows } = await client.query(`SELECT * FROM "${tableName}" ORDER BY 1`);
  console.log(`  ${tableName}: ${rows.length} row(s) exported`);
  return rows;
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("ERROR: DATABASE_URL environment variable is not set.");
    process.exit(1);
  }

  const ssl =
    databaseUrl.includes("railway") || process.env.DATABASE_SSL === "true"
      ? { rejectUnauthorized: false }
      : false;

  const pool = new Pool({ connectionString: databaseUrl, ssl });
  const client = await pool.connect();

  try {
    console.log("Exporting data from database…");

    const data = {
      exported_at: new Date().toISOString(),
      tables: {
        courses: await exportTable(client, "courses"),
        faq_items: await exportTable(client, "faq_items"),
        contact_info: await exportTable(client, "contact_info"),
        contact_messages: await exportTable(client, "contact_messages"),
      },
    };

    await fs.writeFile(OUTPUT_FILE, JSON.stringify(data, null, 2), "utf-8");
    console.log(`\nExport complete → ${OUTPUT_FILE}`);
    console.log(
      `Total rows: ${Object.values(data.tables).reduce((sum, rows) => sum + rows.length, 0)}`,
    );
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error("Export failed:", err);
  process.exit(1);
});
