import { pgTable, text, serial, timestamp, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const mentorsTable = pgTable("mentors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  domain: text("domain").notNull(),
  college: text("college").notNull(),
  experience: integer("experience").notNull().default(0),
  bio: text("bio").notNull(),
  skills: text("skills").array().notNull().default([]),
  avatarUrl: text("avatar_url"),
  linkedinUrl: text("linkedin_url"),
  sessionsCount: integer("sessions_count").notNull().default(0),
  rating: real("rating").notNull().default(5.0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertMentorSchema = createInsertSchema(mentorsTable).omit({ id: true, createdAt: true });
export type InsertMentor = z.infer<typeof insertMentorSchema>;
export type Mentor = typeof mentorsTable.$inferSelect;
