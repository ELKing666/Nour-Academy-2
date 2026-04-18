import path from "path";
import { fileURLToPath } from "url";
import app from "./app";
import { logger } from "./lib/logger";
import { runSeed } from "./seed";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = Number(process.env["PORT"] ?? 3000);

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");

  if (process.env.DATABASE_URL) {
    const migrationsFolder = path.resolve(__dirname, "../../../lib/db/drizzle");

    Promise.resolve()
      .then(() =>
        import("drizzle-orm/node-postgres/migrator").then(({ migrate }) =>
          import("@workspace/db").then(({ db }) => migrate(db, { migrationsFolder }))
        )
      )
      .then(() => {
        logger.info("Database migrations applied");
      })
      .catch((err) => {
        logger.warn({ err }, "Migrations step failed (tables may already exist) — continuing");
      })
      .then(() => runSeed())
      .then(() => {
        logger.info("Database seed complete");
      })
      .catch((err) => {
        logger.error({ err }, "Seed failed — server still running");
      });
  } else {
    logger.warn("DATABASE_URL not set — skipping migrations and seed");
  }
});
