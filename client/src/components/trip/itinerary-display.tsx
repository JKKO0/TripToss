import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TripItinerary } from "@shared/schema";
import { LightbulbIcon } from "lucide-react";

interface ItineraryDisplayProps {
  itinerary: TripItinerary;
}

export default function ItineraryDisplay({ itinerary }: ItineraryDisplayProps) {
  return (
    <div className="space-y-6">
      <Card className="border-primary/20 shadow-lg shadow-primary/5">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
                Your Adventure Awaits
              </span>
            </CardTitle>
            <Badge variant="outline" className="bg-primary/10 text-primary px-3 py-1">
              {itinerary.days.length} Day{itinerary.days.length > 1 ? 's' : ''} Trip
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="prose prose-gray dark:prose-invert max-w-none mb-6">
            <p className="text-lg text-muted-foreground">{itinerary.summary}</p>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            {itinerary.days.map((day) => (
              <AccordionItem key={day.day} value={`day-${day.day}`}>
                <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-lg font-medium">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-primary/10">Day {day.day}</Badge>
                    <span>{day.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4">
                  <div className="space-y-4 pt-2">
                    {day.activities.map((activity, index) => (
                      <div key={index} className="border-l-2 border-primary/30 pl-4 py-2">
                        <div className="flex items-center mb-1">
                          <Badge variant="outline" className="mr-2 bg-background">
                            {activity.time}
                          </Badge>
                          <h4 className="font-medium">{activity.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          {itinerary.tips && itinerary.tips.length > 0 && (
            <div className="mt-8 pt-6 border-t border-border">
              <h3 className="flex items-center text-lg font-semibold mb-4">
                <LightbulbIcon className="h-5 w-5 text-yellow-500 mr-2" />
                Travel Tips
              </h3>
              <ul className="space-y-2">
                {itinerary.tips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <div className="bg-yellow-500/10 rounded-full p-1.5 mr-3 flex-shrink-0">
                      <LightbulbIcon className="h-4 w-4 text-yellow-500" />
                    </div>
                    <p className="text-sm text-muted-foreground">{tip}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
