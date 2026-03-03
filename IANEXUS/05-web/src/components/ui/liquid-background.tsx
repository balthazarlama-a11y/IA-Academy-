"use client";

export default function LiquidBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#09090f]">
      {/* Blob 1 - Electric Blue */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: "-5%",
          width: "700px",
          height: "700px",
          background: "#3b82f6",
          borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
          filter: "blur(120px)",
          opacity: 0.35,
          animation: "blob-1 20s infinite",
        }}
      />

      {/* Blob 2 - Violet */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "-10%",
          width: "600px",
          height: "600px",
          background: "#8b5cf6",
          borderRadius: "40% 60% 70% 30% / 40% 70% 30% 60%",
          filter: "blur(100px)",
          opacity: 0.3,
          animation: "blob-2 24s infinite",
          animationDelay: "2s",
        }}
      />

      {/* Blob 3 - Emerald Green */}
      <div
        style={{
          position: "absolute",
          bottom: "-5%",
          left: "10%",
          width: "500px",
          height: "500px",
          background: "#10b981",
          borderRadius: "50% 50% 30% 70% / 30% 60% 40% 70%",
          filter: "blur(110px)",
          opacity: 0.25,
          animation: "blob-3 22s infinite",
          animationDelay: "4s",
        }}
      />

      {/* Blob 4 - Hot Pink */}
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "5%",
          width: "550px",
          height: "550px",
          background: "#ec4899",
          borderRadius: "70% 30% 60% 40% / 50% 40% 60% 30%",
          filter: "blur(100px)",
          opacity: 0.28,
          animation: "blob-4 26s infinite",
          animationDelay: "1s",
        }}
      />
    </div>
  );
}
