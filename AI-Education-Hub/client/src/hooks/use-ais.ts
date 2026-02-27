import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type ReviewInput } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useAis() {
  return useQuery({
    queryKey: [api.ais.list.path],
    queryFn: async () => {
      const res = await fetch(api.ais.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Error al cargar las IAs");
      return api.ais.list.responses[200].parse(await res.json());
    },
  });
}

export function useAi(id: number) {
  return useQuery({
    queryKey: [api.ais.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.ais.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Error al cargar la IA");
      return api.ais.get.responses[200].parse(await res.json());
    },
    enabled: !!id && !isNaN(id),
  });
}

export function useAiReviews(aiId: number) {
  return useQuery({
    queryKey: [api.reviews.listByAi.path, aiId],
    queryFn: async () => {
      const url = buildUrl(api.reviews.listByAi.path, { aiId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Error al cargar las reseñas");
      return api.reviews.listByAi.responses[200].parse(await res.json());
    },
    enabled: !!aiId && !isNaN(aiId),
  });
}

export function useCreateReview(aiId: number) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: ReviewInput) => {
      const url = buildUrl(api.reviews.create.path, { aiId });
      const res = await fetch(url, {
        method: api.reviews.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (res.status === 401) {
        throw new Error("unauthorized");
      }
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.reviews.create.responses[400].parse(await res.json());
          throw new Error(error.message || "Datos inválidos");
        }
        throw new Error("Error al publicar la reseña");
      }
      return api.reviews.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.reviews.listByAi.path, aiId] });
      queryClient.invalidateQueries({ queryKey: [api.ais.get.path, aiId] });
      queryClient.invalidateQueries({ queryKey: [api.ais.list.path] });
      toast({
        title: "¡Reseña publicada!",
        description: "Gracias por compartir tu opinión.",
      });
    },
    onError: (error) => {
      if (error.message === "unauthorized") {
        toast({
          title: "Acceso denegado",
          description: "Debes iniciar sesión para dejar una reseña.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 1500);
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  });
}
