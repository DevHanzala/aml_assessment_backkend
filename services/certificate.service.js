import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "fs";
import path from "path";

// Preload template once to improve performance
let templateBytesCache = null;

export const generateCertificate = async (name) => {
  const templatePath = path.join(process.cwd(), "assets", "certificate_template.pdf");

  if (!templateBytesCache) {
    if (!fs.existsSync(templatePath)) {
      console.error("Certificate template not found at:", templatePath);
      throw new Error("Certificate template not found");
    }
    templateBytesCache = fs.readFileSync(templatePath);
    console.log("Template loaded, size:", templateBytesCache.length);
  }

  const pdfDoc = await PDFDocument.load(templateBytesCache);
const font = await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique);


  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  const pageWidth = firstPage.getWidth();
  const fontSize = 45;

  // Calculate horizontal center
  const textWidth = font.widthOfTextAtSize(name, fontSize);
  const x = (pageWidth - textWidth) / 2;

  // Adjust Y based on your template's blank area
  const y = 300;

  firstPage.drawText(name, {
    x,
    y,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();
  console.log("Generated PDF size:", pdfBytes.length);

  return pdfBytes;
};
