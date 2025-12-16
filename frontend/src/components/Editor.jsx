// src/components/Editor.jsx
import Sidebar from "./Sidebar";
import PdfViewer from "./PdfViewer";

export default function Editor() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: "220px" }}>
        <Sidebar />
      </div>

      <div style={{ flex: 1, padding: "10px" }}>
        <PdfViewer pdfUrl="/sample.pdf" />
      </div>
    </div>
  );
}
