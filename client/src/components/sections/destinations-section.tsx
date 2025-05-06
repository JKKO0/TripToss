import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { SAMPLE_DESTINATIONS } from "@/lib/types";

export default function DestinationsSection() {
  const [_, navigate] = useLocation();

  const handleGetItinerary = (destination: string) => {
    navigate(`/plan-trip?destination=${encodeURIComponent(destination)}`);
  };

  return (
    <section id="destinations" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Popular Destinations</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Get inspired with these trending locations and ready-to-use travel guides.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_DESTINATIONS.map((destination) => (
            <div 
              key={destination.id} 
              className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-border group"
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={destination.image} 
                  alt={`${destination.name}, ${destination.country}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{destination.name}, {destination.country}</h3>
                  <div className="flex items-center text-sm">
                    <span className="flex items-center">
                      <i className="fas fa-star text-yellow-400 mr-1"></i>
                      {destination.rating}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{destination.tags.join(", ")}</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="text-sm text-muted-foreground">
                    <i className="far fa-clock mr-1"></i>
                    {destination.duration}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <i className="fas fa-tag mr-1"></i>
                    {destination.budget}
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-4">{destination.description}</p>
                <Button 
                  variant="outline" 
                  className="w-full bg-primary/10 text-primary hover:bg-primary/20"
                  onClick={() => handleGetItinerary(`${destination.name}, ${destination.country}`)}
                >
                  Get Itinerary
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
            View All Destinations
          </Button>
        </div>
      </div>
    </section>
  );
}
