
const BRANDS = [
    "Vogue India", "Harper's Bazaar", "Elle", "Grazia", "The Hindu", "Femina"
]

export function BrandCarousel() {
    return (
        <section className="py-20 border-y border-primary/5 bg-background overflow-hidden">
            <div className="container mx-auto px-6 md:px-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-24 opacity-30 grayscale hover:opacity-60 transition-opacity duration-1000">
                    <span className="text-[10px] font-sans uppercase tracking-[0.4em] font-bold text-primary/40 whitespace-nowrap">
                        Featured In
                    </span>
                    <div className="flex flex-wrap justify-center md:flex-nowrap items-center gap-12 md:gap-24 w-full">
                        {BRANDS.map((brand) => (
                            <span 
                                key={brand} 
                                className="font-heading italic text-xl md:text-2xl text-primary tracking-wider whitespace-nowrap"
                            >
                                {brand}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
