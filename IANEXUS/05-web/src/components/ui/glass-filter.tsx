export default function GlassFilter() {
  return (
    <svg style={{ display: "none" }} aria-hidden="true">
      <defs>
        {/* Lightweight glass distortion — feTurbulence → blur → displace only */}
        <filter
          id="glass-distortion"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015 0.025"
            numOctaves="1"
            seed="17"
            result="turbulence"
          />
          <feGaussianBlur in="turbulence" stdDeviation="2" result="softMap" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softMap"
            scale="12"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
