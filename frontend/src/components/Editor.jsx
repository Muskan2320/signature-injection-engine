import { useState } from "react";
import Sidebar from "./Sidebar";
import PdfViewer from "./PdfViewer";

export default function Editor() {
  const [fields, setFields] = useState([]);

  const handleFinalize = async (e) => {
    e?.preventDefault();

    console.log("1️⃣ handleFinalize started");
    console.log("Fields:", fields);

    try {
      const res = await fetch(
        "https://signature-injection-engine-l4z8.onrender.com/api/sign-pdf",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pdfId: "sample", fields }),
        }
      );

      console.log("2️⃣ response received, status:", res.status);

      const text = await res.text();
      console.log("3️⃣ raw response:", text);

      // Try parsing only if JSON
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Response is not JSON");
      }

      console.log("Backend response:", data);

      if (data.url) {
        window.open(
          `https://signature-injection-engine-l4z8.onrender.com${data.url}`,
          "_blank"
        );
      }
    } catch (err) {
      console.error("❌ Finalize failed:", err);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: "220px", padding: "10px" }}>
        <Sidebar />
        <button
          type="button"
          onClick={handleFinalize}
          style={{ zIndex: 9999, position: "relative" }}
        >
          Finalize & Sign
        </button>
      </div>

      <div style={{ flex: 1, padding: "10px" }}>
        <PdfViewer
          pdfUrl="/sample.pdf"
          fields={fields}
          setFields={setFields}
        />
      </div>
    </div>
  );
}
