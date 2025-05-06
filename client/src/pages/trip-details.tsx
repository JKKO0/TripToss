import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { doc, getDoc, db } from "@/lib/firebase";
import { SavedTrip } from "@/lib/trip-service";
import { TripItinerary } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ItineraryDisplay from "@/components/trip/itinerary-display";
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  AlertCircle, 
  Loader2 
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function TripDetails() {
  const [match, params] = useRoute<{ id: string }>("/trip/:id");
  const [_, navigate] = useLocation();
  const { currentUser } = useAuth();
  const [trip, setTrip] = useState<SavedTrip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrip() {
      if (!params?.id) {
        setError("Trip not found");
        setIsLoading(false);
        return;
      }

      try {
        const tripRef = doc(db, "trips", params.id);
        const tripDoc = await getDoc(tripRef);
        
        if (tripDoc.exists()) {
          const tripData = tripDoc.data() as Omit<SavedTrip, "id" | "createdAt"> & { 
            createdAt: { toDate: () => Date } 
          };
          
          // Check if current user is the owner of this trip
          if (currentUser && tripData.uid === currentUser.uid) {
            setTrip({
              ...tripData,
              id: params.id,
              createdAt: tripData.createdAt.toDate(),
            });
          } else {
            setError("You don't have permission to view this trip");
          }
        } else {
          setError("Trip not found");
        }
      } catch (error) {
        console.error("Error fetching trip:", error);
        setError("Failed to load trip details");
      } finally {
        setIsLoading(false);
      }
    }

    if (currentUser) {
      fetchTrip();
    } else {
      setIsLoading(false);
    }
  }, [params, currentUser]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!currentUser && !isLoading) {
      navigate("/login");
    }
  }, [currentUser, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium">Loading trip details...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <AlertCircle className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
        <p className="text-muted-foreground mb-6">
          Please sign in to view trip details.
        </p>
        <Button onClick={() => navigate("/login")}>
          Sign In
        </Button>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <AlertCircle className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-4">
          {error || "Trip not found"}
        </h1>
        <p className="text-muted-foreground mb-6">
          The trip you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <Button onClick={() => navigate("/saved-trips")}>
          Back to Saved Trips
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Button 
        variant="outline" 
        className="mb-8" 
        onClick={() => navigate("/saved-trips")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Saved Trips
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="md:col-span-3">
          <h1 className="text-3xl font-bold mb-2">{trip.name}</h1>
          <h2 className="text-xl text-muted-foreground mb-4">{trip.destination}</h2>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {trip.prompt.interests.map((interest, index) => (
              <Badge key={index}>{interest}</Badge>
            ))}
          </div>
        </div>
        
        <Card className="flex flex-col justify-center">
          <CardHeader className="space-y-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              <div>
                <CardTitle className="text-sm font-medium">Duration</CardTitle>
                <CardDescription>{trip.prompt.duration}</CardDescription>
              </div>
            </div>
            
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-primary" />
              <div>
                <CardTitle className="text-sm font-medium">Budget</CardTitle>
                <CardDescription>{trip.prompt.budget}</CardDescription>
              </div>
            </div>
            
            {trip.prompt.accommodation && (
              <div className="flex items-center">
                <i className="fas fa-bed text-primary mr-2 h-5 w-5 flex items-center justify-center" />
                <div>
                  <CardTitle className="text-sm font-medium">Accommodation</CardTitle>
                  <CardDescription>{trip.prompt.accommodation}</CardDescription>
                </div>
              </div>
            )}
            
            <div>
              <CardTitle className="text-sm font-medium">Created</CardTitle>
              <CardDescription>{trip.createdAt.toLocaleDateString()}</CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>
      
      <Separator className="my-8" />
      
      <h2 className="text-2xl font-bold mb-6">Trip Itinerary</h2>
      <ItineraryDisplay itinerary={trip.itinerary as TripItinerary} />
    </div>
  );
}