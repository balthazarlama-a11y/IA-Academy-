import { useParams } from "wouter";
import { useAi, useAiReviews, useCreateReview } from "@/hooks/use-ais";
import { Navbar } from "@/components/Navbar";
import { StarRating } from "@/components/StarRating";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, CheckCircle2, MessageSquare, Play, Send, ShieldCheck, User } from "lucide-react";
import { Link } from "wouter";

// Helper to convert standard youtube links to embed links
function getEmbedUrl(url: string) {
  if (!url) return "";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}?rel=0&modestbranding=1`;
  }
  return url; // return as is if doesn't match standard yt patterns
}

const reviewSchema = z.object({
  rating: z.number().min(1, "Selecciona una calificación").max(5),
  comment: z.string().min(10, "El comentario debe tener al menos 10 caracteres").max(1000),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

export default function AiDetail() {
  const { id } = useParams();
  const aiId = parseInt(id || "0", 10);
  
  const { data: ai, isLoading: isAiLoading } = useAi(aiId);
  const { data: reviews, isLoading: isReviewsLoading } = useAiReviews(aiId);
  const { isAuthenticated } = useAuth();
  
  const createReview = useCreateReview(aiId);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const onSubmit = (data: ReviewFormValues) => {
    createReview.mutate(data, {
      onSuccess: () => {
        form.reset();
      }
    });
  };

  if (isAiLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!ai) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl font-bold mb-4">Herramienta no encontrada</h1>
          <p className="text-muted-foreground mb-8">La IA que buscas no existe o ha sido eliminada.</p>
          <Link href="/" className="px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors">
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  const ratingNum = ai.averageRating ? parseFloat(ai.averageRating as string) : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pb-24">
        {/* Header Section */}
        <div className="bg-black/50 border-b border-white/5 pt-12 pb-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-3xl bg-secondary flex items-center justify-center border border-white/10 overflow-hidden shadow-2xl">
                  {ai.logoUrl ? (
                    <img src={ai.logoUrl} alt={ai.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-display font-bold text-4xl text-primary">{ai.name.substring(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-3">{ai.name}</h1>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-primary/20 text-primary px-3 py-1.5 rounded-full border border-primary/20">
                      <span className="font-bold text-lg leading-none">{ratingNum.toFixed(1)}</span>
                      <StarRating rating={ratingNum} size="sm" />
                    </div>
                    <span className="text-muted-foreground">
                      {reviews?.length || 0} reseñas
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Main Content (Left, spans 2 cols on lg) */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* Video Player */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-xl font-display font-bold">
                  <Play className="w-5 h-5 text-accent" />
                  <h2>Video Tutorial</h2>
                </div>
                <div className="aspect-video w-full rounded-2xl overflow-hidden glass-panel border-white/10 shadow-2xl relative group">
                  <iframe 
                    src={getEmbedUrl(ai.videoUrl)} 
                    title={`Tutorial de ${ai.name}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="w-full h-full absolute inset-0"
                  />
                </div>
              </section>

              {/* Description */}
              <section className="glass-panel p-8 rounded-2xl">
                <h2 className="text-2xl font-display font-bold mb-4">¿Qué es {ai.name}?</h2>
                <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed">
                  {ai.description.split('\n').map((paragraph, i) => (
                    <p key={i} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </section>

              {/* Reviews Section */}
              <section id="reviews" className="space-y-8 pt-8 border-t border-white/10">
                <div className="flex items-center gap-2 text-2xl font-display font-bold">
                  <MessageSquare className="w-6 h-6 text-primary" />
                  <h2>Reseñas de la Comunidad</h2>
                </div>

                {/* Review Form */}
                <div className="glass-panel p-6 sm:p-8 rounded-2xl relative overflow-hidden">
                  {/* bg glow */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
                  
                  <h3 className="text-xl font-bold mb-6">Deja tu opinión</h3>
                  
                  {!isAuthenticated ? (
                    <div className="bg-black/40 border border-white/5 rounded-xl p-8 text-center backdrop-blur-sm">
                      <ShieldCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h4 className="text-lg font-medium mb-2">Inicia sesión para opinar</h4>
                      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Únete a nuestra comunidad para compartir tu experiencia con {ai.name} y ayudar a otros usuarios.
                      </p>
                      <a 
                        href="/api/login"
                        className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors"
                      >
                        Iniciar Sesión
                      </a>
                    </div>
                  ) : (
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative z-10">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-3">Calificación</label>
                        <div className="bg-black/30 inline-flex p-3 rounded-xl border border-white/5">
                          <StarRating 
                            rating={form.watch("rating")} 
                            readOnly={false} 
                            size="lg"
                            onChange={(val) => form.setValue("rating", val)} 
                          />
                        </div>
                        {form.formState.errors.rating && (
                          <p className="text-destructive text-sm mt-2">{form.formState.errors.rating.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="comment" className="block text-sm font-medium text-muted-foreground mb-3">Tu comentario</label>
                        <textarea
                          id="comment"
                          rows={4}
                          className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                          placeholder="¿Qué te parece esta herramienta? ¿Para qué la utilizas?"
                          {...form.register("comment")}
                        />
                        {form.formState.errors.comment && (
                          <p className="text-destructive text-sm mt-2">{form.formState.errors.comment.message}</p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={createReview.isPending}
                        className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {createReview.isPending ? "Publicando..." : (
                          <>
                            <span>Publicar reseña</span>
                            <Send className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {isReviewsLoading ? (
                    <div className="text-center py-12 text-muted-foreground">Cargando reseñas...</div>
                  ) : !reviews || reviews.length === 0 ? (
                    <div className="text-center py-12 bg-black/20 rounded-2xl border border-white/5 border-dashed">
                      <p className="text-muted-foreground">Aún no hay reseñas. ¡Sé el primero en opinar!</p>
                    </div>
                  ) : (
                    reviews.map((review, i) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={review.id} 
                        className="glass-panel p-6 rounded-2xl"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10 border border-white/10">
                              <AvatarImage src={review.user?.profileImageUrl || undefined} />
                              <AvatarFallback className="bg-secondary text-muted-foreground">
                                {review.user?.firstName?.[0] || <User className="w-4 h-4" />}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-white">{review.user?.firstName || "Usuario anónimo"}</p>
                              <p className="text-xs text-muted-foreground">
                                {review.createdAt ? format(new Date(review.createdAt), "d 'de' MMMM, yyyy", { locale: es }) : ''}
                              </p>
                            </div>
                          </div>
                          <StarRating rating={review.rating} size="sm" />
                        </div>
                        <p className="text-gray-300 leading-relaxed">{review.comment}</p>
                      </motion.div>
                    ))
                  )}
                </div>
              </section>

            </div>

            {/* Sidebar (Right, spans 1 col on lg) */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-6">
                
                {/* Price/Quality Highlight */}
                <div className="rounded-2xl p-1 relative overflow-hidden bg-gradient-to-b from-accent/50 to-primary/20 shadow-2xl shadow-accent/10">
                  <div className="bg-card p-6 rounded-xl h-full relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-accent/20 text-accent rounded-lg">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-display font-bold text-white">Relación Precio-Calidad</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {ai.priceQuality}
                    </p>
                  </div>
                </div>

                {/* Quick stats box */}
                <div className="glass-panel p-6 rounded-2xl">
                  <h4 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Resumen de comunidad</h4>
                  
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white">Calificación general</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary">{ratingNum.toFixed(1)}</span>
                        <StarRating rating={ratingNum} size="sm" />
                      </div>
                    </div>
                    
                    <div className="w-full h-px bg-white/5" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-white">Total de reseñas</span>
                      <span className="font-bold bg-secondary px-3 py-1 rounded-full text-sm">
                        {reviews?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
