import { Router, type IRouter } from "express";
import { pool } from "@workspace/db";

const router: IRouter = Router();

const DEFAULT_TIMEOUT_MS = 5000;
const MIN_TIMEOUT_MS = 1000;

const parsed = parseInt(process.env.HEALTH_CHECK_TIMEOUT_MS ?? "", 10);
const HEALTH_CHECK_TIMEOUT_MS =
  Number.isFinite(parsed) && parsed >= MIN_TIMEOUT_MS ? parsed : DEFAULT_TIMEOUT_MS;

router.get("/healthz", (_req, res) => {
  res.json({ status: "ok" });
});

router.get("/health", async (_req, res) => {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new Error("health check timeout")),
      HEALTH_CHECK_TIMEOUT_MS
    );
  });

  try {
    await Promise.race([pool.query("SELECT 1"), timeout]);
    res.status(200).json({ status: "ok", db: "ok" });
  } catch {
    res.status(503).json({ status: "error", db: "unreachable" });
  } finally {
    clearTimeout(timer);
  }
});

export default router;
