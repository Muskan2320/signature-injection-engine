export default function Sidebar() {
  const fields = ["Signature", "Date"];

  return (
    <div>
      <h3>Fields</h3>

      {fields.map((field) => (
        <div
          key={field}
          draggable
          onDragStart={(e) =>
            e.dataTransfer.setData("fieldType", field.toLowerCase())
          }
          style={{
            border: "1px solid #ccc",
            padding: "8px",
            marginBottom: "8px",
            cursor: "grab",
            background: "#fff"
          }}
        >
          {field}
        </div>
      ))}
    </div>
  );
}
