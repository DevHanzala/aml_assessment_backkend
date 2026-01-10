import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "fs";
import path from "path";

const TEMPLATE_PATH = path.join(process.cwd(), "assets", "certificate_template.pdf");

// Load once at startup
if (!fs.existsSync(TEMPLATE_PATH)) {
  throw new Error("Certificate template not found at " + TEMPLATE_PATH);
}

const templateBytesCache = fs.readFileSync(TEMPLATE_PATH);

export const generateCertificate = async (name) => {
  const pdfDoc = await PDFDocument.load(templateBytesCache);

  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique);
  const firstPage = pdfDoc.getPages()[0];

  const pageWidth = firstPage.getWidth();
  const fontSize = 45;

  const textWidth = font.widthOfTextAtSize(name, fontSize);
  const x = (pageWidth - textWidth) / 2;
  const y = 300; // blank area from your template

  firstPage.drawText(name, {
    x,
    y,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });

  return await pdfDoc.save();
};
