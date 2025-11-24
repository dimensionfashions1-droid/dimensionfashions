"use client"
import { Button } from "@/components/ui/button"

export function PromoSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-white to-muted relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[rgb(218_184_105)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image with Offer */}
          <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl animate-fade-in-up">
            <img
              src="/promotional-offer-saree-collection-discount.jpg"
              alt="10% Off Promotion"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent" />

            {/* Offer Badge */}
            <div className="absolute bottom-8 right-8 bg-gradient-to-br from-[rgb(218_184_105)] to-[rgb(208_174_95)] text-black px-8 py-6 rounded-xl shadow-2xl border border-[rgb(218_184_105)]/30">
              <p className="text-5xl font-bold font-serif">10%</p>
              <p className="text-sm font-semibold font-sans tracking-wide">Off Your First Order</p>
            </div>
          </div>

          {/* Promo Text */}
          <div className="flex flex-col justify-center space-y-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-1 h-1 bg-[rgb(218_184_105)] rounded-full" />
                <p className="text-[rgb(218_184_105)] text-sm font-bold tracking-widest uppercase font-sans">
                  Exclusive Offer
                </p>
              </div>
              <h3 className="text-5xl md:text-6xl font-serif font-bold text-foreground leading-tight">
                Elevate Your Style
              </h3>
              <p className="text-lg text-muted-foreground font-sans leading-relaxed">
                Experience the perfect blend of tradition and modernity. Our latest collection brings you authentic
                sarees crafted with precision and love.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {["Authentic handcrafted sarees", "Premium quality fabrics", "Fast & secure delivery"].map(
                (feature, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[rgb(218_184_105)] to-[rgb(208_174_95)] text-black flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-sm">
                      ✓
                    </div>
                    <p className="text-foreground font-sans">{feature}</p>
                  </div>
                ),
              )}
            </div>

            {/* Signup Button */}
            <Button
              size="lg"
              className="w-fit bg-[rgb(218_184_105)] hover:bg-[rgb(208_174_95)] text-black rounded-lg font-bold font-sans shadow-lg hover:shadow-xl transition-all"
            >
              Sign Up & Get 10% Off
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
