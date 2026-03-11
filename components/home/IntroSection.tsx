
export function IntroSection() {
    return (
        <section className="py-24 md:py-32 bg-secondary text-text-primary border-y border-border">
            <div className="container mx-auto px-4 max-w-3xl text-center space-y-8">
                <span className="text-accent uppercase tracking-[0.3em] text-xs font-bold">Our Heritage</span>
                <p className="font-heading font-normal text-3xl md:text-5xl leading-[1.3] text-primary">
                    "Draped in <span className="italic">tradition</span>, handwoven with <span className="italic">grace</span>. A celebration of India's finest silks."
                </p>
                <div className="w-16 h-[2px] bg-accent mx-auto"></div>
            </div>
        </section>
    )
}
