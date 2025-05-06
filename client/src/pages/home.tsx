import HeroSection from "@/components/sections/hero-section";
import FeaturesSection from "@/components/sections/features-section";
import HowItWorksSection from "@/components/sections/how-it-works-section";
import GlobeWorldSection from "@/components/sections/globe-world";
import DemoSection from "@/components/sections/demo-section";
import DestinationsSection from "@/components/sections/destinations-section";
import TestimonialsSection from "@/components/sections/testimonials-section";
import CtaSection from "@/components/sections/cta-section";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <GlobeWorldSection />
      <DemoSection />
      <DestinationsSection />
      <TestimonialsSection />
      <CtaSection />
    </div>
  );
}
