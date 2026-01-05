import { getRandomQuestions } from "../services/question.service.js";
import { scoreExam } from "../services/exam.service.js";
import { signToken } from "../utils/jwt.js";
import { generateCertificate } from "../services/certificate.service.js";
import { db } from "../config/firebase.js";
import { v4 as uuid } from "uuid";
import admin from "firebase-admin";

const activeExams = new Map();

export const startExam = async (req, res) => {
  let normalizedEmail;
  let accessCode;

  // FIRST-TIME START (email + accessCode)
  if (req.body.email && req.body.accessCode) {
    normalizedEmail = req.body.email.toLowerCase().trim();
    accessCode = req.body.accessCode.toUpperCase().trim();

    const snapshot = await db
      .collection("enrollments")
      .where("email", "==", normalizedEmail)
      .where("accessCode", "==", accessCode)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res
        .status(403)
        .json({ message: "Invalid email or access code" });
    }
  } else {
    // RETRY FLOW (token-based)
    if (!req.user || req.user.role !== "candidate") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    normalizedEmail = req.user.email;
  }

  const candidateRef = db.collection("candidates").doc(normalizedEmail);
  const candidateDoc = await candidateRef.get();
  const attempts = candidateDoc.exists ? candidateDoc.data().attempts || 0 : 0;

  if (attempts >= 3) {
    return res.status(403).json({
      message: "Maximum attempts reached",
    });
  }

  const questions = getRandomQuestions(30);
  const sessionId = uuid();

  activeExams.set(sessionId, {
    questions,
    email: normalizedEmail,
  });

  const token = signToken({
    email: normalizedEmail,
    role: "candidate",
  });

  res.json({
    token,
    sessionId,
    questions: questions.map(({ correctAnswer, ...q }) => q),
  });
};


export const submitExam = async (req, res) => {
  const { answers, name, sessionId } = req.body;
  if (!sessionId || !answers || !name) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const examData = activeExams.get(sessionId);
  if (!examData) {
    return res.status(400).json({ message: "Invalid or expired session" });
  }

  const { questions, email } = examData;

  // Cleanup early
  activeExams.delete(sessionId);

  const result = scoreExam(questions, answers);

  const candidateRef = db.collection("candidates").doc(email);
  await candidateRef.set(
    {
      attempts: admin.firestore.FieldValue.increment(1),
      lastScore: result.percentage,
      lastAttemptDate: new Date(),
      name,
      passed: result.percentage >= 80,
    },
    { merge: true }
  );

  const updated = await candidateRef.get();
  result.attempts = updated.data().attempts;

  if (result.percentage >= 80) {
    const { doc, id } = generateCertificate(name);
    await candidateRef.update({ certificateId: id });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=AML_CFT_Certificate_${name}.pdf`
    );

    // Handle stream errors
    doc.on("error", (err) => {
      console.error("PDF stream error:", err);
      if (!res.headersSent) res.status(500).end();
      else res.end();
    });

    doc.pipe(res);
    doc.end();
  } else {
    res.json(result);
  }
};