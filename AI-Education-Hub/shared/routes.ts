import { z } from 'zod';
import { insertAiSchema, insertReviewSchema, ais, reviews } from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  unauthorized: z.object({ message: z.string() }),
};

export const api = {
  ais: {
    list: {
      method: 'GET' as const,
      path: '/api/ais' as const,
      responses: {
        200: z.array(z.custom<typeof ais.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/ais/:id' as const,
      responses: {
        200: z.custom<typeof ais.$inferSelect & { reviews: any[] }>(),
        404: errorSchemas.notFound,
      },
    },
  },
  reviews: {
    listByAi: {
      method: 'GET' as const,
      path: '/api/ais/:aiId/reviews' as const,
      responses: {
        200: z.array(z.custom<typeof reviews.$inferSelect & { user: any }>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/ais/:aiId/reviews' as const,
      input: insertReviewSchema.omit({ aiId: true }),
      responses: {
        201: z.custom<typeof reviews.$inferSelect & { user: any }>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type AiInput = z.infer<typeof insertAiSchema>;
export type AiResponse = z.infer<typeof api.ais.get.responses[200]>;
export type ReviewInput = z.infer<typeof api.reviews.create.input>;
export type ReviewResponse = z.infer<typeof api.reviews.create.responses[201]>;
