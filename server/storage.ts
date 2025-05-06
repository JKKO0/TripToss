import { 
  users, 
  type User, 
  type InsertUser, 
  tripPlans, 
  type TripPlan, 
  type InsertTripPlan, 
  type TripItinerary
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getTripPlan(id: number): Promise<TripPlan | undefined>;
  getTripPlansByUserId(userId: number | null): Promise<TripPlan[]>;
  createTripPlan(tripPlan: InsertTripPlan): Promise<TripPlan>;
  deleteTripPlan(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tripPlans: Map<number, TripPlan>;
  private userIdCounter: number;
  private tripPlanIdCounter: number;

  constructor() {
    this.users = new Map();
    this.tripPlans = new Map();
    this.userIdCounter = 1;
    this.tripPlanIdCounter = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getTripPlan(id: number): Promise<TripPlan | undefined> {
    return this.tripPlans.get(id);
  }

  async getTripPlansByUserId(userId: number | null): Promise<TripPlan[]> {
    return Array.from(this.tripPlans.values()).filter(
      (tripPlan) => userId === null || tripPlan.userId === userId
    );
  }

  async createTripPlan(insertTripPlan: InsertTripPlan): Promise<TripPlan> {
    const id = this.tripPlanIdCounter++;
    const createdAt = new Date();
    const tripPlan: TripPlan = { ...insertTripPlan, id, createdAt };
    this.tripPlans.set(id, tripPlan);
    return tripPlan;
  }

  async deleteTripPlan(id: number): Promise<boolean> {
    return this.tripPlans.delete(id);
  }
}

export const storage = new MemStorage();
