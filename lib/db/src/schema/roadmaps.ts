import { pgTable, text, serial, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const roadmapStepSchema = z.object({
  skill: z.string(),
  description: z.string(),
  resources: z.array(z.string()),
  completed: z.boolean().default(false),
  order: z.number(),
});

export type RoadmapStep = z.infer<typeof roadmapStepSchema>;

export const roadmapsTable = pgTable("roadmaps", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  role: text("role").notNull(),
  steps: jsonb("steps").$type<RoadmapStep[]>().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertRoadmapSchema = createInsertSchema(roadmapsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertRoadmap = z.infer<typeof insertRoadmapSchema>;
export type Roadmap = typeof roadmapsTable.$inferSelect;
