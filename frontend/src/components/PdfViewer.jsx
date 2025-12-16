// src/components/PdfViewer.jsx
import { useRef, useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import DraggableField from "./DraggableField";
import { pxToRatio } from "../utils/coordinate";

export default function PdfViewer({ pdfUrl }) {
  const containerRef = useRef(null);
  const [fields, setFields] = useState([]);
  const [pdfSize, setPdfSize] = useState({ width: 0, height: 0 });

  const onDrop = (e) => {
    e.preventDefault();

    const type = e.dataTransfer.getData("fieldType");
    const rect = containerRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ratios = pxToRatio(x, y, rect.width, rect.height);

    setFields((prev) => [
      ...prev,
      {
        id: Date.now(),
        type,
        page: 1,
        ...ratios,
        widthRatio: 0.2,
        heightRatio: 0.08
      }
    ]);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(() => {
      const rect = containerRef.current.getBoundingClientRect();
      setPdfSize({ width: rect.width, height: rect.height });
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      style={{
        position: "relative",
        width: "100%",
        border: "1px solid #ccc"
      }}
    >
      <Document file={pdfUrl}>
        <Page pageNumber={1} width={pdfSize.width} />
      </Document>

      {fields.map((f) => (
        <DraggableField
          key={f.id}
          field={f}
          pdfWidth={pdfSize.width}
          pdfHeight={pdfSize.height}
        />
      ))}
    </div>
  );
}
