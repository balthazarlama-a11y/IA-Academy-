import { Link } from "wouter";
import { StarRating } from "./StarRating";
import { motion } from "framer-motion";
import { ExternalLink, PlayCircle } from "lucide-react";
import type { z } from "zod";
import type { api } from "@shared/routes";

type AiResponse = z.infer<typeof api.ais.list.responses[200]>[0];

export function AiCard({ ai, index }: { ai: AiResponse; index: number }) {
  const rating = ai.averageRating ? parseFloat(ai.averageRating as string) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/ais/${ai.id}`}>
        <div className="group relative h-full flex flex-col glass-panel rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-500 cursor-pointer">
          
          {/* Top subtle glow */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="p-6 flex-1 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center border border-white/5 overflow-hidden group-hover:scale-105 transition-transform duration-500">
                {ai.logoUrl ? (
                  <img src={ai.logoUrl} alt={`${ai.name} logo`} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-display font-bold text-2xl text-primary">{ai.name.substring(0, 2).toUpperCase()}</span>
                )}
              </div>
              <div className="flex flex-col items-end">
                <div className="bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full border border-white/5 flex items-center gap-2">
                  <span className="font-bold text-sm">{rating.toFixed(1)}</span>
                  <StarRating rating={rating} size="sm" />
                </div>
              </div>
            </div>

            <h3 className="font-display text-2xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
              {ai.name}
            </h3>
            
            <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
              {ai.description}
            </p>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-sm mt-auto">
              <div className="flex items-center gap-2 text-muted-foreground">
                <PlayCircle className="w-4 h-4" />
                <span>Ver tutorial</span>
              </div>
              <div className="flex items-center gap-1 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                <span>Explorar</span>
                <ExternalLink className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
