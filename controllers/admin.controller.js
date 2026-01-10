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


export const getEnrollments = async (req, res) => {
  try {
    const snapshot = await db.collection("enrollments")
      .orderBy("createdAt", "desc")
      .get();

    const enrollments = snapshot.docs.map(doc => ({
      id: doc.id,
      email: doc.data().email,
      accessCode: doc.data().accessCode,
      createdAt: doc.data().createdAt.toDate().toISOString(),
    }));

    res.json(enrollments);
  } catch (error) {
    console.error("Get enrollments error:", error);
    res.status(500).json({ message: "Failed to get enrollments" });
  }
};


export const unenrollStudent = async (req, res) => {
  const { id, email } = req.body; // Need both enrollment ID and email

  if (!id || !email) {
    return res.status(400).json({ message: "Enrollment ID and email required" });
  }

  try {
    // Delete from enrollments
    await db.collection("enrollments").doc(id).delete();

    // Delete from candidates (if exists)
    const candidateRef = db.collection("candidates").doc(email.toLowerCase().trim());
    const candidateDoc = await candidateRef.get();
    if (candidateDoc.exists) {
      await candidateRef.delete();
    }

    res.json({ message: "Student completely removed from system" });
  } catch (error) {
    console.error("Complete unenroll error:", error);
    res.status(500).json({ message: "Failed to remove student" });
  }
};




export const getCandidateResult = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  try {
    const candidateDoc = await db.collection("candidates").doc(email.toLowerCase().trim()).get();

    if (!candidateDoc.exists) {
      return res.json({ message: "No attempts yet" });
    }

    const data = candidateDoc.data();
    res.json({
      name: data.name,
      passed: data.passed,
      lastScore: data.lastScore,
      lastAttemptDate: data.lastAttemptDate.toDate().toISOString(),
    });
  } catch (error) {
    console.error("Get result error:", error);
    res.status(500).json({ message: "Failed to get result" });
  }
};

