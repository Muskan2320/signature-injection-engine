// src/components/Sidebar.jsx

const fields = [
  { type: "text", label: "Text" },
  { type: "signature", label: "Signature" },
  { type: "date", label: "Date" },
  { type: "image", label: "Image" },
  { type: "radio", label: "Radio" }
];

export default function Sidebar() {
  const onDragStart = (e, type) => {
    e.dataTransfer.setData("fieldType", type);
  };

  return (
    <div style={{ padding: "10px", borderRight: "1px solid #ccc" }}>
      <h4>Fields</h4>
      {fields.map((f) => (
        <div
          key={f.type}
          draggable
          onDragStart={(e) => onDragStart(e, f.type)}
          style={{
            padding: "8px",
            marginBottom: "8px",
            border: "1px solid #999",
            cursor: "grab",
            background: "#f9f9f9"
          }}
        >
          {f.label}
        </div>
      ))}
    </div>
  );
}
