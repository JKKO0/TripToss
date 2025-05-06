import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { getUserTrips, deleteTrip, SavedTrip } from "@/lib/trip-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowRight, 
  Calendar, 
  DollarSign, 
  Tag, 
  PlaneLanding, 
  Trash, 
  AlertCircle,
  Loader2,
  Globe,
  MapPin,
  Search,
  type LucideIcon,
  Ship,
  Palmtree,
  Mountain,
  Coffee,
  Utensils,
  Camera,
  Building2 as Museum,
  Music,
  Landmark,
  Backpack
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Map interest names to icons
const interestIcons: Record<string, LucideIcon> = {
  "Beach": Palmtree,
  "Mountains": Mountain,
  "Food": Utensils,
  "Photography": Camera,
  "History": Landmark,
  "Culture": Museum,
  "Adventure": Backpack,
  "Nature": Palmtree,
  "Nightlife": Music,
  "Relaxation": Coffee,
  "Architecture": Landmark,
  "Shopping": Backpack,
  "Cruise": Ship
};

export default function SavedTrips() {
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<SavedTrip[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [tripToDelete, setTripToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null);
  const [_, navigate] = useLocation();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  // Collect all unique interests from the trips
  const allInterests = Array.from(new Set(trips.flatMap(trip => trip.prompt.interests)));

  useEffect(() => {
    async function fetchTrips() {
      if (!currentUser) {
        setTrips([]);
        setFilteredTrips([]);
        setIsLoading(false);
        return;
      }

      try {
        const userTrips = await getUserTrips(currentUser.uid);
        setTrips(userTrips);
        setFilteredTrips(userTrips);
      } catch (error) {
        console.error("Error fetching trips:", error);
        toast({
          title: "Error loading trips",
          description: "Failed to load your saved trips. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchTrips();
  }, [currentUser, toast]);

  // Filter trips based on search term and selected interest
  useEffect(() => {
    if (trips.length === 0) return;
    
    let filtered = [...trips];
    
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(trip => 
        trip.name.toLowerCase().includes(search) || 
        trip.destination.toLowerCase().includes(search)
      );
    }
    
    if (selectedInterest) {
      filtered = filtered.filter(trip => 
        trip.prompt.interests.includes(selectedInterest)
      );
    }
    
    setFilteredTrips(filtered);
  }, [searchTerm, selectedInterest, trips]);

  const handleDeleteTrip = async () => {
    if (!tripToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteTrip(tripToDelete);
      const updatedTrips = trips.filter(trip => trip.id !== tripToDelete);
      setTrips(updatedTrips);
      setFilteredTrips(updatedTrips);
      toast({
        title: "Trip deleted",
        description: "Your trip has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete trip. Please try again.",
        variant: "destructive",
      });
    } finally {
      setTripToDelete(null);
      setIsDeleting(false);
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedInterest(null);
    setFilteredTrips(trips);
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!currentUser && !isLoading) {
      navigate("/login");
    }
  }, [currentUser, isLoading, navigate]);

  if (!currentUser && !isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertCircle className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
        <p className="text-muted-foreground mb-6">
          Please sign in to view your saved trips.
        </p>
        <Button onClick={() => navigate("/login")}>
          Sign In
        </Button>
      </div>
    );
  }

  // Function to get an icon for an interest
  const getInterestIcon = (interest: string) => {
    const IconComponent = interestIcons[interest] || Globe;
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your Travel Collection</h1>
          <p className="text-muted-foreground mt-1">Manage and revisit your saved itineraries</p>
        </div>
        <Button 
          onClick={() => navigate("/plan-trip")}
          className="px-6 bg-gradient-to-r from-primary to-primary/80"
          size="lg"
        >
          <PlaneLanding className="mr-2 h-5 w-5" />
          Plan a New Trip
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="rounded-xl overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {trips.length > 0 && (
            <div className="mb-8 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by destination or trip name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {searchTerm || selectedInterest ? (
                  <Button variant="outline" onClick={handleResetFilters}>
                    Clear Filters
                  </Button>
                ) : null}
              </div>
              
              {allInterests.length > 0 && (
                <ScrollArea className="w-full whitespace-nowrap pb-2">
                  <div className="flex space-x-2 p-1">
                    {allInterests.map((interest) => (
                      <Badge
                        key={interest}
                        variant={selectedInterest === interest ? "default" : "outline"}
                        className={`px-3 py-1 cursor-pointer ${
                          selectedInterest === interest 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-muted"
                        }`}
                        onClick={() => setSelectedInterest(selectedInterest === interest ? null : interest)}
                      >
                        <span className="flex items-center">
                          {getInterestIcon(interest)}
                          <span className="ml-1">{interest}</span>
                        </span>
                      </Badge>
                    ))}
                  </div>
                </ScrollArea>
              )}
              
              {filteredTrips.length === 0 && (
                <div className="bg-muted/30 rounded-lg p-8 text-center">
                  <Search className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No matching trips found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try changing your search terms or filters
                  </p>
                  <Button variant="outline" onClick={handleResetFilters}>
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          )}

          {!isLoading && trips.length === 0 && (
            <Card className="p-8 text-center rounded-xl border border-muted bg-card/50">
              <div className="bg-primary/5 rounded-full p-5 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <PlaneLanding className="h-12 w-12 text-primary/70" />
              </div>
              <h2 className="text-2xl font-bold mb-3">No saved trips yet</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Start planning your dream vacation and save your itineraries here. Our AI will create a personalized travel plan based on your preferences.
              </p>
              <Button 
                onClick={() => navigate("/plan-trip")}
                className="px-8"
                size="lg"
              >
                Plan Your First Trip
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Card>
          )}

          {filteredTrips.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrips.map((trip) => (
                <Card key={trip.id} className="rounded-xl overflow-hidden border-border/50 hover:shadow-xl transition-all duration-300 hover:border-primary/20 group">
                  <div className="relative h-52 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-6 flex flex-col justify-between overflow-hidden">
                    <div className="absolute top-3 right-3 z-10">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTripToDelete(trip.id);
                        }}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <Badge variant="outline" className="self-start bg-background/70 backdrop-blur-sm mb-2">
                      {trip.prompt.duration}
                    </Badge>
                    
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold mb-1 group-hover:text-primary transition-colors">
                        {trip.name}
                      </h3>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-primary mr-1" />
                        <span className="text-sm font-medium">{trip.destination}</span>
                      </div>
                    </div>
                    
                    <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Globe className="h-64 w-64 text-primary" strokeWidth={0.5} />
                    </div>
                  </div>
                  
                  <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {trip.prompt.interests.slice(0, 4).map((interest, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="bg-primary/5 hover:bg-primary/10 transition-colors"
                        >
                          <span className="flex items-center">
                            {getInterestIcon(interest)}
                            <span className="ml-1">{interest}</span>
                          </span>
                        </Badge>
                      ))}
                      {trip.prompt.interests.length > 4 && (
                        <Badge variant="outline">
                          +{trip.prompt.interests.length - 4} more
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <div className="bg-primary/10 rounded-full p-1.5 mr-2">
                          <DollarSign className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <span className="text-muted-foreground">{trip.prompt.budget}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-primary/10 rounded-full p-1.5 mr-2">
                          <Calendar className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <span className="text-muted-foreground">
                          {new Date(trip.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    {trip.prompt.accommodation && (
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Tag className="h-3.5 w-3.5 mr-2" />
                          <span>Staying at: {trip.prompt.accommodation.length > 30 
                            ? `${trip.prompt.accommodation.substring(0, 30)}...` 
                            : trip.prompt.accommodation}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => navigate(`/trip/${trip.id}`)}
                    >
                      View Itinerary
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      <AlertDialog open={!!tripToDelete} onOpenChange={(open) => !open && setTripToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this trip. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteTrip}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
