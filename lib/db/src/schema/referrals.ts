import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const referralsTable = pgTable("referrals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  domain: text("domain").notNull(),
  location: text("location").notNull(),
  salary: text("salary"),
  description: text("description").notNull(),
  skills: text("skills").array().notNull().default([]),
  referredBy: text("referred_by").notNull(),
  referrerTitle: text("referrer_title").notNull(),
  deadline: text("deadline"),
  applicantsCount: integer("applicants_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const referralApplicationsTable = pgTable("referral_applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  referralId: integer("referral_id").notNull(),
  status: text("status").notNull().default("pending"),
  appliedAt: timestamp("applied_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertReferralSchema = createInsertSchema(referralsTable).omit({ id: true, createdAt: true });
export type InsertReferral = z.infer<typeof insertReferralSchema>;
export type Referral = typeof referralsTable.$inferSelect;

export const insertReferralApplicationSchema = createInsertSchema(referralApplicationsTable).omit({ id: true, appliedAt: true });
export type InsertReferralApplication = z.infer<typeof insertReferralApplicationSchema>;
export type ReferralApplication = typeof referralApplicationsTable.$inferSelect;
