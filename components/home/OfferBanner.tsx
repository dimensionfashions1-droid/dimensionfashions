import Link from "next/link"

export function OfferBanner() {
    return (
        <section className="bg-primary text-secondary py-16 md:py-20">
            <div className="max-w-[1280px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                <div className="space-y-4 max-w-2xl">
                    <span className="text-[10px] text-accent uppercase tracking-[0.4em] font-sans font-bold block">
                        Step Into Style
                    </span>
                    <h2 className="font-heading font-normal text-3xl md:text-4xl lg:text-5xl leading-tight">
                        Your perfect look starts here
                    </h2>
                    <p className="font-sans text-secondary/70 text-sm tracking-wide">
                        Browse curated western wear crafted for modern living and effortless fashion.
                    </p>
                </div>
                <div className="shrink-0 pt-4 md:pt-0">
                    <Link
                        target="_blank"
                        href="https://maps.app.goo.gl/kicrWawkezwJxHzk7"
                        className="inline-flex items-center justify-center bg-accent text-primary text-[10px] font-sans font-bold uppercase tracking-[0.25em] px-10 py-5 transition-all duration-500 hover:bg-white rounded-full"
                    >
                        Visit Shop
                    </Link>
                </div>
            </div>
        </section>
    )
}
