/**
 * Import content tables from a JSON export file into a Railway PostgreSQL database.
 *
 * Usage:
 *   DATABASE_URL="<railway-db-url>" pnpm --filter @workspace/scripts import-data
 *
 * By default reads `data-export.json` from the project root.
 * Pass a custom input path as the first argument:
 *   DATABASE_URL="..." pnpm --filter @workspace/scripts import-data -- ./my-export.json
 *
 * Options (env vars):
 *   SKIP_CONTACT_MESSAGES=true  — skip importing contact_messages (enquiries)
 */

import pg from "pg";
import fs from "node:fs/promises";
import path from "node:path";

const { Pool } = pg;

const INPUT_FILE = process.argv[2] ?? path.resolve(process.cwd(), "data-export.json");
const SKIP_MESSAGES = process.env.SKIP_CONTACT_MESSAGES === "true";

interface ExportedData {
  exported_at: string;
  tables: {
    courses: Record<string, unknown>[];
    faq_items: Record<string, unknown>[];
    contact_info: Record<string, unknown>[];
    contact_messages: Record<string, unknown>[];
  };
}

async function tableExists(client: pg.PoolClient, tableName: string): Promise<boolean> {
  const { rows } = await client.query(
    `SELECT 1 FROM information_schema.tables
     WHERE table_schema = 'public' AND table_name = $1`,
    [tableName],
  );
  return rows.length > 0;
}

async function upsertCourses(client: pg.PoolClient, rows: Record<string, unknown>[]) {
  if (rows.length === 0) return;
  console.log(`  courses: upserting ${rows.length} row(s)…`);
  for (const row of rows) {
    await client.query(
      `INSERT INTO courses
         (id, title, description, price, duration, image_url, icon, category,
          is_featured, sort_order, badge, stats, topics, for_whom, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
       ON CONFLICT (id) DO UPDATE SET
         title        = EXCLUDED.title,
         description  = EXCLUDED.description,
         price        = EXCLUDED.price,
         duration     = EXCLUDED.duration,
         image_url    = EXCLUDED.image_url,
         icon         = EXCLUDED.icon,
         category     = EXCLUDED.category,
         is_featured  = EXCLUDED.is_featured,
         sort_order   = EXCLUDED.sort_order,
         badge        = EXCLUDED.badge,
         stats        = EXCLUDED.stats,
         topics       = EXCLUDED.topics,
         for_whom     = EXCLUDED.for_whom,
         updated_at   = EXCLUDED.updated_at`,
      [
        row.id,
        row.title,
        row.description,
        row.price,
        row.duration,
        row.image_url,
        row.icon,
        row.category,
        row.is_featured,
        row.sort_order,
        row.badge,
        row.stats != null ? JSON.stringify(row.stats) : null,
        row.topics != null ? JSON.stringify(row.topics) : null,
        row.for_whom != null ? JSON.stringify(row.for_whom) : null,
        row.created_at,
        row.updated_at,
      ],
    );
  }
}

async function upsertFaqItems(client: pg.PoolClient, rows: Record<string, unknown>[]) {
  if (rows.length === 0) return;
  console.log(`  faq_items: upserting ${rows.length} row(s)…`);
  for (const row of rows) {
    await client.query(
      `INSERT INTO faq_items (id, question, answer, sort_order, updated_at)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (id) DO UPDATE SET
         question   = EXCLUDED.question,
         answer     = EXCLUDED.answer,
         sort_order = EXCLUDED.sort_order,
         updated_at = EXCLUDED.updated_at`,
      [row.id, row.question, row.answer, row.sort_order, row.updated_at],
    );
  }
}

async function upsertContactInfo(client: pg.PoolClient, rows: Record<string, unknown>[]) {
  if (rows.length === 0) return;
  console.log(`  contact_info: upserting ${rows.length} row(s)…`);
  for (const row of rows) {
    await client.query(
      `INSERT INTO contact_info (id, phone, email, address, updated_at)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (id) DO UPDATE SET
         phone      = EXCLUDED.phone,
         email      = EXCLUDED.email,
         address    = EXCLUDED.address,
         updated_at = EXCLUDED.updated_at`,
      [row.id, row.phone, row.email, row.address, row.updated_at],
    );
  }
}

async function insertContactMessages(client: pg.PoolClient, rows: Record<string, unknown>[]) {
  if (SKIP_MESSAGES) {
    console.log(`  contact_messages: skipped (SKIP_CONTACT_MESSAGES=true)`);
    return;
  }
  if (rows.length === 0) return;
  console.log(`  contact_messages: inserting ${rows.length} row(s)…`);
  for (const row of rows) {
    await client.query(
      `INSERT INTO contact_messages (id, name, phone, message, created_at)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (id) DO NOTHING`,
      [row.id, row.name, row.phone, row.message, row.created_at],
    );
  }
  await client.query(
    `SELECT setval(
       pg_get_serial_sequence('contact_messages', 'id'),
       COALESCE((SELECT MAX(id) FROM contact_messages), 1),
       true
     )`,
  );
  console.log(`  contact_messages: sequence reset to match imported max id`);
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("ERROR: DATABASE_URL environment variable is not set.");
    process.exit(1);
  }

  let raw: string;
  try {
    raw = await fs.readFile(INPUT_FILE, "utf-8");
  } catch {
    console.error(`ERROR: Could not read export file at "${INPUT_FILE}".`);
    console.error("Run the export script first: pnpm --filter @workspace/scripts export-data");
    process.exit(1);
  }

  const data: ExportedData = JSON.parse(raw);
  console.log(`Importing data exported at ${data.exported_at}…`);
  console.log(`Source file: ${INPUT_FILE}`);

  const ssl =
    databaseUrl.includes("railway") || process.env.DATABASE_SSL === "true"
      ? { rejectUnauthorized: false }
      : false;

  const pool = new Pool({ connectionString: databaseUrl, ssl });
  const client = await pool.connect();

  try {
    const tablesToCheck = Object.keys(data.tables).filter(
      (t) => !(SKIP_MESSAGES && t === "contact_messages"),
    );
    for (const tableName of tablesToCheck) {
      const exists = await tableExists(client, tableName);
      if (!exists) {
        console.error(
          `ERROR: Table "${tableName}" does not exist in the target database.`,
        );
        console.error(
          "Make sure the Railway service has started at least once so Drizzle can run migrations.",
        );
        process.exit(1);
      }
    }

    await client.query("BEGIN");
    try {
      await upsertCourses(client, data.tables.courses);
      await upsertFaqItems(client, data.tables.faq_items);
      await upsertContactInfo(client, data.tables.contact_info);
      await insertContactMessages(client, data.tables.contact_messages);
      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    }

    const activeTables = SKIP_MESSAGES
      ? (Object.entries(data.tables)
          .filter(([k]) => k !== "contact_messages")
          .map(([, v]) => v) as Record<string, unknown>[][])
      : Object.values(data.tables);
    const total = activeTables.reduce((sum, rows) => sum + rows.length, 0);
    console.log(`\nImport complete. ${total} row(s) processed.`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});
