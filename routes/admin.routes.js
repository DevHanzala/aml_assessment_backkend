import express from "express";
import { adminLogin, enrollStudent, getEnrollments, unenrollStudent, getCandidateResult } from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/login", adminLogin);
router.post("/enroll", enrollStudent);
router.get("/enrollments", getEnrollments); // New: Get all enrollments
router.post("/unenroll", unenrollStudent); // New: Unenroll student
router.post("/result", getCandidateResult); // New: Get candidate result

export default router;