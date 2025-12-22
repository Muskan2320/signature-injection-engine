const fs = require("fs");
const path = require("path");

const { signPdf } = require("../services/pdfService");
const { generateHash } = require("../services/hashService");
const Audit = require("../models/Audit");

async function signPdfController(req, res) {
  try {
    const { pdfId, fields } = req.body;

    const signatureField = fields.find(f => f.type === "signature");

    const coordinates = {
      page: signatureField.page,
      xRatio: signatureField.xRatio,
      yRatio: signatureField.yRatio,
      widthRatio: signatureField.widthRatio,
      heightRatio: signatureField.heightRatio
    };

    const pdfPath = path.join("pdfs", `${pdfId}.pdf`);
    const originalPdfBuffer = fs.readFileSync(pdfPath);

    const originalHash = generateHash(originalPdfBuffer);

    const signatureImage = fs.readFileSync(
      path.join(__dirname, "../assets/sample-signature.png")
    );

    const signedPdfBytes = await signPdf({
      pdfPath,
      signatureImage,
      coordinates
    });

    const signedHash = generateHash(signedPdfBytes);

    fs.mkdirSync("signed", { recursive: true });
    fs.writeFileSync(
      path.join("signed", `${pdfId}-signed.pdf`),
      signedPdfBytes
    );

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
