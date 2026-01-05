import PDFDocument from "pdfkit";
import { v4 as uuid } from "uuid";
import path from "path";

export const generateCertificate = (name) => {
  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
  });
  const id = uuid();

  // Optional: add a top logo if you have one
  // doc.image(path.join(process.cwd(), "assets/logo.png"), 220, 40, { width: 150 });

  // Draw border
  doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
    .lineWidth(2)
    .strokeColor("#1E3A8A") // Blue border
    .stroke();

  doc.moveDown(3);

  // Title
  doc
    .fillColor("#1E3A8A")
    .fontSize(30)
    .font("Helvetica-Bold")
    .text("AML/CFT Certification", { align: "center" });

  doc.moveDown(2);

  // Awarded to
  doc
    .fillColor("#000000")
    .fontSize(20)
    .font("Helvetica")
    .text("This certificate is proudly presented to", { align: "center" });

  doc.moveDown(1);

  doc
    .fontSize(26)
    .font("Helvetica-Bold")
    .text(name, { align: "center" });

  doc.moveDown(2);

  // Achievement statement
  doc
    .fontSize(16)
    .font("Helvetica")
    .text("For successfully passing the AML/CFT Certification Exam.", { align: "center" });

  doc.moveDown(3);

  // Certificate info: ID and Date
  doc
    .fontSize(12)
    .font("Helvetica-Oblique")
    .fillColor("#555555")
    .text(`Certificate ID: ${id}`, { align: "left" })
    .text(`Date of Issue: ${new Date().toDateString()}`, { align: "left" });

  // Optional signature line
  doc
    .moveDown(4)
    .strokeColor("#000000")
    .lineWidth(1)
    .moveTo(350, doc.y)
    .lineTo(550, doc.y)
    .stroke();

  doc
    .fontSize(12)
    .fillColor("#000000")
    .text("Authorized Signatory", 350, doc.y + 5);

  doc.end();

  return { doc, id };
};
