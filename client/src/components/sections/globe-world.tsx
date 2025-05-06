import { Globe } from "@/components/ui/globe";

export default function GlobeWorldSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-primary/5 to-90% opacity-60"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Globe visualization - left side on desktop, bottom on mobile */}
          <div className="order-2 lg:order-1 relative flex justify-center">
            <div className="relative h-[450px] w-[450px] max-w-full">
              {/* Glow effect behind globe */}
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full transform scale-75"></div>
              
              {/* The globe itself */}
              <Globe className="w-full h-full relative z-10" />
            </div>
          </div>
          
          {/* Text content - right side on desktop, top on mobile */}
          <div className="order-1 lg:order-2 text-center lg:text-left">
            <div className="inline-block px-4 py-1.5 bg-primary/20 rounded-full backdrop-blur-sm mb-4">
              <span className="text-sm font-medium text-primary">Global Travel Network</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
              Travel The World With Confidence
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              TripToss connects you to destinations worldwide, with personalized itineraries 
              that help you navigate your journey with ease. No matter where you're headed, 
              we've got your travel plans covered.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-background/50 backdrop-blur-sm p-4 rounded-xl border border-border">
                <p className="text-3xl font-bold text-primary">200+</p>
                <p className="text-sm text-muted-foreground">Countries Covered</p>
              </div>
              <div className="bg-background/50 backdrop-blur-sm p-4 rounded-xl border border-border">
                <p className="text-3xl font-bold text-primary">25k+</p>
                <p className="text-sm text-muted-foreground">Cities Mapped</p>
              </div>
              <div className="col-span-2 md:col-span-1 bg-background/50 backdrop-blur-sm p-4 rounded-xl border border-border">
                <p className="text-3xl font-bold text-primary">1M+</p>
                <p className="text-sm text-muted-foreground">Happy Travelers</p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Our AI technology ensures your trip is tailored to your preferences, 
              with real-time updates and smart accommodation tracking to help you 
              find your way back to your lodging with ease.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}