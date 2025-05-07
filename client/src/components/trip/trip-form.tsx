import { useEffect } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tripPromptSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InterestSelection from "./interest-selection";
import { Loader2 } from "lucide-react";
import { FaMapMarkerAlt, FaCalendar, FaMoneyBillWave, FaBed, FaBolt } from "react-icons/fa";

type FormValues = z.infer<typeof tripPromptSchema>;

interface TripFormProps {
  onSubmit: (data: FormValues) => void;
  simplified?: boolean;
  isLoading?: boolean;
}

export default function TripForm({ onSubmit, simplified = false, isLoading = false }: TripFormProps) {
  const [location] = useLocation();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(tripPromptSchema),
    defaultValues: {
      destination: "",
      duration: "",
      budget: "",
      accommodation: "",
      interests: [],
    },
  });

  // Check for data in sessionStorage first, then URL params
  useEffect(() => {
    // First try to get data from sessionStorage (data from homepage form)
    try {
      const savedData = sessionStorage.getItem('tripFormData');
      if (savedData) {
        const parsedData = JSON.parse(savedData) as FormValues;
        
        if (parsedData.destination) form.setValue("destination", parsedData.destination);
        if (parsedData.duration) form.setValue("duration", parsedData.duration);
        if (parsedData.budget) form.setValue("budget", parsedData.budget);
        if (parsedData.accommodation) form.setValue("accommodation", parsedData.accommodation);
        if (parsedData.interests && parsedData.interests.length > 0) {
          form.setValue("interests", parsedData.interests);
        }
        
        // Clear the session storage to prevent reuse
        sessionStorage.removeItem('tripFormData');
        return;
      }
    } catch (error) {
      console.error("Error retrieving form data from sessionStorage:", error);
    }
    
    // If no data in sessionStorage, try URL parameters
    if (location && location.startsWith("/plan-trip")) {
      const params = new URLSearchParams(location.split("?")[1] || "");
      
      const destination = params.get("destination");
      const duration = params.get("duration");
      const budget = params.get("budget");
      const accommodation = params.get("accommodation");
      const interests = params.getAll("interests");
      
      if (destination) form.setValue("destination", destination);
      if (duration) form.setValue("duration", duration);
      if (budget) form.setValue("budget", budget);
      if (accommodation) form.setValue("accommodation", accommodation);
      if (interests.length > 0) form.setValue("interests", interests);
    }
  }, [location, form]);

  const handleSubmit = (data: FormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className={`grid grid-cols-1 ${simplified ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-3'} gap-4`}>
          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={simplified ? "block text-sm font-medium text-neutral-dark mb-1" : ""}>Destination</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      placeholder="Where to?" 
                      className={simplified ? "w-full p-3 rounded-lg border border-neutral-light focus:outline-none focus:ring-2 focus:ring-primary pl-10" : "pl-10"}
                      {...field} 
                    />
                      <FaMapMarkerAlt className="absolute left-3 top-3.5 text-neutral-dark h-4 w-4" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={simplified ? "block text-sm font-medium text-neutral-dark mb-1" : ""}>Duration</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className={simplified ? "w-full p-3 rounded-lg border border-neutral-light focus:outline-none focus:ring-2 focus:ring-primary pl-10" : "pl-10"}>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3-5 days">3-5 days</SelectItem>
                        <SelectItem value="1 week">1 week</SelectItem>
                        <SelectItem value="2 weeks">2 weeks</SelectItem>
                        <SelectItem value="More than 2 weeks">More than 2 weeks</SelectItem>
                      </SelectContent>
                    </Select>
                    <FaCalendar className="absolute left-3 top-3.5 text-neutral-dark h-4 w-4" />
                    </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={simplified ? "block text-sm font-medium text-neutral-dark mb-1" : ""}>Budget</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className={simplified ? "w-full p-3 rounded-lg border border-neutral-light focus:outline-none focus:ring-2 focus:ring-primary pl-10" : "pl-10"}>
                        <SelectValue placeholder="Select budget" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Budget friendly">Budget friendly</SelectItem>
                        <SelectItem value="Mid-range">Mid-range</SelectItem>
                        <SelectItem value="Luxury">Luxury</SelectItem>
                      </SelectContent>
                    </Select>
                    <FaMoneyBillWave className="absolute left-3 top-3.5 text-neutral-dark h-4 w-4" />
                    </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="accommodation"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={simplified ? "block text-sm font-medium text-neutral-dark mb-1" : ""}>Accommodation Location</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    placeholder="Where are you staying? (hotel, address, etc.)" 
                    className={simplified ? "w-full p-3 rounded-lg border border-neutral-light focus:outline-none focus:ring-2 focus:ring-primary pl-10" : "pl-10"}
                    {...field} 
                  />
                  <FaBed className="absolute left-3 top-3.5 text-neutral-dark h-4 w-4" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="interests"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={simplified ? "block text-sm font-medium text-neutral-dark mb-2" : ""}>Interests</FormLabel>
              <FormControl>
                <InterestSelection 
                  selectedInterests={field.value}
                  onChange={(interests) => field.onChange(interests)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-center">
          <Button 
            type="submit" 
            className={`px-5 py-3 font-semibold rounded-lg flex items-center transition-all ${simplified ? "bg-primary hover:bg-primary/90 text-white" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FaBolt className="mr-2 h-4 w-4" />
                Generate Travel Plan
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
