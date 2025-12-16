const fs = require("fs");
const { PDFDocument } = require("pdf-lib");

async function signPdf({ pdfPath, signatureImage, coordinates }) {
  const existingPdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const page = pdfDoc.getPages()[coordinates.page - 1];
  const pageWidth = page.getWidth();
  const pageHeight = page.getHeight();

  const pngImage = await pdfDoc.embedPng(signatureImage);
  const imgDims = pngImage.scale(1);

  const boxWidth = coordinates.widthRatio * pageWidth;
  const boxHeight = coordinates.heightRatio * pageHeight;

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

  const x = coordinates.xRatio * pageWidth;
  const y =
    pageHeight -
    coordinates.yRatio * pageHeight -
    boxHeight;

  const offsetX = x + (boxWidth - drawWidth) / 2;
  const offsetY = y + (boxHeight - drawHeight) / 2;

  page.drawImage(pngImage, {
    x: offsetX,
    y: offsetY,
    width: drawWidth,
    height: drawHeight
  });

  return await pdfDoc.save();
}

module.exports = { signPdf };
