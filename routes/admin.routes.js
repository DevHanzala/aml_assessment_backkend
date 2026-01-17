import express from "express";
import { adminLogin, enrollStudent, getEnrollments, unenrollStudent, getCandidateResult } from "../controllers/admin.controller.js";

const router = express.Router();

// Admin login and student management routes
router.post("/login", adminLogin); // Admin login
router.post("/enroll", enrollStudent); // Enroll a new student
router.get("/enrollments", getEnrollments); // New: Get all enrollments
router.post("/unenroll", unenrollStudent); // New: Unenroll student
router.post("/result", getCandidateResult); // New: Get candidate result

export default router;