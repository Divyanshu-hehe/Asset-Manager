import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import resumeRouter from "./resume.js";
import roadmapRouter from "./roadmap.js";
import mentorsRouter from "./mentors.js";
import referralsRouter from "./referrals.js";
import interviewRouter from "./interview.js";
import dashboardRouter from "./dashboard.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(resumeRouter);
router.use(roadmapRouter);
router.use(mentorsRouter);
router.use(referralsRouter);
router.use(interviewRouter);
router.use(dashboardRouter);

export default router;
