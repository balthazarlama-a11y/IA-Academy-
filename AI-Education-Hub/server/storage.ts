import { db } from "./db";
import { ais, reviews, type InsertAi, type InsertReview, type Ai, type Review, type AiWithReviews, type ReviewWithUser } from "@shared/schema";
import { eq, desc, sql } from "drizzle-orm";
import { users } from "@shared/models/auth";
import { authStorage } from "./replit_integrations/auth/storage";

export interface IStorage {
  getAis(): Promise<Ai[]>;
  getAi(id: number): Promise<AiWithReviews | undefined>;
  getReviewsByAi(aiId: number): Promise<ReviewWithUser[]>;
  createReview(review: InsertReview): Promise<ReviewWithUser>;
  createAi(ai: InsertAi): Promise<Ai>;
}

export class DatabaseStorage implements IStorage {
  async getAis(): Promise<Ai[]> {
    return await db.select().from(ais).orderBy(desc(ais.averageRating));
  }

  async getAi(id: number): Promise<AiWithReviews | undefined> {
    const [ai] = await db.select().from(ais).where(eq(ais.id, id));
    if (!ai) return undefined;
    
    const aiReviews = await this.getReviewsByAi(id);
    return { ...ai, reviews: aiReviews };
  }

  async getReviewsByAi(aiId: number): Promise<ReviewWithUser[]> {
    const results = await db.select({
      review: reviews,
      user: users,
    })
    .from(reviews)
    .where(eq(reviews.aiId, aiId))
    .leftJoin(users, eq(reviews.userId, users.id))
    .orderBy(desc(reviews.createdAt));
    
    return results.map(r => ({
      ...r.review,
      user: r.user ? {
        id: r.user.id,
        firstName: r.user.firstName,
        lastName: r.user.lastName,
        profileImageUrl: r.user.profileImageUrl,
      } : undefined
    }));
  }

  async createReview(review: InsertReview): Promise<ReviewWithUser> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    
    // Update the AI's average rating
    const aiReviews = await db.select({ rating: reviews.rating }).from(reviews).where(eq(reviews.aiId, review.aiId));
    if (aiReviews.length > 0) {
      const avg = aiReviews.reduce((sum, r) => sum + r.rating, 0) / aiReviews.length;
      await db.update(ais).set({ averageRating: avg.toString() }).where(eq(ais.id, review.aiId));
    }

    const user = await authStorage.getUser(newReview.userId);
    
    return {
      ...newReview,
      user: user ? {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
      } : undefined
    };
  }

  async createAi(ai: InsertAi): Promise<Ai> {
    const [newAi] = await db.insert(ais).values(ai).returning();
    return newAi;
  }
}

export const storage = new DatabaseStorage();
