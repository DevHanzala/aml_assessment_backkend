import { signToken } from "../utils/jwt.js";
import { db } from "../config/firebase.js";  // ← NOW SAFE AND CLEAN
import { sendEnrollmentEmail } from "../utils/email.js";
import crypto from "crypto";

const generateAccessCode = () => crypto.randomBytes(4).toString("hex").toUpperCase();
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (email !== process.env.ADMIN_EMAIL) {
    return res.status(401).json({ message: "Invalid admin" });
  }

  const match = password === process.env.ADMIN_PASSWORD;
  if (!match) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = signToken({ role: "admin" });
  res.json({ token });
};

export const enrollStudent = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const accessCode = generateAccessCode().toUpperCase();

    // Prevent duplicate enrollment
    const existing = await db
      .collection("enrollments")
      .where("email", "==", normalizedEmail)
      .limit(1)
      .get();

    if (!existing.empty) {
      return res.status(400).json({
        message: "Student already enrolled",
      });
    }

    await db.collection("enrollments").add({
      email: normalizedEmail,
      accessCode,
      createdAt: new Date(),
    });

     sendEnrollmentEmail(normalizedEmail, accessCode);

    res.json({
      message: "Student enrolled and email sent",
      accessCode,
    });
  } catch (error) {
    console.error("Enrollment error:", error);
    res.status(500).json({ message: "Failed to enroll student" });
  }
};
