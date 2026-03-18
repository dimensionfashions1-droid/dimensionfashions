
export function IntroSection() {
    return (
        <section className="py-24 md:py-40 bg-background relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-5xl text-center space-y-12">
                <div className="overflow-hidden">
                    <span className="text-primary/40 uppercase tracking-[0.4em] text-[10px] md:text-xs font-sans font-bold block animate-reveal-up">
                        The Philosophy
                    </span>
                </div>
                
                <h2 className="font-heading font-normal text-4xl md:text-6xl lg:text-7xl leading-[1.1] text-primary max-w-4xl mx-auto tracking-tight">
                    "Draped in <span className="italic">heritage</span>, <br className="hidden md:block" />
                    curated for the <span className="italic text-accent">modern</span> visionary."
                </h2>
                
                <p className="font-sans text-primary/60 text-sm md:text-base max-w-xl mx-auto leading-relaxed tracking-wide">
                    Each weave tells a story of centuries-old craftsmanship, hand-picked for those who seek timeless elegance amidst the ephemeral.
                </p>

                <div className="pt-8">
                    <div className="w-px h-24 bg-primary/10 mx-auto" />
                </div>
            </div>
        </section>
    )
}
