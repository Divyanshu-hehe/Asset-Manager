import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, roadmapsTable, type RoadmapStep } from "@workspace/db";
import { GenerateRoadmapBody, UpdateRoadmapProgressBody } from "@workspace/api-zod";
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";

const router: IRouter = Router();

function generateRoadmapForRole(role: string, currentSkills: string[] = []): RoadmapStep[] {
  const roleMap: Record<string, RoadmapStep[]> = {
    "frontend developer": [
      { skill: "HTML & CSS Fundamentals", description: "Master semantic HTML5 and modern CSS including flexbox and grid", resources: ["MDN Web Docs", "CSS-Tricks", "freeCodeCamp"], completed: false, order: 0 },
      { skill: "JavaScript ES6+", description: "Deep dive into modern JavaScript: async/await, destructuring, modules", resources: ["javascript.info", "Eloquent JavaScript", "You Don't Know JS"], completed: false, order: 1 },
      { skill: "React.js", description: "Build component-based UIs with hooks, context, and state management", resources: ["React Official Docs", "React Query docs", "Scrimba React course"], completed: false, order: 2 },
      { skill: "TypeScript", description: "Add type safety to your JavaScript projects", resources: ["TypeScript Handbook", "Total TypeScript", "Execute Program"], completed: false, order: 3 },
      { skill: "Testing", description: "Write unit and integration tests with Jest and React Testing Library", resources: ["Testing Library docs", "Kent C. Dodds blog", "Vitest docs"], completed: false, order: 4 },
      { skill: "Performance Optimization", description: "Optimize bundle size, rendering, and Core Web Vitals", resources: ["web.dev", "Chrome DevTools", "Lighthouse"], completed: false, order: 5 },
    ],
    "backend developer": [
      { skill: "Node.js & Express", description: "Build RESTful APIs with Node.js and Express framework", resources: ["Node.js docs", "Express docs", "The Odin Project"], completed: false, order: 0 },
      { skill: "Database Design", description: "Master SQL and NoSQL databases, schema design, indexing", resources: ["PostgreSQL docs", "MongoDB University", "Use The Index, Luke"], completed: false, order: 1 },
      { skill: "API Design", description: "REST principles, OpenAPI spec, versioning, and security", resources: ["OpenAPI Specification", "API Design Patterns book", "Postman Learning Center"], completed: false, order: 2 },
      { skill: "Authentication & Security", description: "Implement JWT, OAuth 2.0, and security best practices", resources: ["OWASP Top 10", "JWT.io", "Auth0 docs"], completed: false, order: 3 },
      { skill: "Cloud & DevOps", description: "Deploy to AWS/GCP, CI/CD pipelines, Docker basics", resources: ["AWS Free Tier", "Docker docs", "GitHub Actions"], completed: false, order: 4 },
      { skill: "System Design", description: "Design scalable systems: caching, load balancing, microservices", resources: ["Designing Data-Intensive Applications", "System Design Primer", "ByteByteGo"], completed: false, order: 5 },
    ],
    "data scientist": [
      { skill: "Python for Data Science", description: "NumPy, Pandas, and data manipulation fundamentals", resources: ["Python for Data Analysis", "Kaggle Learn", "Real Python"], completed: false, order: 0 },
      { skill: "Statistics & Probability", description: "Statistical foundations for ML: distributions, hypothesis testing, Bayesian reasoning", resources: ["Think Stats", "Khan Academy Statistics", "StatQuest YouTube"], completed: false, order: 1 },
      { skill: "Machine Learning", description: "Supervised and unsupervised learning algorithms with scikit-learn", resources: ["Hands-On Machine Learning", "fast.ai", "Google ML Crash Course"], completed: false, order: 2 },
      { skill: "Deep Learning", description: "Neural networks, CNNs, and transformers with PyTorch or TensorFlow", resources: ["Deep Learning Specialization", "PyTorch tutorials", "Andrej Karpathy YouTube"], completed: false, order: 3 },
      { skill: "Data Visualization", description: "Communicate insights with Matplotlib, Seaborn, and Tableau", resources: ["Storytelling with Data", "Observable Notebooks", "Seaborn gallery"], completed: false, order: 4 },
      { skill: "SQL & Data Engineering", description: "Query optimization, data pipelines, and warehousing concepts", resources: ["Mode SQL Tutorial", "dbt Learn", "Fundamentals of Data Engineering"], completed: false, order: 5 },
    ],
  };

  const roleLower = role.toLowerCase();
  for (const key of Object.keys(roleMap)) {
    if (roleLower.includes(key) || key.includes(roleLower.split(" ")[0])) {
      const steps = roleMap[key];
      return steps.map(s => ({
        ...s,
        completed: currentSkills.some(cs => cs.toLowerCase().includes(s.skill.toLowerCase().split(" ")[0])),
      }));
    }
  }

  return [
    { skill: "Programming Fundamentals", description: "Strong foundations in algorithms, data structures, and problem-solving", resources: ["LeetCode", "HackerRank", "Cracking the Coding Interview"], completed: false, order: 0 },
    { skill: "Version Control with Git", description: "Collaborative development with Git and GitHub", resources: ["Pro Git book", "GitHub Skills", "Atlassian Git Tutorials"], completed: false, order: 1 },
    { skill: "System Design Basics", description: "Scalability, reliability, and architectural patterns", resources: ["System Design Primer", "Grokking System Design", "ByteByteGo"], completed: false, order: 2 },
    { skill: "Communication & Soft Skills", description: "Technical writing, presentations, and collaborative teamwork", resources: ["Writing for Engineers", "Toastmasters", "The Pragmatic Programmer"], completed: false, order: 3 },
  ];
}

function serializeRoadmap(roadmap: typeof roadmapsTable.$inferSelect) {
  const steps = roadmap.steps as RoadmapStep[];
  const completedCount = steps.filter(s => s.completed).length;
  return {
    id: roadmap.id,
    role: roadmap.role,
    steps,
    completedCount,
    totalCount: steps.length,
    createdAt: roadmap.createdAt.toISOString(),
  };
}

router.post("/roadmap/generate", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const parsed = GenerateRoadmapBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { targetRole, currentSkills } = parsed.data;
  const steps = generateRoadmapForRole(targetRole, currentSkills ?? []);

  const [roadmap] = await db.insert(roadmapsTable).values({
    userId: req.userId!,
    role: targetRole,
    steps,
  }).returning();

  res.json(serializeRoadmap(roadmap));
});

router.get("/roadmap/my", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const [roadmap] = await db
    .select()
    .from(roadmapsTable)
    .where(eq(roadmapsTable.userId, req.userId!))
    .orderBy(desc(roadmapsTable.createdAt))
    .limit(1);

  if (!roadmap) {
    res.status(404).json({ error: "No roadmap found" });
    return;
  }

  res.json(serializeRoadmap(roadmap));
});

router.patch("/roadmap/progress", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const parsed = UpdateRoadmapProgressBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { roadmapId, skillIndex, completed } = parsed.data;

  const [roadmap] = await db.select().from(roadmapsTable).where(eq(roadmapsTable.id, roadmapId));
  if (!roadmap || roadmap.userId !== req.userId) {
    res.status(404).json({ error: "Roadmap not found" });
    return;
  }

  const steps = [...(roadmap.steps as RoadmapStep[])];
  if (skillIndex < 0 || skillIndex >= steps.length) {
    res.status(400).json({ error: "Invalid skill index" });
    return;
  }

  steps[skillIndex] = { ...steps[skillIndex], completed };

  const [updated] = await db.update(roadmapsTable).set({ steps }).where(eq(roadmapsTable.id, roadmapId)).returning();

  res.json(serializeRoadmap(updated));
});

export default router;
