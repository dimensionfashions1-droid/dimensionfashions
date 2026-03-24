
export function IntroSection() {
    return (
        <section className="py-8 md:py-15 bg-accent/10 relative overflow-hidden">
            <div className="max-w-[1280px] mx-auto px-4 flex flex-col justify-center text-center space-y-8 items-center h-full my-8">
                <div className="flex flex-col text-center space-y-3">
                    <span className="text-[10px] text-accent uppercase tracking-[0.4em] font-sans font-bold block animate-reveal-up">
                        Our Philosophy
                    </span>
                    <h2 className="font-heading font-normal text-3xl md:text-4xl text-primary tracking-tight max-w-3xl mx-auto">
                        Celebrating the <span className="italic text-accent">multifaceted</span> woman through every drape.
                    </h2>
                </div>

                <p className="font-sans text-primary/60 text-sm md:text-base max-w-2xl mx-auto leading-relaxed tracking-wide">
                    From boardrooms to banquet halls, our pieces are designed to honor every facet of your journey. Experience the perfect harmony of contemporary silhouettes and age-old regional weaves.
                </p>


            </div>
        </section>
    )
}
