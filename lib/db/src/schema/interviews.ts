import { pgTable, text, serial, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const interviewQuestionsSchema = z.array(z.object({
  id: z.number(),
  question: z.string(),
  answer: z.string().optional(),
  category: z.string(),
}));

export const interviewFeedbackSchema = z.array(z.object({
  questionId: z.number(),
  score: z.number(),
  feedback: z.string(),
}));

export const interviewSessionsTable = pgTable("interview_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  role: text("role").notNull(),
  difficulty: text("difficulty").notNull().default("medium"),
  questions: jsonb("questions").$type<z.infer<typeof interviewQuestionsSchema>>().notNull().default([]),
  overallScore: integer("overall_score"),
  feedbackText: text("feedback_text"),
  strengths: text("strengths").array().notNull().default([]),
  improvements: text("improvements").array().notNull().default([]),
  questionFeedback: jsonb("question_feedback").$type<z.infer<typeof interviewFeedbackSchema>>().notNull().default([]),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

export const insertInterviewSessionSchema = createInsertSchema(interviewSessionsTable).omit({ id: true, createdAt: true, completedAt: true });
export type InsertInterviewSession = z.infer<typeof insertInterviewSessionSchema>;
export type InterviewSession = typeof interviewSessionsTable.$inferSelect;
