import Sidebar from "./Sidebar";
import PdfViewer from "./PdfViewer";
import { signPdf } from "../utils/api";

export default function Editor() {
  const handleSign = async (field) => {
    try {
      const payload = {
        pdfId: "sample",
        signatureImage: field.signatureBase64, // later from canvas
        coordinates: {
          page: field.page,
          xRatio: field.xRatio,
          yRatio: field.yRatio,
          widthRatio: field.widthRatio,
          heightRatio: field.heightRatio
        }
      };

      const result = await signPdf(payload);

      window.open(
        `${import.meta.env.VITE_BACKEND_URL}${result.url}`,
        "_blank"
      );
    } catch (err) {
      alert("Signing failed");
      console.error(err);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: "220px" }}>
        <Sidebar />
      </div>

      <div style={{ flex: 1, padding: "10px" }}>
        <PdfViewer pdfUrl="/sample.pdf" onSign={handleSign} />
      </div>
    </div>
  );
}
