import express from "express";
import { startExam, submitExam } from "../controllers/exam.controller.js";
import { candidateAuth } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/start", startExam); // Start an exam session
router.post("/submit", candidateAuth, submitExam);  // Submit exam answers
export default router;