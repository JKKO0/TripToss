import { useState } from "react";
import { Button } from "@/components/ui/button";

const exampleInput = {
  destination: "Tokyo, Japan",
  duration: "5 days",
  budget: "Mid-range",
  interests: ["Food", "Technology", "Culture"]
};

const exampleItinerary = {
  days: [
    {
      day: 1,
      title: "Arrival & Tokyo Essentials",
      activities: [
        {
          time: "9:00 AM",
          title: "Meiji Shrine & Yoyogi Park",
          description: "Start with a peaceful morning at this iconic shrine surrounded by forest."
        },
        {
          time: "12:30 PM",
          title: "Lunch at Harajuku Gyoza Lou",
          description: "Enjoy delicious, affordable gyoza in the heart of Harajuku."
        },
        {
          time: "2:00 PM",
          title: "Takeshita Street & Harajuku",
          description: "Experience Japan's youth culture and unique fashion scene."
        },
        {
          time: "6:00 PM",
          title: "Dinner at Shibuya Crossing Area",
          description: "Watch the famous crossing then enjoy dinner at a local izakaya."
        }
      ]
    },
    {
      day: 2,
      title: "Tech & Culture",
      activities: [
        {
          time: "10:00 AM",
          title: "TeamLab Borderless Digital Art Museum",
          description: "Immerse yourself in this incredible digital art space."
        },
        {
          time: "2:00 PM",
          title: "Akihabara Electric Town",
          description: "Explore the center of anime and gaming culture."
        }
      ]
    }
  ]
};

export default function DemoSection() {
  const [generating, setGenerating] = useState(false);
  const [showFullItinerary, setShowFullItinerary] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
    }, 1500);
  };

  return (
    <section className="py-16 bg-neutral-dark text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">See the Magic in Action</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Watch how VoyageurAI transforms your preferences into the perfect itinerary in seconds.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="bg-neutral-dark p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Example: 5 Days in Tokyo</h3>
              
              <div className="mb-8 bg-gray-800 rounded-lg p-4">
                <div className="mb-4">
                  <div className="text-sm text-gray-400 mb-1">Destination</div>
                  <div className="bg-gray-700 px-3 py-2 rounded text-white">{exampleInput.destination}</div>
                </div>
                <div className="mb-4">
                  <div className="text-sm text-gray-400 mb-1">Duration</div>
                  <div className="bg-gray-700 px-3 py-2 rounded text-white">{exampleInput.duration}</div>
                </div>
                <div className="mb-4">
                  <div className="text-sm text-gray-400 mb-1">Budget</div>
                  <div className="bg-gray-700 px-3 py-2 rounded text-white">{exampleInput.budget}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Interests</div>
                  <div className="flex flex-wrap gap-2">
                    {exampleInput.interests.map((interest, index) => (
                      <span key={index} className="px-2 py-1 bg-primary rounded-full text-xs font-medium">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  className="bg-primary text-white" 
                  onClick={handleGenerate}
                  disabled={generating}
                >
                  <i className="fas fa-magic mr-2"></i>
                  {generating ? "Generating..." : "Generate Now"}
                </Button>
              </div>
            </div>
            
            <div className="bg-white text-neutral-dark rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Your Tokyo Itinerary</h3>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-500 hover:text-primary" aria-label="Save itinerary">
                    <i className="far fa-bookmark"></i>
                  </button>
                  <button className="p-2 text-gray-500 hover:text-primary" aria-label="Share itinerary">
                    <i className="fas fa-share-alt"></i>
                  </button>
                </div>
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-hide pr-2">
                {exampleItinerary.days.map((day, dayIndex) => (
                  <div 
                    key={dayIndex} 
                    className={`border-l-4 ${dayIndex === 0 ? 'border-primary' : 'border-secondary'} pl-4 pb-5`}
                  >
                    <h4 className="font-semibold mb-2">{`Day ${day.day}: ${day.title}`}</h4>
                    <ul className="space-y-3">
                      {day.activities.map((activity, activityIndex) => (
                        <li key={activityIndex}>
                          <div className="flex items-start">
                            <span 
                              className={`${dayIndex === 0 ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'} text-xs font-medium px-2 py-1 rounded mr-2 mt-0.5`}
                            >
                              {activity.time}
                            </span>
                            <div>
                              <p className="font-medium">{activity.title}</p>
                              <p className="text-sm text-gray-600">{activity.description}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                
                <button 
                  className="w-full mt-2 text-primary text-sm font-medium hover:underline"
                  onClick={() => setShowFullItinerary(!showFullItinerary)}
                >
                  {showFullItinerary ? "Show less" : "View full 5-day itinerary"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
