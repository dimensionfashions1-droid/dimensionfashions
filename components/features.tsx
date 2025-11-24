"use client"

import { Truck, Shield, RotateCcw, Headphones } from "lucide-react"

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Complimentary delivery on all orders across India",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% safe and encrypted transactions",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "30-day return policy, no questions asked",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated customer service team available always",
  },
]

export function Features() {
  return (
    <section className="py-20 bg-white border-t border-border pattern-dots">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center animate-fade-in-up p-6 rounded-lg border border-border hover:border-[rgb(218_184_105)]/50 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-4 rounded-full bg-gradient-to-br from-[rgb(218_184_105)]/20 to-[rgb(218_184_105)]/10 mb-4">
                  <Icon className="w-8 h-8 text-[rgb(218_184_105)]" />
                </div>
                <h3 className="font-serif font-bold text-foreground mb-2 text-lg">{feature.title}</h3>
                <p className="text-sm text-muted-foreground font-sans leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
