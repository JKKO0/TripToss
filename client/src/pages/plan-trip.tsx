import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { saveTrip } from "@/lib/trip-service";
import TripForm from "@/components/trip/trip-form";
import ItineraryDisplay from "@/components/trip/itinerary-display";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TripPrompt, TripItinerary } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PlanTrip() {
  const [itinerary, setItinerary] = useState<TripItinerary | null>(null);
  const [tripDetails, setTripDetails] = useState<TripPrompt | null>(null);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [tripName, setTripName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  const { currentUser } = useAuth();

  const generateMutation = useMutation({
    mutationFn: async (tripPrompt: TripPrompt) => {
      const res = await apiRequest("POST", "/api/generate-itinerary", tripPrompt);
      return res.json();
    },
    onSuccess: (data) => {
      setItinerary(data.itinerary);
      // Set a default trip name based on the destination
      if (tripDetails?.destination) {
        setTripName(`Trip to ${tripDetails.destination}`);
        
        // Auto-save if user is logged in
        if (currentUser && tripDetails) {
          handleAutoSave(data.itinerary);
        }
      }
    },
    onError: (error) => {
      toast({
        title: "Error generating itinerary",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    },
  });
  
  // Function to automatically save the trip
  const handleAutoSave = async (generatedItinerary: TripItinerary) => {
    if (!currentUser || !tripDetails) return;
    
    try {
      await saveTrip({
        uid: currentUser.uid,
        name: `Trip to ${tripDetails.destination}`,
        destination: tripDetails.destination,
        prompt: tripDetails,
        itinerary: generatedItinerary,
      });
      
      toast({
        title: "Trip saved automatically",
        description: "You can find it in your saved trips",
      });
    } catch (error) {
      console.error("Error auto-saving trip:", error);
      // Silent failure for auto-save - user can still manually save
    }
  };

  // Check for auto-submit from landing page
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shouldAutoSubmit = params.get("autoSubmit") === "true";
    
    if (shouldAutoSubmit) {
      try {
        const savedData = sessionStorage.getItem('tripFormData');
        if (savedData) {
          const parsedData = JSON.parse(savedData) as TripPrompt;
          setTripDetails(parsedData);
          generateMutation.mutate(parsedData);
          
          // Clear URL parameter after submission
          const newUrl = window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
        }
      } catch (error) {
        console.error("Error auto-submitting form:", error);
      }
    }
  }, []);

  const handleFormSubmit = (data: TripPrompt) => {
    setTripDetails(data);
    generateMutation.mutate(data);
  };

  const handleOpenSaveDialog = () => {
    if (!currentUser) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save your trip",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    setIsSaveDialogOpen(true);
  };

  const handleSaveTrip = async () => {
    if (!currentUser || !itinerary || !tripDetails) return;
    
    setIsSaving(true);
    try {
      const tripId = await saveTrip({
        uid: currentUser.uid,
        name: tripName || `Trip to ${tripDetails.destination}`,
        destination: tripDetails.destination,
        prompt: tripDetails,
        itinerary: itinerary,
      });
      
      toast({
        title: "Trip saved successfully",
        description: "You can view it in your saved trips",
      });
      
      setIsSaveDialogOpen(false);
      navigate("/saved-trips");
    } catch (error) {
      toast({
        title: "Failed to save trip",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl">Plan Your Trip</CardTitle>
          <CardDescription>
            Tell us about your dream vacation and our AI will create the perfect itinerary for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TripForm onSubmit={handleFormSubmit} isLoading={generateMutation.isPending} />
        </CardContent>
      </Card>

      {generateMutation.isPending && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg font-medium">Generating your perfect itinerary...</p>
          <p className="text-muted-foreground">This may take a moment</p>
        </div>
      )}

      {itinerary && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Your Personalized Itinerary</h2>
            <Button onClick={handleOpenSaveDialog}>
              Save This Trip
            </Button>
          </div>
          
          <ItineraryDisplay itinerary={itinerary} />
        </div>
      )}

      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Your Trip</DialogTitle>
            <DialogDescription>
              Give your trip a name to help you find it later.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="tripName">Trip Name</Label>
            <Input
              id="tripName"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              placeholder="E.g., Summer in Paris"
            />
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsSaveDialogOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveTrip}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Trip"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
