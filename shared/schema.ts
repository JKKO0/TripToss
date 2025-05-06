import { pgTable, text, serial, integer, boolean, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const interests = pgTable("interests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
});

export const tripPlans = pgTable("trip_plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  destination: text("destination").notNull(),
  duration: text("duration").notNull(),
  budget: text("budget").notNull(),
  interests: text("interests").array().notNull(),
  itinerary: json("itinerary").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTripPlanSchema = createInsertSchema(tripPlans).omit({
  id: true,
  createdAt: true,
});

export const tripPromptSchema = z.object({
  destination: z.string().min(2, { message: "Destination is required" }),
  duration: z.string().min(1, { message: "Duration is required" }),
  budget: z.string().min(1, { message: "Budget is required" }),
  accommodation: z.string().optional(),
  interests: z.array(z.string()).min(1, { message: "Select at least one interest" }),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type TripPlan = typeof tripPlans.$inferSelect;
export type InsertTripPlan = z.infer<typeof insertTripPlanSchema>;
export type TripPrompt = z.infer<typeof tripPromptSchema>;

export type TripItinerary = {
  summary: string;
  days: {
    day: number;
    title: string;
    activities: {
      time: string;
      title: string;
      description: string;
    }[];
  }[];
  tips: string[];
}
