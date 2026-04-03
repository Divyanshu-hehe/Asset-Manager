import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const resumesTable = pgTable("resumes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  score: integer("score").notNull().default(0),
  suggestions: text("suggestions").array().notNull().default([]),
  strengths: text("strengths").array().notNull().default([]),
  skillGaps: text("skill_gaps").array().notNull().default([]),
  targetRole: text("target_role"),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertResumeSchema = createInsertSchema(resumesTable).omit({ id: true, createdAt: true });
export type InsertResume = z.infer<typeof insertResumeSchema>;
export type Resume = typeof resumesTable.$inferSelect;
