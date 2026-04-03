import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, resumesTable, roadmapsTable, connectionsTable, referralApplicationsTable, interviewSessionsTable } from "@workspace/db";
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";
import type { RoadmapStep } from "@workspace/db";

const router: IRouter = Router();

router.get("/dashboard/summary", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const userId = req.userId!;

  const [latestResume] = await db
    .select()
    .from(resumesTable)
    .where(eq(resumesTable.userId, userId))
    .orderBy(desc(resumesTable.createdAt))
    .limit(1);

  const [latestRoadmap] = await db
    .select()
    .from(roadmapsTable)
    .where(eq(roadmapsTable.userId, userId))
    .orderBy(desc(roadmapsTable.createdAt))
    .limit(1);

  const connections = await db
    .select()
    .from(connectionsTable)
    .where(eq(connectionsTable.userId, userId));

  const applications = await db
    .select()
    .from(referralApplicationsTable)
    .where(eq(referralApplicationsTable.userId, userId));

  const interviews = await db
    .select()
    .from(interviewSessionsTable)
    .where(eq(interviewSessionsTable.userId, userId));

  const completedInterviews = interviews.filter(i => i.status === "completed");

  let roadmapProgress: number | null = null;
  let roadmapRole: string | null = null;
  if (latestRoadmap) {
    const steps = latestRoadmap.steps as RoadmapStep[];
    const completed = steps.filter(s => s.completed).length;
    roadmapProgress = steps.length > 0 ? Math.round((completed / steps.length) * 100) : 0;
    roadmapRole = latestRoadmap.role;
  }

  const recentActivity: { type: string; description: string; timestamp: string }[] = [];

  if (latestResume) {
    recentActivity.push({
      type: "resume",
      description: `Resume analyzed — Score: ${latestResume.score}/100`,
      timestamp: latestResume.createdAt.toISOString(),
    });
  }
  if (latestRoadmap) {
    recentActivity.push({
      type: "roadmap",
      description: `Learning roadmap generated for ${latestRoadmap.role}`,
      timestamp: latestRoadmap.createdAt.toISOString(),
    });
  }
  if (connections.length > 0) {
    const latest = connections[connections.length - 1];
    recentActivity.push({
      type: "connection",
      description: "Connected with a mentor",
      timestamp: latest.createdAt.toISOString(),
    });
  }
  if (applications.length > 0) {
    const latest = applications[applications.length - 1];
    recentActivity.push({
      type: "application",
      description: "Applied for a job referral",
      timestamp: latest.appliedAt.toISOString(),
    });
  }

  recentActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  res.json({
    resumeScore: latestResume?.score ?? null,
    roadmapProgress,
    roadmapRole,
    mentorConnections: connections.length,
    jobApplications: applications.length,
    interviewsCompleted: completedInterviews.length,
    skillGaps: latestResume?.skillGaps ?? [],
    recentActivity: recentActivity.slice(0, 5),
  });
});

export default router;
