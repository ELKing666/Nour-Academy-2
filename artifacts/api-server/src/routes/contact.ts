import { Router } from "express";
import { z } from "zod";
import { db, contactMessagesTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";

const router = Router();

const contactBodySchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  message: z.string().min(1),
});

function requireAdmin(
  req: import("express").Request,
  res: import("express").Response,
  next: import("express").NextFunction,
) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    res.status(503).json({ error: "لم يتم تعيين كلمة مرور المشرف" });
    return;
  }
  const auth = req.headers.authorization;
  if (!auth || auth !== `Bearer ${adminPassword}`) {
    res.status(401).json({ error: "كلمة المرور غير صحيحة" });
    return;
  }
  next();
}

router.post("/contact", async (req, res) => {
  const parsed = contactBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "بيانات غير صحيحة" });
    return;
  }

  const { name, phone, message } = parsed.data;

  const [record] = await db
    .insert(contactMessagesTable)
    .values({ name, phone, message })
    .returning();

  if (!record) {
    res.status(500).json({ error: "فشل الإرسال" });
    return;
  }

  res.status(201).json({
    success: true,
    message: {
      ...record,
      created_at: record.created_at.toISOString(),
    },
  });
});

router.get("/admin/messages", requireAdmin, async (_req, res) => {
  const messages = await db
    .select()
    .from(contactMessagesTable)
    .orderBy(desc(contactMessagesTable.created_at));

  res.json(
    messages.map((m) => ({
      ...m,
      created_at: m.created_at.toISOString(),
    })),
  );
});

router.delete("/admin/messages/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: "معرّف غير صحيح" });
    return;
  }

  const deleted = await db
    .delete(contactMessagesTable)
    .where(eq(contactMessagesTable.id, id))
    .returning();

  if (deleted.length === 0) {
    res.status(404).json({ error: "الرسالة غير موجودة" });
    return;
  }

  res.json({ success: true });
});

export { router as contactRouter };
