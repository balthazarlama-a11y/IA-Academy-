"use client";

export default function LiquidBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#09090f]">
      {/* Blob 1 - Electric Blue */}
      <div
        style={{
          position: "absolute",
          top: "-15%",
          left: "-10%",
          width: "700px",
          height: "700px",
          background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
          borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
          filter: "blur(120px)",
          opacity: 0.45,
          animation: "blob-1 22s infinite alternate",
        }}
      />

      {/* Blob 2 - Violet */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          right: "-10%",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
          borderRadius: "40% 60% 70% 30% / 40% 70% 30% 60%",
          filter: "blur(100px)",
          opacity: 0.4,
          animation: "blob-2 26s infinite alternate 1.5s",
        }}
      />

      {/* Blob 3 - Emerald Green */}
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          left: "5%",
          width: "550px",
          height: "550px",
          background: "radial-gradient(circle, #10b981 0%, transparent 70%)",
          borderRadius: "50% 50% 30% 70% / 30% 60% 40% 70%",
          filter: "blur(110px)",
          opacity: 0.35,
          animation: "blob-3 20s infinite alternate 3s",
        }}
      />

      {/* Blob 4 - Hot Pink */}
      <div
        style={{
          position: "absolute",
          bottom: "5%",
          right: "0%",
          width: "580px",
          height: "580px",
          background: "radial-gradient(circle, #ec4899 0%, transparent 70%)",
          borderRadius: "70% 30% 60% 40% / 50% 40% 60% 30%",
          filter: "blur(100px)",
          opacity: 0.38,
          animation: "blob-4 28s infinite alternate 0.5s",
        }}
      />
    </div>
  );
}
