const fs = require("fs");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");

async function signPdf({ pdfPath, signatureImage, fields }) {
  const existingPdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  for (const field of fields) {
    const page = pdfDoc.getPages()[field.page - 1];
    const pageWidth = page.getWidth();
    const pageHeight = page.getHeight();

    const boxWidth = field.widthRatio * pageWidth;
    const boxHeight = field.heightRatio * pageHeight;

    const x = field.xRatio * pageWidth;
    const y =
      pageHeight -
      field.yRatio * pageHeight -
      boxHeight;

    if (field.type === "signature") {
      const pngImage = await pdfDoc.embedPng(signatureImage);
      const imgDims = pngImage.scale(1);

      const imageAspect = imgDims.width / imgDims.height;
      const boxAspect = boxWidth / boxHeight;

      let drawWidth, drawHeight;

      if (imageAspect > boxAspect) {
        drawWidth = boxWidth;
        drawHeight = boxWidth / imageAspect;
      } else {
        drawHeight = boxHeight;
        drawWidth = boxHeight * imageAspect;
      }

      const offsetX = x + (boxWidth - drawWidth) / 2;
      const offsetY = y + (boxHeight - drawHeight) / 2;

      page.drawImage(pngImage, {
        x: offsetX,
        y: offsetY,
        width: drawWidth,
        height: drawHeight
      });
    }

    if (field.type === "date" && field.value) {
      page.drawText(field.value, {
        x,
        y: y + boxHeight / 3,
        size: 10,
        font,
        color: rgb(0, 0, 0)
      });
    }
  }

  return await pdfDoc.save();
}

module.exports = { signPdf };
