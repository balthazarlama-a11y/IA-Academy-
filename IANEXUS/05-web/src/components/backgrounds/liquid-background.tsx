type BlobConfig = {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  width: number;
  height: number;
  background: string;
  borderRadius: string;
  filter: string;
  opacity: number;
  animation?: string;
};

type LiquidBackgroundProps = {
  performanceMode?: "full" | "lite" | "minimal";
};

const FULL_BLOBS: BlobConfig[] = [
  {
    top: "-12%",
    left: "-8%",
    width: 680,
    height: 680,
    background: "radial-gradient(circle, #a78bfa 0%, transparent 68%)",
    borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
    filter: "blur(90px)",
    opacity: 0.28,
    animation: "blob-1 26s ease-in-out infinite alternate",
  },
  {
    top: "8%",
    right: "-8%",
    width: 560,
    height: 560,
    background: "radial-gradient(circle, #f472b6 0%, transparent 68%)",
    borderRadius: "40% 60% 70% 30% / 40% 70% 30% 60%",
    filter: "blur(85px)",
    opacity: 0.24,
    animation: "blob-2 30s ease-in-out infinite alternate 2s",
  },
  {
    bottom: "-8%",
    left: "8%",
    width: 520,
    height: 520,
    background: "radial-gradient(circle, #22d3ee 0%, transparent 68%)",
    borderRadius: "50% 50% 30% 70% / 30% 60% 40% 70%",
    filter: "blur(90px)",
    opacity: 0.2,
    animation: "blob-3 22s ease-in-out infinite alternate 4s",
  },
  {
    bottom: "8%",
    right: "2%",
    width: 540,
    height: 540,
    background: "radial-gradient(circle, #fbbf24 0%, transparent 68%)",
    borderRadius: "70% 30% 60% 40% / 50% 40% 60% 30%",
    filter: "blur(85px)",
    opacity: 0.18,
    animation: "blob-4 32s ease-in-out infinite alternate 1s",
  },
];

// Sin animaciones para evitar lag
const LITE_BLOBS: BlobConfig[] = [
  {
    top: "-5%",
    left: "-5%",
    width: 400,
    height: 400,
    background: "radial-gradient(circle, #a78bfa 0%, transparent 70%)",
    borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
    filter: "blur(60px)",
    opacity: 0.15,
  },
  {
    bottom: "-5%",
    right: "-5%",
    width: 380,
    height: 380,
    background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
    borderRadius: "40% 60% 70% 30% / 40% 70% 30% 60%",
    filter: "blur(55px)",
    opacity: 0.12,
  },
];

// Fondo estático, sin blur pesado
const MINIMAL_BLOBS: BlobConfig[] = [
  {
    top: "0%",
    left: "20%",
    width: 600,
    height: 400,
    background: "radial-gradient(ellipse at center, rgba(139,92,246,0.15) 0%, transparent 60%)",
    borderRadius: "50%",
    filter: "blur(40px)",
    opacity: 0.5,
  },
  {
    bottom: "0%",
    right: "10%",
    width: 500,
    height: 350,
    background: "radial-gradient(ellipse at center, rgba(59,130,246,0.12) 0%, transparent 60%)",
    borderRadius: "50%",
    filter: "blur(40px)",
    opacity: 0.5,
  },
];

export default function LiquidBackground({
  performanceMode = "full",
}: LiquidBackgroundProps) {
  const blobs =
    performanceMode === "minimal"
      ? MINIMAL_BLOBS
      : performanceMode === "lite"
        ? LITE_BLOBS
        : FULL_BLOBS;
  const baseColor =
    performanceMode === "minimal"
      ? "#09090f"
      : performanceMode === "lite"
        ? "#0a0a10"
        : "#09090f";

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{
        background: baseColor,
        contain: "strict",
      }}
    >
      {blobs.map((blob, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            top: blob.top,
            right: blob.right,
            bottom: blob.bottom,
            left: blob.left,
            width: `${blob.width}px`,
            height: `${blob.height}px`,
            background: blob.background,
            borderRadius: blob.borderRadius,
            filter: blob.filter,
            opacity: blob.opacity,
            // Solo animar en modo full, y con willChange controlado
            animation: blob.animation,
            willChange: blob.animation ? "transform" : undefined,
            transform: "translateZ(0)",
          }}
        />
      ))}
    </div>
  );
}
