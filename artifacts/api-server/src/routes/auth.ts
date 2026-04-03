import { Router, type IRouter } from "express";
import crypto from "node:crypto";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { SignupBody, LoginBody } from "@workspace/api-zod";
import { signToken } from "../lib/jwt.js";
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";

const router: IRouter = Router();

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "pathnexis_salt").digest("hex");
}

function serializeUser(user: typeof usersTable.$inferSelect) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    college: user.college,
    year: user.year,
    skills: user.skills,
    createdAt: user.createdAt.toISOString(),
  };
}

router.post("/auth/signup", async (req, res): Promise<void> => {
  const parsed = SignupBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { name, email, password, college, year, skills } = parsed.data;

  const existing = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (existing.length > 0) {
    res.status(409).json({ error: "Email already in use" });
    return;
  }

  const passwordHash = hashPassword(password);
  const [user] = await db.insert(usersTable).values({
    name,
    email,
    passwordHash,
    college: college ?? null,
    year: year ?? null,
    skills: skills ?? [],
  }).returning();

  const token = signToken({ userId: user.id, email: user.email });
  res.status(201).json({ token, user: serializeUser(user) });
});

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { email, password } = parsed.data;
  const passwordHash = hashPassword(password);

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (!user || user.passwordHash !== passwordHash) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const token = signToken({ userId: user.id, email: user.email });
  res.json({ token, user: serializeUser(user) });
});

router.get("/auth/me", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!));
  if (!user) {
    res.status(401).json({ error: "User not found" });
    return;
  }
  res.json(serializeUser(user));
});

export default router;
