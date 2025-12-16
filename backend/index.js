import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import signPdfRoute from "./routes/signPdf.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.use("/sign-pdf", signPdfRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
