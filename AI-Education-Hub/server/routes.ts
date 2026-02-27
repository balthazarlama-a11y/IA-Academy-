import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { isAuthenticated, setupAuth, registerAuthRoutes } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  app.get(api.ais.list.path, async (req, res) => {
    const aiList = await storage.getAis();
    res.json(aiList);
  });

  app.get(api.ais.get.path, async (req, res) => {
    const ai = await storage.getAi(Number(req.params.id));
    if (!ai) {
      return res.status(404).json({ message: "AI not found" });
    }
    res.json(ai);
  });

  app.get(api.reviews.listByAi.path, async (req, res) => {
    const aiReviews = await storage.getReviewsByAi(Number(req.params.aiId));
    res.json(aiReviews);
  });

  app.post(api.reviews.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const aiId = Number(req.params.aiId);
      const userId = req.user.claims.sub;
      
      const input = api.reviews.create.input.parse(req.body);
      const review = await storage.createReview({
        ...input,
        aiId,
        userId
      });
      res.status(201).json(review);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Seed database
  seedDatabase().catch(console.error);

  return httpServer;
}

async function seedDatabase() {
  const existingAis = await storage.getAis();
  if (existingAis.length === 0) {
    await storage.createAi({
      name: "ChatGPT (OpenAI)",
      description: "ChatGPT es un modelo de lenguaje de IA desarrollado por OpenAI. Puede responder preguntas, redactar correos electrónicos, escribir código y mucho más.",
      videoUrl: "https://www.youtube.com/embed/S_NExOMzIok",
      priceQuality: "Excelente. Ofrece un modelo gratuito muy capaz (GPT-4o mini) y una versión Plus ($20/mes) que incluye análisis de datos avanzados y acceso temprano a nuevos modelos.",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg"
    });
    
    await storage.createAi({
      name: "Claude (Anthropic)",
      description: "Claude es el asistente de IA de próxima generación creado por Anthropic, diseñado para ser útil, honesto e inofensivo. Destaca en tareas de redacción y análisis de documentos largos.",
      videoUrl: "https://www.youtube.com/embed/8v_XvY5w24o",
      priceQuality: "Muy buena. Su modelo gratuito es increíblemente inteligente y la versión Pro ($20/mes) ofrece uso extensivo de Claude 3.5 Sonnet y Opus.",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Anthropic_logo.svg"
    });
    
    await storage.createAi({
      name: "Midjourney",
      description: "Midjourney es un laboratorio de investigación independiente y el nombre de su programa de IA generativa de imágenes a partir de texto. Es famoso por su calidad artística.",
      videoUrl: "https://www.youtube.com/embed/8eW7uI5eP9Q",
      priceQuality: "Buena. No tiene versión gratuita actualmente. Los planes empiezan en $10/mes, lo que es muy accesible para la calidad excepcional de las imágenes generadas.",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Midjourney_Emblem.png"
    });
  }
}
