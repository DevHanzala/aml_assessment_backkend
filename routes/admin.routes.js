// routes/admin.routes.js
import express from "express";
import { adminLogin, enrollStudent } from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/login", adminLogin);
router.post("/enroll", enrollStudent); // New endpoint

export default router;