import { pgTable, text, serial, integer, timestamp, varchar, numeric } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";

export * from "./models/auth";

export const ais = pgTable("ais", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  videoUrl: text("video_url").notNull(), // YouTube embed URL
  priceQuality: text("price_quality").notNull(), // Descripción de relación precio-calidad
  logoUrl: text("logo_url"),
  averageRating: numeric("average_rating", { precision: 3, scale: 2 }).default('0'),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  aiId: integer("ai_id").notNull().references(() => ais.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  rating: integer("rating").notNull(), // 1 to 5
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const aisRelations = relations(ais, ({ many }) => ({
  reviews: many(reviews),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  ai: one(ais, {
    fields: [reviews.aiId],
    references: [ais.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));

export const insertAiSchema = createInsertSchema(ais).omit({ id: true, averageRating: true, createdAt: true });
export type InsertAi = z.infer<typeof insertAiSchema>;
export type Ai = typeof ais.$inferSelect;

export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true, userId: true, createdAt: true }).extend({
  rating: z.number().min(1).max(5)
});
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

export type ReviewWithUser = Review & { user?: { id: string; firstName: string | null; lastName: string | null; profileImageUrl: string | null } };
export type AiWithReviews = Ai & { reviews?: ReviewWithUser[] };
