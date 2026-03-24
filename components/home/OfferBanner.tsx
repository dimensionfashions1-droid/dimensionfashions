import Link from "next/link"

export function OfferBanner() {
    return (
        <section className="bg-primary text-secondary py-16 md:py-20">
            <div className="max-w-[1280px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                <div className="space-y-4 max-w-2xl">
                    <span className="text-[10px] text-accent uppercase tracking-[0.4em] font-sans font-bold block">
                        End of Season Sale
                    </span>
                    <h2 className="font-heading font-normal text-3xl md:text-4xl lg:text-5xl leading-tight">
                        Up to <span className="italic text-accent">50% Off</span> on Heritage Silks
                    </h2>
                    <p className="font-sans text-secondary/70 text-sm tracking-wide">
                        Refresh your festive wardrobe with our carefully curated clearance collection. Limited time only.
                    </p>
                </div>
                <div className="shrink-0 pt-4 md:pt-0">
                    <Link
                        href="/sale"
                        className="inline-flex items-center justify-center bg-accent text-primary text-[10px] font-sans font-bold uppercase tracking-[0.25em] px-10 py-5 transition-all duration-500 hover:bg-white rounded-full"
                    >
                        Shop the Sale
                    </Link>
                </div>
            </div>
        </section>
    )
}
