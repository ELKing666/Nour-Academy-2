import { pgTable, text, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

export const coursePricingTable = pgTable("course_pricing", {
  course_slug: text("course_slug").primaryKey(),
  price: text("price").notNull(),
  price_note: text("price_note").notNull(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const faqItemsTable = pgTable("faq_items", {
  id: text("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  sort_order: integer("sort_order").notNull().default(0),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const contactInfoTable = pgTable("contact_info", {
  id: text("id").primaryKey().default("main"),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  address: text("address").notNull(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const coursesTable = pgTable("courses", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  price: text("price").notNull().default(""),
  duration: text("duration").notNull().default(""),
  image_url: text("image_url").notNull().default(""),
  icon: text("icon").notNull().default("📚"),
  category: text("category").notNull().default("adults"),
  is_featured: boolean("is_featured").notNull().default(false),
  sort_order: integer("sort_order").notNull().default(0),
  badge: text("badge").default(""),
  stats: jsonb("stats").$type<Array<{ value: string; label: string }>>(),
  topics: jsonb("topics").$type<Array<{ num: string; title: string; desc: string; tags: string[] }>>(),
  for_whom: jsonb("for_whom").$type<string[]>(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export type CoursePricing = typeof coursePricingTable.$inferSelect;
export type FaqItem = typeof faqItemsTable.$inferSelect;
export type ContactInfo = typeof contactInfoTable.$inferSelect;
export type Course = typeof coursesTable.$inferSelect;
