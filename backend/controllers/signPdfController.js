// controllers/signPdfController.js
const fs = require("fs");
const path = require("path");

const { signPdf } = require("../services/pdfService");
const { generateHash } = require("../services/hashService");
const Audit = require("../models/Audit");

async function signPdfController(req, res) {
  try {
    const { pdfId, signatureImage, coordinates } = req.body;

    const pdfPath = path.join("pdfs", `${pdfId}.pdf`);
    const originalPdfBuffer = fs.readFileSync(pdfPath);

    const originalHash = generateHash(originalPdfBuffer);

    const signedPdfBytes = await signPdf({
      pdfPath,
      signatureImage,
      coordinates
    });

    const signedHash = generateHash(signedPdfBytes);

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
    console.error(err);
    res.status(500).json({ error: "Signing failed" });
  }
}

module.exports = { signPdfController };
