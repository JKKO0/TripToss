import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import TripForm from "@/components/trip/trip-form";
import { Card, CardContent } from "@/components/ui/card";
import { TripPrompt } from "@shared/schema";
import { GlobeEarth } from "@/components/ui/globe-earth";

export default function HeroSection() {
  const [_, navigate] = useLocation();

  const handleFormSubmit = (data: TripPrompt) => {
    sessionStorage.setItem('tripFormData', JSON.stringify(data));
    navigate('/plan-trip?autoSubmit=true');
  };

  return (
    <section className="relative overflow-hidden py-20 md:py-28 lg:py-32 bg-black">
      {/* Background radial gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-radial from-[#0a0a23] to-black opacity-80"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Hero Text */}
          <div className="text-white max-w-3xl mb-8">
            <div className="inline-block px-4 py-1.5 bg-primary/30 rounded-full backdrop-blur-sm border border-primary/20 text-white mb-6">
              <span className="text-sm font-medium">AI-Powered Trip Planning</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              Plan Your Perfect Trip with AI
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 mx-auto">
              Discover personalized travel experiences tailored to your interests. 
              Trip<span className="text-primary font-bold">Toss</span> uses AI to create perfect itineraries in seconds, 
              complete with accommodation tracking.
            </p>
          </div>

          {/* Globe Section */}
          <div className="relative mb-10 w-full max-w-xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full blur-xl opacity-40"></div>
            <GlobeEarth className="w-full max-w-lg mx-auto" />
          </div>

          {/* Buttons */}
          <div className="text-white flex flex-col items-center max-w-3xl">
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                size="lg" 
                className="bg-primary text-white hover:bg-primary/80 shadow-xl shadow-primary/20"
                onClick={() => {
                  document.querySelector('#trip-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Plan My Trip
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
                onClick={() => {
                  document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                How It Works
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" className="w-10 h-10 rounded-full border-2 border-background" alt="User avatar" />
                <img src="https://randomuser.me/api/portraits/men/47.jpg" className="w-10 h-10 rounded-full border-2 border-background" alt="User avatar" />
                <img src="https://randomuser.me/api/portraits/women/63.jpg" className="w-10 h-10 rounded-full border-2 border-background" alt="User avatar" />
              </div>
              <div className="text-sm text-gray-300">
                <span className="font-bold text-white">4,000+</span> travelers created trips this week
              </div>
            </div>
          </div>

          {/* Trip Form */}
          <div id="trip-form" className="relative mt-20 w-full max-w-lg">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/40 rounded-2xl blur-xl opacity-40"></div>
            <Card className="rounded-xl shadow-2xl border border-border/40 backdrop-blur-sm bg-background/95 relative">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">Start Your Adventure</h3>
                <TripForm onSubmit={handleFormSubmit} simplified />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
