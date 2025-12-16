// models/Audit.js
const mongoose = require("mongoose");

const auditSchema = new mongoose.Schema(
  {
    pdfId: String,
    originalHash: String,
    signedHash: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Audit", auditSchema);
