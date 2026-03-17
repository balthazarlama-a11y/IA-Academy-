import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(__dirname),

  // Configuracion de imagenes para Supabase Storage
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  // Configuracion de headers para seguridad
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          // Permite que el preview embebido de Antigravity/Jetski pueda mostrar la app
          // En produccion, cambiar 'frame-ancestors *' por tu dominio real
          {
            // Permite embeber la app en iframes externos (preview de Antigravity, VS Code, etc.)
            // En produccion, cambiar a tu dominio real o eliminar esta linea
            key: "X-Frame-Options",
            value: "ALLOWALL",
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors *",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
