const fs = require("fs");
const path = require("path");

const { signPdf } = require("../services/pdfService");
const { generateHash } = require("../services/hashService");
const Audit = require("../models/Audit");

async function signPdfController(req, res) {
  try {
    const { pdfId, fields } = req.body;

    if (!pdfId || !Array.isArray(fields) || fields.length === 0) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    const pdfPath = path.join("pdfs", `${pdfId}.pdf`);
    const originalPdfBuffer = fs.readFileSync(pdfPath);
    const originalHash = generateHash(originalPdfBuffer);

    const signatureImage = fs.readFileSync(
      path.join(__dirname, "../assets/sample-signature.png")
    );

    const signedPdfBytes = await signPdf({
      pdfPath,
      signatureImage,
      fields
    });

    const signedHash = generateHash(signedPdfBytes);

    fs.mkdirSync("signed", { recursive: true });
    const outputPath = path.join("signed", `${pdfId}-signed.pdf`);
    fs.writeFileSync(outputPath, signedPdfBytes);

    await Audit.create({
      pdfId,
      originalHash,
      signedHash
    });

    res.json({
      success: true,
      url: `/signed/${pdfId}-signed.pdf`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { signPdfController };
