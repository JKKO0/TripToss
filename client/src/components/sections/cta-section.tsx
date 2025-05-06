import { useState } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function CtaSection() {
  const [submitted, setSubmitted] = useState(false);
  const [_, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    toast({
      title: "Thanks for your interest!",
      description: "We'll notify you when early access is available.",
    });
    setSubmitted(true);
  };

  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready for Your AI-Planned Adventure?</h2>
          <p className="text-xl opacity-90 mb-8">Join thousands of travelers enjoying stress-free, personalized trip planning.</p>
          
          {!submitted ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-xl mx-auto mb-8">
                <div className="flex flex-col sm:flex-row gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input 
                            placeholder="Enter your email" 
                            className="px-4 py-3 rounded-lg bg-white text-neutral-dark focus:outline-none focus:ring-2 focus:ring-white h-auto"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-white/90" />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="px-6 py-3 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg transition-colors h-auto"
                  >
                    Get Early Access
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <div className="bg-white/10 rounded-lg p-6 max-w-xl mx-auto mb-8">
              <h3 className="text-xl font-semibold mb-2">Thanks for signing up!</h3>
              <p className="mb-4">We'll notify you when early access is available.</p>
              <Button 
                onClick={() => navigate("/plan-trip")} 
                className="bg-accent hover:bg-accent/90"
              >
                Try the Demo Now
              </Button>
            </div>
          )}
          
          <p className="text-sm opacity-80">No credit card required. Start planning your dream trips for free.</p>
        </div>
      </div>
    </section>
  );
}
