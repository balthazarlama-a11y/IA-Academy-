import { useAis } from "@/hooks/use-ais";
import { AiCard } from "@/components/AiCard";
import { Navbar } from "@/components/Navbar";
import { Brain, Sparkles, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { data: ais, isLoading } = useAis();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm font-medium text-accent mb-8"
              >
                <Sparkles className="w-4 h-4" />
                <span>La guía definitiva en español</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl md:text-7xl font-display font-extrabold mb-8 leading-tight"
              >
                Aprende a dominar la <br />
                <span className="text-gradient">Inteligencia Artificial</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
              >
                Descubre las mejores herramientas del mercado, aprende cómo usarlas con tutoriales en video y lee reseñas de la comunidad para encontrar la opción ideal para ti.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Catalog Section */}
        <section className="py-24 bg-black/40 border-t border-white/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-12">
              <div className="p-3 rounded-xl bg-accent/10 text-accent">
                <Brain className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-display font-bold">Catálogo de Herramientas</h2>
                <p className="text-muted-foreground mt-1">Explora, aprende y decide.</p>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-[320px] rounded-2xl glass-panel animate-pulse bg-white/5" />
                ))}
              </div>
            ) : !ais || ais.length === 0 ? (
              <div className="text-center py-24 glass-panel rounded-2xl">
                <Zap className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">No hay herramientas disponibles</h3>
                <p className="text-muted-foreground">Vuelve más tarde para descubrir nuevas IAs.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {ais.map((ai, idx) => (
                  <AiCard key={ai.id} ai={ai} index={idx} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
