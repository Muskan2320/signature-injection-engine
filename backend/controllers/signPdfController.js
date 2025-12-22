// controllers/signPdfController.js
const fs = require("fs");
const path = require("path");

const { signPdf } = require("../services/pdfService");
const { generateHash } = require("../services/hashService");
const Audit = require("../models/Audit");

async function signPdfController(req, res) {
  try {
    const { pdfId, fields } = req.body;

    if (!fields || fields.length === 0) {
      return res.status(400).json({ error: "No fields provided" });
    }

    const pdfPath = path.join("pdfs", `${pdfId}.pdf`);
    const originalPdfBuffer = fs.readFileSync(pdfPath);

    const originalHash = generateHash(originalPdfBuffer);

    // ⬇️ Convert field → coordinates
    const signatureField = fields.find(f => f.type === "signature");

    if (!signatureField) {
      return res.status(400).json({ error: "No signature field found" });
    }

    const signedPdfBytes = await signPdf({
      pdfPath,
      coordinates: signatureField
    });

    const signedHash = generateHash(signedPdfBytes);

    const outputPath = path.join("signed", `${pdfId}-signed.pdf`);
    fs.mkdirSync("signed", { recursive: true });
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
    console.error("SIGN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
}