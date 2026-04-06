import { ArrowRight } from "lucide-react"

export function CtaSection() {
    return (
        <section className="py-20 md:py-32 bg-accent/10">
            <div className="max-w-xl mx-auto px-4 text-center space-y-8">
                <div className="space-y-4">
                    <h2 className="font-heading font-normal text-3xl md:text-4xl text-primary tracking-tight">
                        Join the <span>Inner Circle</span>
                    </h2>
                    <p className="font-sans text-primary/60 text-sm tracking-wide">
                        Subscribe to receive exclusive access to new drops, styling tips, and private sale events.
                    </p>
                </div>

                <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto relative group pt-4">
                    <input
                        type="email"
                        placeholder="ENTER YOUR EMAIL"
                        required
                        className="w-full bg-transparent border-b border-primary/20 pb-3 text-[10px] font-sans tracking-[0.2em] text-primary placeholder:text-primary/40 focus:outline-none focus:border-primary transition-colors uppercase"
                        suppressHydrationWarning
                    />
                    <button
                        type="submit"
                        className="absolute right-0 top-4 bottom-3 flex items-center justify-center text-primary group-hover:text-accent transition-colors"
                        aria-label="Subscribe"
                        suppressHydrationWarning
                    >
                        <ArrowRight className="w-5 h-5 translate-x-0 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>
            </div>
        </section>
    )
}
