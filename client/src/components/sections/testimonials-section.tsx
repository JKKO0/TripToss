import { TESTIMONIALS } from "@/lib/types";

export default function TestimonialsSection() {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fas fa-star"></i>);
    }
    
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }
    
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
    }
    
    return stars;
  };

  return (
    <section id="testimonials" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Travelers Are Saying</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Real adventures planned by AI, experienced by real people.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {TESTIMONIALS.map((testimonial) => (
            <div key={testimonial.id} className="bg-card p-6 rounded-xl shadow-sm border border-border">
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-3">
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <div className="flex text-yellow-400 text-sm">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground">{`"${testimonial.text}"`}</p>
              <div className="mt-4 text-sm text-muted-foreground/80">Trip: {testimonial.trip}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
