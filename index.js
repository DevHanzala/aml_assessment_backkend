import "dotenv/config"; // MUST be first line

import express from "express";
import cors from "cors";
import adminRoutes from "./routes/admin.routes.js";
import examRoutes from "./routes/exam.routes.js";

// Initialize Firebase AFTER env loaded
import "./config/firebase.js";

const app = express();

/* =======================
   CORS CONFIG (PRODUCTION SAFE)
======================= */
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://aml-assessment-frontend.vercel.app",
    credentials: true,
  })
);

app.use(express.json());

/* =======================
   HOME / HEALTH ROUTES
======================= */

// Home route (sanity check)
app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "AML/CFT Backend is running",
    environment: process.env.NODE_ENV || "development",
  });
});

// Health / logs route (safe for production)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    uptime: `${process.uptime().toFixed(2)}s`,
    timestamp: new Date().toISOString(),
    frontendAllowed:
      process.env.FRONTEND_URL || "https://aml-assessment-frontend.vercel.app",
  });
});

/* =======================
   API ROUTES
======================= */
app.use("/api/admin", adminRoutes);
app.use("/api/exam", examRoutes);

/* =======================
   SERVER START
======================= */
const port = process.env.PORT || 5000;

app.listen(port, () => {
  // console.log("=================================");
  console.log(`🚀 Backend running on port ${port}`);
  // console.log(
  //   `🌐 Frontend allowed: ${
  //     process.env.FRONTEND_URL || "https://aml-assessment-frontend.vercel.app"
  //   }`
  // );
  // console.log("=================================");
});
