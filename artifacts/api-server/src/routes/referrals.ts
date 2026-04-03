import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, referralsTable, referralApplicationsTable } from "@workspace/db";
import { ListReferralsQueryParams } from "@workspace/api-zod";
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";

const router: IRouter = Router();

function serializeReferral(referral: typeof referralsTable.$inferSelect) {
  return {
    id: referral.id,
    title: referral.title,
    company: referral.company,
    domain: referral.domain,
    location: referral.location,
    salary: referral.salary,
    description: referral.description,
    skills: referral.skills,
    referredBy: referral.referredBy,
    referrerTitle: referral.referrerTitle,
    postedAt: referral.createdAt.toISOString(),
    deadline: referral.deadline,
    applicantsCount: referral.applicantsCount,
  };
}

router.get("/referrals", async (req, res): Promise<void> => {
  const query = ListReferralsQueryParams.safeParse(req.query);

  const referrals = query.success && query.data.domain
    ? await db.select().from(referralsTable).where(eq(referralsTable.domain, query.data.domain))
    : await db.select().from(referralsTable);

  res.json(referrals.map(serializeReferral));
});

router.post("/referrals/:id/apply", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [referral] = await db.select().from(referralsTable).where(eq(referralsTable.id, id));
  if (!referral) {
    res.status(404).json({ error: "Referral not found" });
    return;
  }

  const [application] = await db.insert(referralApplicationsTable).values({
    userId: req.userId!,
    referralId: id,
    status: "pending",
  }).returning();

  await db.update(referralsTable)
    .set({ applicantsCount: referral.applicantsCount + 1 })
    .where(eq(referralsTable.id, id));

  res.json({
    id: application.id,
    referralId: application.referralId,
    userId: application.userId,
    status: application.status,
    appliedAt: application.appliedAt.toISOString(),
    referral: serializeReferral(referral),
  });
});

router.get("/referrals/my-applications", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const applications = await db
    .select()
    .from(referralApplicationsTable)
    .where(eq(referralApplicationsTable.userId, req.userId!));

  const result = await Promise.all(applications.map(async (app) => {
    const [referral] = await db.select().from(referralsTable).where(eq(referralsTable.id, app.referralId));
    return {
      id: app.id,
      referralId: app.referralId,
      userId: app.userId,
      status: app.status,
      appliedAt: app.appliedAt.toISOString(),
      referral: referral ? serializeReferral(referral) : null,
    };
  }));

  res.json(result.filter(a => a.referral !== null));
});

export default router;
