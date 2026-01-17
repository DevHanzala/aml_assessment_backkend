import nodemailer from "nodemailer";

// Configure the email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send enrollment email with access code and start link
export const sendEnrollmentEmail = async (email, accessCode) => {
  const startLink = `${process.env.FRONTEND_URL}/start?email=${encodeURIComponent(email)}&code=${accessCode}`;

  await transporter.sendMail({
    from: `"AML/CFT Exam" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your AML/CFT Certification Exam Access",
    html: `
      <h2>Welcome to the AML/CFT Certification Exam</h2>
      <p>You have been enrolled to take the exam.</p>
      <p><strong>Access Code: ${accessCode}</strong></p>
      <p>Click the link below to start your exam:</p>
      <p>
        <a href="${startLink}" style="background:#007bff;color:white;padding:12px 24px;text-decoration:none;border-radius:5px;display:inline-block;font-size:16px;">
          Start Exam Now
        </a>
      </p>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p><strong>${startLink}</strong></p>
      <p>You have up to 3 attempts. Good luck!</p>
      <hr>
      <small>This exam is running on local development. Use the full link above.</small>
    `,
  });
};