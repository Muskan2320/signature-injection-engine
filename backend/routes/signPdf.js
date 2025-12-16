// routes/signPdf.js
const express = require("express");
const { signPdfController } = require("../controllers/signPdfController");

const router = express.Router();

router.post("/sign-pdf", signPdfController);

module.exports = router;
