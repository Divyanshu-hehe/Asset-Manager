import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, resumesTable } from "@workspace/db";
import { AnalyzeResumeBody } from "@workspace/api-zod";
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";

const router: IRouter = Router();

function mockAnalyzeResume(content: string, targetRole?: string | null) {
  const wordCount = content.split(/\s+/).length;
  const hasProjects = /project/i.test(content);
  const hasSkills = /skill/i.test(content);
  const hasExperience = /experience|intern|work/i.test(content);
  const hasEducation = /education|university|college|degree/i.test(content);
  const hasMetrics = /\d+%|\d+x|\$\d+/i.test(content);

  let score = 40;
  if (wordCount > 200) score += 10;
  if (hasProjects) score += 10;
  if (hasSkills) score += 10;
  if (hasExperience) score += 10;
  if (hasEducation) score += 10;
  if (hasMetrics) score += 10;
  score = Math.min(score, 95);

  const suggestions = [];
  const strengths = [];
  const skillGaps = [];

  if (!hasMetrics) suggestions.push("Add quantifiable achievements (e.g., improved performance by 30%)");
  if (!hasProjects) suggestions.push("Include a dedicated Projects section with 2-3 key projects");
  if (wordCount < 300) suggestions.push("Expand your resume with more detailed descriptions");
  suggestions.push("Use strong action verbs at the start of each bullet point");
  suggestions.push("Tailor your resume keywords to match job descriptions");

  if (hasExperience) strengths.push("Work experience section is well-structured");
  if (hasEducation) strengths.push("Education background is clearly presented");
  if (hasSkills) strengths.push("Skills section helps with ATS screening");
  if (hasProjects) strengths.push("Projects demonstrate practical application of skills");

  const role = targetRole?.toLowerCase() ?? "";
  if (role.includes("frontend") || role.includes("react")) {
    skillGaps.push("TypeScript proficiency", "React performance optimization", "Testing (Jest/Cypress)");
  } else if (role.includes("data") || role.includes("ml")) {
    skillGaps.push("Machine learning frameworks (TensorFlow/PyTorch)", "SQL optimization", "Data visualization");
  } else if (role.includes("backend") || role.includes("node")) {
    skillGaps.push("System design", "Database indexing", "API security best practices");
  } else {
    skillGaps.push("Cloud services (AWS/GCP)", "CI/CD pipelines", "System design fundamentals");
  }

  return { score, suggestions, strengths, skillGaps };
}

router.post("/resume/analyze", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const parsed = AnalyzeResumeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { content, targetRole } = parsed.data;
  const analysis = mockAnalyzeResume(content, targetRole);

  const [resume] = await db.insert(resumesTable).values({
    userId: req.userId!,
    content,
    targetRole: targetRole ?? null,
    score: analysis.score,
    suggestions: analysis.suggestions,
    strengths: analysis.strengths,
    skillGaps: analysis.skillGaps,
  }).returning();

  res.json({
    id: resume.id,
    score: resume.score,
    suggestions: resume.suggestions,
    strengths: resume.strengths,
    skillGaps: resume.skillGaps,
    targetRole: resume.targetRole,
    createdAt: resume.createdAt.toISOString(),
  });
});

router.get("/resume/latest", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const [resume] = await db
    .select()
    .from(resumesTable)
    .where(eq(resumesTable.userId, req.userId!))
    .orderBy(desc(resumesTable.createdAt))
    .limit(1);

  if (!resume) {
    res.status(404).json({ error: "No resume found" });
    return;
  }

  res.json({
    id: resume.id,
    score: resume.score,
    suggestions: resume.suggestions,
    strengths: resume.strengths,
    skillGaps: resume.skillGaps,
    targetRole: resume.targetRole,
    createdAt: resume.createdAt.toISOString(),
  });
});

export default router;
