import { 
  db, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  deleteDoc, 
  query, 
  where 
} from "./firebase";
import { TripItinerary, TripPrompt } from "@shared/schema";

const TRIPS_COLLECTION = "trips";

interface SavedTrip {
  id: string;
  uid: string;
  name: string;
  destination: string;
  prompt: TripPrompt;
  itinerary: TripItinerary;
  createdAt: Date;
}

interface NewTrip {
  uid: string;
  name: string;
  destination: string;
  prompt: TripPrompt;
  itinerary: TripItinerary;
}

// Add a new trip to Firestore
export async function saveTrip(trip: NewTrip): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, TRIPS_COLLECTION), {
      ...trip,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving trip:", error);
    throw error;
  }
}

// Get all trips for a user
export async function getUserTrips(uid: string): Promise<SavedTrip[]> {
  try {
    const q = query(collection(db, TRIPS_COLLECTION), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    
    const trips: SavedTrip[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      trips.push({
        id: doc.id,
        uid: data.uid,
        name: data.name,
        destination: data.destination,
        prompt: data.prompt,
        itinerary: data.itinerary,
        createdAt: data.createdAt.toDate()
      });
    });
    
    // Sort by createdAt descending (newest first)
    return trips.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    console.error("Error getting trips:", error);
    throw error;
  }
}

// Delete a trip
export async function deleteTrip(tripId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, TRIPS_COLLECTION, tripId));
  } catch (error) {
    console.error("Error deleting trip:", error);
    throw error;
  }
}

export type { SavedTrip, NewTrip };