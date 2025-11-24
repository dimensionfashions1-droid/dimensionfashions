"use client"

import { Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Delhi",
    rating: 5,
    text: "The quality of the saree exceeded my expectations. The craftsmanship is impeccable and delivery was prompt!",
    image: "/woman-avatar-portrait.jpg",
  },
  {
    id: 2,
    name: "Anjali Patel",
    role: "Mumbai",
    rating: 5,
    text: "Beautiful collection! I ordered the bridal saree and it was absolutely stunning. Highly recommend Silkara!",
    image: "/woman-avatar-portrait.jpg",
  },
  {
    id: 3,
    name: "Neha Gupta",
    role: "Bangalore",
    rating: 5,
    text: "Amazing experience from browsing to delivery. The customer service team was so helpful. Will definitely order again!",
    image: "/woman-avatar-portrait.jpg",
  },
]

export function Testimonials() {
  return (
    <section className="py-24 bg-white pattern-diagonal">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-[rgb(218_184_105)]" />
            <p className="text-[rgb(218_184_105)] text-sm font-bold tracking-widest uppercase font-sans">
              Customer Love
            </p>
            <div className="w-8 h-px bg-[rgb(218_184_105)]" />
          </div>
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-foreground">What Our Customers Say</h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 animate-fade-in-scale border border-border hover:border-[rgb(218_184_105)]/30"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Rating */}
              <div className="flex gap-1 mb-5">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[rgb(218_184_105)] text-[rgb(218_184_105)]" />
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground mb-6 leading-relaxed italic font-sans">"{testimonial.text}"</p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-border">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[rgb(218_184_105)]/20"
                />
                <div>
                  <p className="font-serif font-bold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground font-sans">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
