import { Link } from "wouter";
import { PlaneTakeoff } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black/90 text-muted-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-primary text-white p-1.5 rounded">
                <PlaneTakeoff className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-white">Trip<span className="text-primary">Toss</span></span>
            </div>
            <p className="mb-4">AI-powered travel planning that creates personalized itineraries based on your preferences.</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white" aria-label="Twitter">
                <i className="fab fa-twitter text-lg"></i>
              </a>
              <a href="#" className="hover:text-white" aria-label="Instagram">
                <i className="fab fa-instagram text-lg"></i>
              </a>
              <a href="#" className="hover:text-white" aria-label="Facebook">
                <i className="fab fa-facebook text-lg"></i>
              </a>
              <a href="#" className="hover:text-white" aria-label="LinkedIn">
                <i className="fab fa-linkedin text-lg"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Features</h3>
            <ul className="space-y-2">
              <li><Link href="/#features" className="hover:text-white">AI Trip Planning</Link></li>
              <li><Link href="/#destinations" className="hover:text-white">Destination Guides</Link></li>
              <li><Link href="/#features" className="hover:text-white">Personalized Itineraries</Link></li>
              <li><Link href="/#features" className="hover:text-white">Budget Optimization</Link></li>
              <li><Link href="/saved-trips" className="hover:text-white">Trip Sharing</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">FAQs</a></li>
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
              <li><a href="#" className="hover:text-white">Feedback</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} TripToss. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
