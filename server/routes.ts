import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { tripPromptSchema, insertTripPlanSchema } from "@shared/schema";
import { generateTripItinerary } from "./services/gemini";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.get("/api/trips", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId ? Number(req.query.userId) : null;
      const trips = await storage.getTripPlansByUserId(userId);
      res.json(trips);
    } catch (error) {
      console.error("Error fetching trips:", error);
      res.status(500).json({ message: "Failed to fetch trips" });
    }
  });

  app.get("/api/trips/:id", async (req: Request, res: Response) => {
    try {
      const tripId = Number(req.params.id);
      const trip = await storage.getTripPlan(tripId);
      
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }
      
      res.json(trip);
    } catch (error) {
      console.error("Error fetching trip:", error);
      res.status(500).json({ message: "Failed to fetch trip" });
    }
  });

  app.post("/api/generate-itinerary", async (req: Request, res: Response) => {
    try {
      const tripPrompt = tripPromptSchema.parse(req.body);
      const itinerary = await generateTripItinerary(tripPrompt);
      res.json({ itinerary });
    } catch (error) {
      console.error("Error generating itinerary:", error);
      
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to generate itinerary" });
    }
  });

  app.post("/api/trips", async (req: Request, res: Response) => {
    try {
      const tripPlan = insertTripPlanSchema.parse(req.body);
      const newTrip = await storage.createTripPlan(tripPlan);
      res.status(201).json(newTrip);
    } catch (error) {
      console.error("Error saving trip:", error);
      
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      res.status(500).json({ message: "Failed to save trip" });
    }
  });

  app.delete("/api/trips/:id", async (req: Request, res: Response) => {
    try {
      const tripId = Number(req.params.id);
      const success = await storage.deleteTripPlan(tripId);
      
      if (!success) {
        return res.status(404).json({ message: "Trip not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting trip:", error);
      res.status(500).json({ message: "Failed to delete trip" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
