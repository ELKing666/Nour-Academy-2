import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, coursePricingTable, faqItemsTable, contactInfoTable } from "@workspace/db";

const router = Router();

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface CoursePricingData {
  price: string;
  priceNote: string;
}

export interface ContactData {
  phone: string;
  email: string;
  address: string;
}

export interface SiteContent {
  faq: FaqItem[];
  contact: ContactData;
  pricing: {
    bac: CoursePricingData;
    english: CoursePricingData;
    robotics: CoursePricingData;
  };
}

export const DEFAULT_CONTENT: SiteContent = {
  faq: [
    {
      id: "1",
      question: "كيف يمكنني التسجيل في الدورات؟",
      answer:
        "يمكنك التسجيل بسهولة عبر تعبئة النموذج الإلكتروني الموجود في أسفل الصفحة، وسيقوم فريقنا بالتواصل معك لتأكيد التسجيل.",
    },
    {
      id: "2",
      question: "ما هي أوقات الدراسة؟",
      answer:
        "نوفر جداول مرنة تناسب جميع الطلاب، بما في ذلك فترات مسائية وعطلات نهاية الأسبوع.",
    },
    {
      id: "3",
      question: "ما هي الفئة العمرية لدورة الروبوتيك؟",
      answer:
        "دورة الروبوتيك مصممة خصيصاً للأطفال واليافعين الذين تتراوح أعمارهم بين 8 و 14 سنة.",
    },
    {
      id: "4",
      question: "ما هي طرق الدفع المتاحة؟",
      answer: "نقبل الدفع نقداً في مقر الأكاديمية، أو عبر التحويل البريدي (CCP).",
    },
    {
      id: "5",
      question: "هل تقدمون شهادات بعد إتمام الدورات؟",
      answer:
        "نعم، نقدم شهادات مشاركة معتمدة من الأكاديمية بعد إتمام دورات اللغات والروبوتيك.",
    },
  ],
  contact: {
    phone: "0555 12 34 56",
    email: "contact@nour-academy.dz",
    address: "حي 500 مسكن، شلف، الجزائر",
  },
  pricing: {
    bac: {
      price: "6,000 د.ج / شهرياً",
      priceNote: "يشمل السعر جميع المواد الثلاث — 6 ساعات أسبوعياً لمدة شهر كامل.",
    },
    english: {
      price: "4,500 د.ج / شهرياً",
      priceNote: "4 ساعات أسبوعياً — يشمل المواد التعليمية ووصولاً لمكتبة رقمية.",
    },
    robotics: {
      price: "5,000 د.ج / شهرياً",
      priceNote: "3 ساعات أسبوعياً — يشمل جميع مواد ومكونات الروبوت.",
    },
  },
};

const COURSE_SLUGS = ["bac", "english", "robotics"] as const;

async function seedDefaults(): Promise<void> {
  await db
    .insert(coursePricingTable)
    .values(
      COURSE_SLUGS.map((slug) => ({
        course_slug: slug,
        price: DEFAULT_CONTENT.pricing[slug].price,
        price_note: DEFAULT_CONTENT.pricing[slug].priceNote,
      })),
    )
    .onConflictDoNothing();

  await db
    .insert(faqItemsTable)
    .values(
      DEFAULT_CONTENT.faq.map((item, i) => ({
        id: item.id,
        question: item.question,
        answer: item.answer,
        sort_order: i,
      })),
    )
    .onConflictDoNothing();

  await db
    .insert(contactInfoTable)
    .values({
      id: "main",
      phone: DEFAULT_CONTENT.contact.phone,
      email: DEFAULT_CONTENT.contact.email,
      address: DEFAULT_CONTENT.contact.address,
    })
    .onConflictDoNothing();
}

export async function getContent(): Promise<SiteContent> {
  const [pricingRows, faqRows, contactRows] = await Promise.all([
    db.select().from(coursePricingTable),
    db.select().from(faqItemsTable).orderBy(faqItemsTable.sort_order),
    db.select().from(contactInfoTable).where(eq(contactInfoTable.id, "main")),
  ]);

  if (!pricingRows.length || !faqRows.length || !contactRows.length) {
    await seedDefaults();
    return DEFAULT_CONTENT;
  }

  const pricingMap = Object.fromEntries(
    pricingRows.map((r) => [r.course_slug, { price: r.price, priceNote: r.price_note }]),
  );

  const contactRow = contactRows[0];

  return {
    faq: faqRows.map((r) => ({ id: r.id, question: r.question, answer: r.answer })),
    contact: {
      phone: contactRow.phone,
      email: contactRow.email,
      address: contactRow.address,
    },
    pricing: {
      bac: pricingMap["bac"] ?? DEFAULT_CONTENT.pricing.bac,
      english: pricingMap["english"] ?? DEFAULT_CONTENT.pricing.english,
      robotics: pricingMap["robotics"] ?? DEFAULT_CONTENT.pricing.robotics,
    },
  };
}

export async function setContent(content: SiteContent): Promise<void> {
  await Promise.all([
    ...COURSE_SLUGS.map((slug) =>
      db
        .insert(coursePricingTable)
        .values({
          course_slug: slug,
          price: content.pricing[slug].price,
          price_note: content.pricing[slug].priceNote,
        })
        .onConflictDoUpdate({
          target: coursePricingTable.course_slug,
          set: {
            price: content.pricing[slug].price,
            price_note: content.pricing[slug].priceNote,
            updated_at: new Date(),
          },
        }),
    ),
    db.delete(faqItemsTable).then(() =>
      content.faq.length > 0
        ? db.insert(faqItemsTable).values(
            content.faq.map((item, i) => ({
              id: item.id,
              question: item.question,
              answer: item.answer,
              sort_order: i,
            })),
          )
        : Promise.resolve(),
    ),
    db
      .insert(contactInfoTable)
      .values({
        id: "main",
        phone: content.contact.phone,
        email: content.contact.email,
        address: content.contact.address,
      })
      .onConflictDoUpdate({
        target: contactInfoTable.id,
        set: {
          phone: content.contact.phone,
          email: content.contact.email,
          address: content.contact.address,
          updated_at: new Date(),
        },
      }),
  ]);
}

router.get("/content", async (_req, res) => {
  const content = await getContent();
  res.json(content);
});

export { router as contentRouter };
