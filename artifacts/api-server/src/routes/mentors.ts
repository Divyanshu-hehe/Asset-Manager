import { Router, type IRouter } from "express";
import { eq, like, SQL } from "drizzle-orm";
import { db, mentorsTable, connectionsTable } from "@workspace/db";
import { ListMentorsQueryParams, GetMentorParams, ConnectMentorParams } from "@workspace/api-zod";
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";

const router: IRouter = Router();

function serializeMentor(mentor: typeof mentorsTable.$inferSelect) {
  return {
    id: mentor.id,
    name: mentor.name,
    title: mentor.title,
    company: mentor.company,
    domain: mentor.domain,
    college: mentor.college,
    experience: mentor.experience,
    bio: mentor.bio,
    skills: mentor.skills,
    avatarUrl: mentor.avatarUrl,
    linkedinUrl: mentor.linkedinUrl,
    sessionsCount: mentor.sessionsCount,
    rating: mentor.rating,
  };
}

router.get("/mentors", async (req, res): Promise<void> => {
  const query = ListMentorsQueryParams.safeParse(req.query);
  let conditions: SQL[] = [];

  if (query.success && query.data.domain) {
    conditions.push(eq(mentorsTable.domain, query.data.domain));
  }

  const mentors = conditions.length > 0
    ? await db.select().from(mentorsTable).where(conditions[0])
    : await db.select().from(mentorsTable);

  res.json(mentors.map(serializeMentor));
});

router.get("/mentors/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [mentor] = await db.select().from(mentorsTable).where(eq(mentorsTable.id, id));
  if (!mentor) {
    res.status(404).json({ error: "Mentor not found" });
    return;
  }

  res.json(serializeMentor(mentor));
});

router.post("/mentors/:id/connect", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [connection] = await db.insert(connectionsTable).values({
    userId: req.userId!,
    mentorId: id,
    status: "pending",
  }).returning();

  res.json({
    id: connection.id,
    mentorId: connection.mentorId,
    userId: connection.userId,
    status: connection.status,
    createdAt: connection.createdAt.toISOString(),
  });
});

export default router;
