import { FEATURES } from "@/lib/types";

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-card/50 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-block px-4 py-1.5 bg-primary/20 rounded-full backdrop-blur-sm mb-4">
            <span className="text-sm font-medium text-primary">Powerful Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
            Travel Planning Reimagined
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Say goodbye to hours of research. Our AI understands your preferences and crafts the perfect journey for you, 
            with smart accommodation tracking built-in.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.id} className="relative group">
                {/* Animated hover effect */}
                <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-primary/0 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="bg-background/80 backdrop-blur-sm p-6 rounded-xl border border-border relative z-10 h-full transition-all duration-300 group-hover:translate-y-[-4px] group-hover:shadow-xl">
                  <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <Icon className={`${feature.iconColor} text-2xl`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
