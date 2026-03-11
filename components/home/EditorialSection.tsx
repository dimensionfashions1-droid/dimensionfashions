import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

export function EditorialSection() {
    return (
        <section className="bg-secondary text-text-primary">
            <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative h-[600px] md:h-[800px] w-full p-8 md:p-16 flex items-center justify-center">
                    <div className="relative w-full h-full border border-primary/20 rounded-t-full overflow-hidden shadow-sm">
                        <Image
                            src="https://images.unsplash.com/photo-1596455113045-3129ba0ec15f?q=80&w=2000&auto=format&fit=crop"
                            alt="Editorial"
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-1000 ease-in-out"
                        />
                        <div className="absolute inset-0 border-[4px] border-background/20 rounded-t-full z-10 m-3 pointer-events-none"></div>
                    </div>
                    <div className="absolute inset-0 bg-black/10" />
                </div>
                {/* BLACK CARD */}
                <div className="flex flex-col justify-center p-8 md:p-24 space-y-8 bg-background relative border-l border-primary/10">
                    <span className="font-sans text-xs text-accent uppercase tracking-[0.3em] font-bold">001 — THE KANJIVARAM EDIT</span>

                    <h2 className="font-heading font-normal text-5xl md:text-7xl capitalize leading-[1.1] tracking-wide text-primary">
                        Woven<br />Heritage
                    </h2>
                    <p className="text-text-secondary text-lg leading-relaxed max-w-md font-sans">
                        A collection defined by rich palettes and intricate zari detailing. We embraced tradition and masterful artistry to reveal the timeless grace of pure silk.
                    </p>

                    <Link href="/collections/monochrome" className="inline-flex items-center gap-2 text-sm font-bold tracking-[0.2em] uppercase text-primary hover:text-accent transition-colors group">
                        EXPLORE THE EDIT
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                    </Link>
                </div>
            </div>
        </section>
    )
}
