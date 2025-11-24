"use client"

import { useState, useEffect } from "react"

const slides = [
  {
    id: 1,
    image: "/beautiful-woman-wearing-luxury-bridal-saree-with-g.jpg",
    title: "Bridal Elegance",
    subtitle: "Handcrafted Bridal Sarees",
    description: "Stunning designs for your special day",
    cta: "Explore Bridal",
    badge: "20% OFF",
  },
  {
    id: 2,
    image: "/elegant-woman-in-royal-purple-silk-saree-with-gold.jpg",
    title: "Royal Luxury",
    subtitle: "Premium Silk Collection",
    description: "Experience timeless sophistication",
    cta: "Shop Silk",
    badge: "NEW",
  },
  {
    id: 3,
    image: "/graceful-woman-in-cream-cotton-saree-traditional-l.jpg",
    title: "Everyday Grace",
    subtitle: "Cotton Collection",
    description: "Comfortable and elegant everyday wear",
    cta: "Shop Cotton",
    badge: "COMFORT",
  },
  {
    id: 4,
    image: "/modern-woman-in-contemporary-designer-saree-with-t.jpg",
    title: "Modern Designer",
    subtitle: "Contemporary Collection",
    description: "Contemporary designs with traditional touch",
    cta: "Explore Designer",
    badge: "TRENDING",
  },
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  useEffect(() => {
    if (!isAutoPlay) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlay])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlay(false)
    setTimeout(() => setIsAutoPlay(true), 8000)
  }

  const slide = slides[currentSlide]

  return (
    <section className="relative w-full h-screen md:h-[650px] overflow-hidden bg-black pattern-diagonal">
      {slides.map((s, index) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        >
          <img src={s.image || "/placeholder.svg"} alt={s.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      ))}

      <div className="relative z-10 h-full mx-auto px-4 md:px-8 flex items-center max-w-7xl">
        <div className="max-w-2xl">
          <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center gap-3">
              <div className="w-12 h-1 bg-gradient-to-r from-[rgb(218_184_105)] to-transparent rounded-full"></div>
              <p className="text-[rgb(218_184_105)] text-xs font-bold tracking-widest uppercase font-sans">
                {slide.subtitle}
              </p>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white leading-tight tracking-tight">
              {slide.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-100 max-w-xl leading-relaxed font-sans">{slide.description}</p>

            <div className="flex items-center gap-4 pt-6">
              <button className="px-8 py-4 bg-[rgb(218_184_105)] hover:bg-[rgb(208_174_95)] text-black font-serif font-semibold rounded-lg transition-all duration-300 hover:shadow-xl hover:shadow-[rgb(218_184_105)]/30 text-lg">
                {slide.cta}
              </button>
              <div className="px-6 py-3 border-2 border-[rgb(218_184_105)]/50 rounded-lg backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all font-sans">
                <span className="text-[rgb(218_184_105)] font-bold text-sm uppercase tracking-wide">{slide.badge}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-[rgb(218_184_105)] w-6 h-2 shadow-lg shadow-[rgb(218_184_105)]/50"
                : "bg-white/40 hover:bg-white/70 w-2 h-2"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
