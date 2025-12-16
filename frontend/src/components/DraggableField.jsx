// src/components/DraggableField.jsx
import { ratioToPx } from "../utils/coordinate";

export default function DraggableField({ field, pdfWidth, pdfHeight }) {
  const { x, y, width, height } = ratioToPx(
    field,
  pdfWidth,
    pdfHeight
  );

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: width,
        height: height,
        boxSizing: "border-box",
        border: "2px dashed #007bff",
        background: "rgba(0,123,255,0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "12px",
        pointerEvents: "none"
      }}
    >
      {field.type}
    </div>
  );
}
