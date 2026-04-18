import { Router } from "express";
import { z } from "zod";
import { db, studentsTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router = Router();

const registerBodySchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  course: z.enum(["bac", "english", "robotics"]),
  payment_method: z.enum(["cash", "ccp"]),
});

const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL || "";

router.post("/register", async (req, res) => {
  const parsed = registerBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "بيانات غير صحيحة" });
    return;
  }

  const { name, phone, course, payment_method } = parsed.data;

  const [student] = await db
    .insert(studentsTable)
    .values({ name, phone, course, payment_method })
    .returning();

  if (!student) {
    res.status(500).json({ error: "فشل التسجيل" });
    return;
  }

  if (GOOGLE_SCRIPT_URL) {
    try {
      const params = new URLSearchParams({
        name,
        phone,
        course,
        payment: payment_method,
        payment_method,
      });
      fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      }).catch((err) => {
        req.log.error({ err }, "Google Sheets sync failed");
      });
    } catch (err) {
      req.log.error({ err }, "Google Sheets sync error");
    }
  }

  res.status(201).json({
    success: true,
    student: {
      ...student,
      created_at: student.created_at.toISOString(),
    },
  });
});

router.get("/students", async (_req, res) => {
  const students = await db
    .select()
    .from(studentsTable)
    .orderBy(desc(studentsTable.created_at));

  res.json(
    students.map((s) => ({
      ...s,
      created_at: s.created_at.toISOString(),
    })),
  );
});

router.get("/export", async (req, res) => {
  const students = await db
    .select()
    .from(studentsTable)
    .orderBy(desc(studentsTable.created_at));

  const today = new Date().toISOString().split("T")[0];
  const filename = `students_${today}.csv`;

  const courseLabels: Record<string, string> = {
    bac: "تحضير البكالوريا",
    english: "اللغة الإنجليزية",
    robotics: "الروبوتيك للأطفال",
  };
  const paymentLabels: Record<string, string> = {
    cash: "نقداً",
    ccp: "CCP",
  };
  const statusLabels: Record<string, string> = {
    pending: "قيد الانتظار",
    confirmed: "مؤكد",
  };

  const BOM = "\uFEFF";
  const header = "ID,الاسم,الهاتف,الدورة,طريقة الدفع,الحالة,تاريخ التسجيل";
  const rows = students.map((s) => {
    const course = courseLabels[s.course] || s.course;
    const payment = paymentLabels[s.payment_method] || s.payment_method;
    const status = statusLabels[s.status] || s.status;
    const date = s.created_at.toISOString();
    return `${s.id},"${s.name}","${s.phone}","${course}","${payment}","${status}","${date}"`;
  });

  const csv = BOM + [header, ...rows].join("\n");

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.send(csv);
});

export default router;
