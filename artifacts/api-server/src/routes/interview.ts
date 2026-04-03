import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, interviewSessionsTable } from "@workspace/db";
import { StartInterviewBody, SubmitInterviewBody } from "@workspace/api-zod";
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";

const router: IRouter = Router();

type InterviewQuestion = { id: number; question: string; category: string };

function getQuestionsForRole(role: string, difficulty: string): InterviewQuestion[] {
  const baseQuestions: Record<string, InterviewQuestion[]> = {
    frontend: [
      { id: 1, question: "Explain the difference between `var`, `let`, and `const` in JavaScript.", category: "Technical" },
      { id: 2, question: "What is the virtual DOM in React and how does it improve performance?", category: "Technical" },
      { id: 3, question: "Describe how CSS specificity works and how you resolve conflicts.", category: "Technical" },
      { id: 4, question: "Walk me through how you would optimize the performance of a slow React application.", category: "Problem Solving" },
      { id: 5, question: "Tell me about a time you had to deliver a feature under tight deadline. How did you prioritize?", category: "Behavioral" },
    ],
    backend: [
      { id: 1, question: "What is the difference between SQL and NoSQL databases? When would you use each?", category: "Technical" },
      { id: 2, question: "Explain REST principles and how you design a RESTful API.", category: "Technical" },
      { id: 3, question: "How do you handle database transactions and what problems do they solve?", category: "Technical" },
      { id: 4, question: "Design a URL shortening service like bit.ly. Walk me through your architecture.", category: "System Design" },
      { id: 5, question: "Describe a challenging bug you debugged in production and how you resolved it.", category: "Behavioral" },
    ],
    data: [
      { id: 1, question: "Explain the difference between supervised and unsupervised learning with examples.", category: "Technical" },
      { id: 2, question: "How would you handle a highly imbalanced dataset in a classification problem?", category: "Technical" },
      { id: 3, question: "Walk me through cleaning and preparing a messy real-world dataset.", category: "Problem Solving" },
      { id: 4, question: "Design a recommendation system for an e-commerce platform.", category: "System Design" },
      { id: 5, question: "Describe a data analysis project that drove a significant business decision.", category: "Behavioral" },
    ],
    general: [
      { id: 1, question: "Tell me about yourself and your journey into software development.", category: "Behavioral" },
      { id: 2, question: "What is your greatest technical achievement, and what did you learn from it?", category: "Behavioral" },
      { id: 3, question: "How do you approach learning a new technology you've never worked with?", category: "Behavioral" },
      { id: 4, question: "Describe a conflict with a teammate and how you resolved it.", category: "Behavioral" },
      { id: 5, question: "Where do you see yourself in 3-5 years professionally?", category: "Behavioral" },
    ],
  };

  const roleLower = role.toLowerCase();
  let questions = baseQuestions.general;
  if (roleLower.includes("front") || roleLower.includes("react") || roleLower.includes("ui")) {
    questions = baseQuestions.frontend;
  } else if (roleLower.includes("back") || roleLower.includes("node") || roleLower.includes("api")) {
    questions = baseQuestions.backend;
  } else if (roleLower.includes("data") || roleLower.includes("ml") || roleLower.includes("machine")) {
    questions = baseQuestions.data;
  }

  if (difficulty === "easy") return questions.slice(0, 3);
  if (difficulty === "hard") return questions;
  return questions.slice(0, 4);
}

function generateFeedback(answers: { questionId: number; answer: string }[]) {
  const questionFeedback = answers.map(({ questionId, answer }) => {
    const wordCount = answer.split(/\s+/).filter(Boolean).length;
    let score = 50;
    if (wordCount >= 30) score += 20;
    if (wordCount >= 60) score += 10;
    if (/example|specifically|because|result|impact/i.test(answer)) score += 10;
    if (wordCount < 10) score -= 20;
    score = Math.min(Math.max(score, 20), 95);

    let feedback = "";
    if (score >= 80) feedback = "Excellent response. Clear, specific, and well-structured.";
    else if (score >= 60) feedback = "Good response with room to add more specific examples and outcomes.";
    else if (score >= 40) feedback = "Basic response — try to add concrete examples and quantify your impact.";
    else feedback = "This answer needs more depth. Structure it with: Situation, Task, Action, Result.";

    return { questionId, score, feedback };
  });

  const avgScore = Math.round(questionFeedback.reduce((sum, q) => sum + q.score, 0) / questionFeedback.length);

  const strengths = [];
  const improvements = [];

  if (avgScore >= 70) strengths.push("Strong overall communication and clarity");
  if (answers.some(a => a.answer.length > 200)) strengths.push("Provides detailed and comprehensive answers");
  if (answers.some(a => /example|specifically/i.test(a.answer))) strengths.push("Uses concrete examples to support points");

  if (avgScore < 80) improvements.push("Use the STAR method (Situation, Task, Action, Result) for behavioral questions");
  if (answers.some(a => a.answer.split(/\s+/).length < 30)) improvements.push("Expand on shorter answers with more detail");
  improvements.push("Quantify your impact with numbers and metrics where possible");

  let feedbackText = "";
  if (avgScore >= 80) feedbackText = "Outstanding performance. You demonstrated strong technical knowledge and excellent communication skills. You're ready for senior-level interviews.";
  else if (avgScore >= 65) feedbackText = "Good performance overall. You show solid fundamentals but could strengthen answers with more specific examples and measurable outcomes.";
  else if (avgScore >= 50) feedbackText = "Decent foundation but needs improvement. Focus on structuring your answers clearly and backing claims with real examples.";
  else feedbackText = "Significant room for improvement. Practice explaining your thought process clearly and use the STAR method for behavioral questions.";

  return { overallScore: avgScore, feedback: feedbackText, strengths, improvements, questionFeedback };
}

router.post("/interview/start", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const parsed = StartInterviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { role, difficulty } = parsed.data;
  const questions = getQuestionsForRole(role, difficulty ?? "medium");

  const [session] = await db.insert(interviewSessionsTable).values({
    userId: req.userId!,
    role,
    difficulty: difficulty ?? "medium",
    questions: questions.map(q => ({ ...q, answer: undefined })),
    status: "active",
    strengths: [],
    improvements: [],
    questionFeedback: [],
  }).returning();

  res.json({
    sessionId: session.id,
    role: session.role,
    difficulty: session.difficulty,
    questions,
  });
});

router.post("/interview/submit", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const parsed = SubmitInterviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { sessionId, answers } = parsed.data;

  const [session] = await db.select().from(interviewSessionsTable).where(eq(interviewSessionsTable.id, sessionId));
  if (!session || session.userId !== req.userId) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  const result = generateFeedback(answers);

  await db.update(interviewSessionsTable).set({
    overallScore: result.overallScore,
    feedbackText: result.feedback,
    strengths: result.strengths,
    improvements: result.improvements,
    questionFeedback: result.questionFeedback,
    status: "completed",
    completedAt: new Date(),
  }).where(eq(interviewSessionsTable.id, sessionId));

  res.json({
    sessionId,
    overallScore: result.overallScore,
    feedback: result.feedback,
    strengths: result.strengths,
    improvements: result.improvements,
    questionFeedback: result.questionFeedback,
  });
});

export default router;
