import { useRef, useEffect, useState } from "react";
import DraggableField from "./DraggableField";
import { pxToRatio } from "../utils/coordinate";

export default function PdfViewer({ pdfUrl, fields, setFields }) {
  const containerRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(() => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const onDrop = (e) => {
    e.preventDefault();

    let type = e.dataTransfer.getData("fieldType");
    if (!type) return;

    type = type.toLowerCase();

    if (!containerRef.current) return;

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
        heightRatio: 0.08,
        value:
          type === "date"
            ? new Date().toLocaleDateString()
            : null
      }
    ]);
  };

  return (
    <div
      ref={containerRef}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        minHeight: "600px",
        border: "1px solid #ccc",
        background: "#fff",
        overflow: "hidden"
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background: "#fff"
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => e.preventDefault()}
      >
        <iframe
          src={pdfUrl}
          title="pdf"
          style={{
            width: "100%",
            height: "100%",
            border: "none"
          }}
        />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        {fields.map((field) => (
          <DraggableField
            key={field.id}
            field={field}
            pdfWidth={size.width}
            pdfHeight={size.height}
          />
        ))}
      </div>
    </div>
  );
}
