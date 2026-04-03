export function WheelPointer() {
  return (
    <div
      className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10"
      style={{
        width: "0",
        height: "0",
        borderLeft: "20px solid transparent",
        borderRight: "20px solid transparent",
        borderTop: "40px solid #EF4444",
        filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))",
      }}
    />
  );
}
