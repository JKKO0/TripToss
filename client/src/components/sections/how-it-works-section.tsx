export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background opacity-50"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-block px-4 py-1.5 bg-primary/20 rounded-full backdrop-blur-sm mb-4">
            <span className="text-sm font-medium text-primary">Simple Process</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
            How Trip<span className="text-primary">Toss</span> Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Creating your perfect trip is as easy as 1-2-3. Let our AI do the hard work while you focus on enjoying your journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {/* Step 1 */}
          <div className="relative group">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">1</div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Tell Us Your Travel Details</h3>
              <p className="text-muted-foreground">Choose your destination, dates, accommodation location, and budget to start planning.</p>
              <div className="mt-6 h-52 w-full rounded-xl bg-card border border-border overflow-hidden group-hover:shadow-xl transition-shadow">
                <img 
                  src="https://images.unsplash.com/photo-1512295767273-ac109ac3acfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80" 
                  alt="Selecting destination on a map" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
          
          {/* Step 2 */}
          <div className="relative group">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">2</div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Share Your Interests</h3>
              <p className="text-muted-foreground">Tell us what you enjoy: food, adventure, culture, relaxation, or family activities.</p>
              <div className="mt-6 h-52 w-full rounded-xl bg-card border border-border overflow-hidden group-hover:shadow-xl transition-shadow">
                <img 
                  src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80" 
                  alt="Selecting travel preferences and interests" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
          
          {/* Step 3 */}
          <div className="relative group">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">3</div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Get Your AI Itinerary</h3>
              <p className="text-muted-foreground">Review your personalized plan with daily activities, dining options, and navigation back to your accommodation.</p>
              <div className="mt-6 h-52 w-full rounded-xl bg-card border border-border overflow-hidden group-hover:shadow-xl transition-shadow">
                <img 
                  src="https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80" 
                  alt="Viewing a generated travel itinerary" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
