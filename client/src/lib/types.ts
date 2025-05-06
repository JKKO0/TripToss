export interface Interest {
  id: string;
  name: string;
  icon: string;
}

// Default interests that can be selected
export const DEFAULT_INTERESTS: Interest[] = [
  { id: "food", name: "Food & Dining", icon: "utensils" },
  { id: "adventure", name: "Adventure", icon: "hiking" },
  { id: "culture", name: "Culture", icon: "landmark" },
  { id: "relaxation", name: "Relaxation", icon: "umbrella-beach" },
  { id: "shopping", name: "Shopping", icon: "shopping-bag" },
  { id: "photography", name: "Photography", icon: "camera" },
  { id: "history", name: "History", icon: "monument" },
  { id: "nature", name: "Nature", icon: "leaf" },
  { id: "nightlife", name: "Nightlife", icon: "cocktail" },
  { id: "arts", name: "Arts", icon: "palette" },
];

export interface Destination {
  id: string;
  name: string;
  country: string;
  image: string;
  rating: number;
  tags: string[];
  duration: string;
  budget: string;
  description: string;
}

// Some popular destinations for the landing page
export const SAMPLE_DESTINATIONS: Destination[] = [
  {
    id: "paris",
    name: "Paris",
    country: "France",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    rating: 4.8,
    tags: ["Culture", "Food", "Romance"],
    duration: "Perfect for 3-7 days",
    budget: "Mid-range",
    description: "Experience the city of lights with our AI-crafted itineraries featuring iconic landmarks and hidden gems."
  },
  {
    id: "kyoto",
    name: "Kyoto",
    country: "Japan",
    image: "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    rating: 4.9,
    tags: ["History", "Temples", "Gardens"],
    duration: "Perfect for 4-6 days",
    budget: "Mid-range",
    description: "Discover traditional Japan with temple visits, tea ceremonies, and serene garden strolls."
  },
  {
    id: "bali",
    name: "Bali",
    country: "Indonesia",
    image: "https://images.unsplash.com/photo-1580655653885-65763b2597d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    rating: 4.7,
    tags: ["Beaches", "Wellness", "Nature"],
    duration: "Perfect for 7-14 days",
    budget: "Budget-friendly",
    description: "Balance beach relaxation with cultural experiences in this tropical paradise."
  }
];

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  text: string;
  rating: number;
  trip: string;
}

// Testimonials for the landing page
export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Sarah M.",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    text: "Trip Toss AI created the perfect Tokyo itinerary for me! It included famous spots but also recommended local restaurants I never would have found on my own. Saved me hours of planning.",
    rating: 5,
    trip: "Japan, 8 days"
  },
  {
    id: "2",
    name: "James L.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "I was skeptical of AI planning, but wow! It created a Barcelona trip that perfectly matched my interest in architecture and food. The day-by-day schedule was incredibly helpful.",
    rating: 4.5,
    trip: "Spain, 5 days"
  },
  {
    id: "3",
    name: "Elena P.",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
    text: "As a budget traveler, I was impressed by how Trip Toss AI balanced affordable options with amazing experiences in Thailand. Helped me discover hidden beaches and authentic food markets!",
    rating: 5,
    trip: "Thailand, 14 days"
  }
];
import { IconType } from "react-icons";

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: IconType;
  iconColor: string;
  bgColor: string;
}
import {
  FaBrain,
  FaMapMarkedAlt,
  FaWallet,
  FaHandHoldingHeart,
  FaClock,
  FaCloud,
} from "react-icons/fa";
// Features for the landing page
export const FEATURES: Feature[] = [
  {
    id: "ai-suggestions",
    title: "AI-Powered Suggestions",
    description: "Our AI learns your preferences and suggests experiences you'll love, not just tourist traps.",
    icon: FaBrain,
    iconColor: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: "detailed-itineraries",
    title: "Detailed Itineraries",
    description: "Get day-by-day plans with logistics, timing, and alternatives if something doesn't go as planned.",
    icon: FaMapMarkedAlt,
    iconColor: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    id: "budget-optimization",
    title: "Budget Optimization",
    description: "Set your spending limits and we'll maximize your experiences while respecting your budget.",
    icon: FaWallet,
    iconColor: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    id: "personalized-experiences",
    title: "Personalized Experiences",
    description: "From foodies to adventure seekers, we tailor recommendations to your unique interests.",
    icon: FaHandHoldingHeart,
    iconColor: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: "time-saving",
    title: "Time-Saving Planning",
    description: "Generate complete trip plans in seconds instead of spending hours researching.",
    icon: FaClock,
    iconColor: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    id: "save-share",
    title: "Save & Share Plans",
    description: "Store your travel plans in the cloud and easily share them with friends and family.",
    icon: FaCloud,
    iconColor: "text-accent",
    bgColor: "bg-accent/10",
  },
];