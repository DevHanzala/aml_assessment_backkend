import 'dotenv/config'; // ← MUST be first line — loads .env immediately

import express from "express";
import cors from "cors";
import adminRoutes from "./routes/admin.routes.js";
import examRoutes from "./routes/exam.routes.js";

// Initialize Firebase AFTER env loaded
import "./config/firebase.js";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use("/api/exam", examRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 Backend running on port ${port}`);
  console.log(`🌐 Frontend allowed: ${process.env.FRONTEND_URL || "http://localhost:5173"}`);
});