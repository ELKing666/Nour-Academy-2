import { Router } from "express";
import { eq, asc } from "drizzle-orm";
import { db, coursesTable } from "@workspace/db";

const router = Router();

export interface CourseStat { value: string; label: string; }
export interface CourseTopic { num: string; title: string; desc: string; tags: string[]; }

export interface CoursePayload {
  id: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  image_url: string;
  icon: string;
  category: "adults" | "kids";
  is_featured: boolean;
  sort_order: number;
  badge?: string;
  stats?: CourseStat[];
  topics?: CourseTopic[];
  for_whom?: string[];
}

const DEFAULT_COURSES: CoursePayload[] = [
  {
    id: "bac",
    title: "تحضير البكالوريا",
    description: "منهج شامل ودقيق في الرياضيات والفيزياء والعلوم الطبيعية، مع متابعة فردية لكل طالب لضمان أعلى نتيجة ممكنة في امتحان البكالوريا.",
    price: "6,000 د.ج / شهرياً",
    duration: "6 ساعة/أسبوع",
    image_url: "",
    icon: "📚",
    category: "adults",
    is_featured: false,
    sort_order: 0,
  },
  {
    id: "english",
    title: "اللغة الإنجليزية",
    description: "دورات مدروسة بعناية لتطوير مهارات المحادثة والكتابة والقراءة، مع مدرسين متخصصين ومحتوى حديث مناسب لجميع المستويات والأعمار.",
    price: "4,500 د.ج / شهرياً",
    duration: "4 ساعة/أسبوع",
    image_url: "",
    icon: "🌍",
    category: "adults",
    is_featured: true,
    sort_order: 1,
  },
  {
    id: "robotics",
    title: "الروبوتيك للأطفال",
    description: "برنامج تفاعلي وممتع يُعلّم الأطفال أساسيات البرمجة وتجميع الروبوتات بأسلوب لعبي، ينمّي التفكير المنطقي والإبداعي.",
    price: "5,000 د.ج / شهرياً",
    duration: "3 ساعة/أسبوع",
    image_url: "",
    icon: "🤖",
    category: "kids",
    is_featured: true,
    sort_order: 0,
  },
];

async function seedCoursesIfEmpty(): Promise<void> {
  const existing = await db.select().from(coursesTable).limit(1);
  if (existing.length === 0) {
    await db.insert(coursesTable).values(DEFAULT_COURSES).onConflictDoNothing();
  }
}

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

router.get("/courses", async (_req, res) => {
  await seedCoursesIfEmpty();
  const courses = await db
    .select()
    .from(coursesTable)
    .orderBy(asc(coursesTable.category), asc(coursesTable.sort_order), asc(coursesTable.created_at));
  res.json(courses);
});

router.get("/courses/:id", async (req, res) => {
  await seedCoursesIfEmpty();
  const [course] = await db
    .select()
    .from(coursesTable)
    .where(eq(coursesTable.id, String(req.params.id)));
  if (!course) {
    res.status(404).json({ error: "الدورة غير موجودة" });
    return;
  }
  res.json(course);
});

router.post("/admin/courses", requireAdmin, async (req, res) => {
  const body = req.body as Partial<CoursePayload>;

  if (!body.id || !body.title) {
    res.status(400).json({ error: "المعرف والعنوان مطلوبان" });
    return;
  }

  const existing = await db
    .select()
    .from(coursesTable)
    .where(eq(coursesTable.id, body.id));
  if (existing.length > 0) {
    res.status(409).json({ error: "يوجد بالفعل دورة بهذا المعرف" });
    return;
  }

  const [created] = await db
    .insert(coursesTable)
    .values({
      id: body.id,
      title: body.title,
      description: body.description ?? "",
      price: body.price ?? "",
      duration: body.duration ?? "",
      image_url: body.image_url ?? "",
      icon: body.icon ?? "📚",
      category: body.category ?? "adults",
      is_featured: body.is_featured ?? false,
      sort_order: body.sort_order ?? 0,
      badge: body.badge ?? "",
      stats: body.stats ?? [],
      topics: body.topics ?? [],
      for_whom: body.for_whom ?? [],
    })
    .returning();

  res.status(201).json(created);
});

router.put("/admin/courses/:id", requireAdmin, async (req, res) => {
  const body = req.body as Partial<CoursePayload>;

  const [updated] = await db
    .update(coursesTable)
    .set({
      title: body.title,
      description: body.description,
      price: body.price,
      duration: body.duration,
      image_url: body.image_url,
      icon: body.icon,
      category: body.category,
      is_featured: body.is_featured,
      sort_order: body.sort_order,
      badge: body.badge,
      stats: body.stats,
      topics: body.topics,
      for_whom: body.for_whom,
      updated_at: new Date(),
    })
    .where(eq(coursesTable.id, String(req.params.id)))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "الدورة غير موجودة" });
    return;
  }

  res.json(updated);
});

router.delete("/admin/courses/:id", requireAdmin, async (req, res) => {
  const [deleted] = await db
    .delete(coursesTable)
    .where(eq(coursesTable.id, String(req.params.id)))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "الدورة غير موجودة" });
    return;
  }

  res.json({ success: true });
});

export { router as coursesRouter };
