"use client"

export function MarqueeSection() {
    const items = [
        "Handwoven Heritage",
        "Timeless Elegance",
        "Handwoven Heritage",
        "Timeless Elegance",
        "Handwoven Heritage",
        "Timeless Elegance",
    ]

    return (
        <section className="py-5 md:py-10 bg-primary mt-6 overflow-hidden">
            <div className="relative flex overflow-hidden select-none">
                {/* Track 1 */}
                <div className="animate-marquee flex shrink-0 items-center">
                    {items.map((text, i) => (
                        <span
                            key={`a-${i}`}
                            className="font-heading text-2xl md:text-4xl text-white tracking-[0.2em] uppercase whitespace-nowrap px-8 md:px-12 flex items-center gap-8 md:gap-12"
                        >
                            {text}
                            <span className="w-2 h-2 rounded-full bg-accent  shrink-0" />
                        </span>
                    ))}
                </div>

                {/* Track 2 (duplicate for seamless loop) */}
                <div className="animate-marquee flex shrink-0 items-center" aria-hidden="true">
                    {items.map((text, i) => (
                        <span
                            key={`b-${i}`}
                            className="font-heading text-2xl md:text-4xl text-white tracking-[0.2em] uppercase whitespace-nowrap px-8 md:px-12 flex items-center gap-8 md:gap-12"
                        >
                            {text}
                            <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
                        </span>
                    ))}
                </div>
            </div>
        </section>
    )
}
