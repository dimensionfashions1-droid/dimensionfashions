
import Link from "next/link"
import Image from "next/image"

export function EditorialSection() {
    return (
        <section className="py-20    ">
            <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative h-[600px] md:h-screen w-full bg-neutral-900">
                    <Image
                        src="https://images.unsplash.com/photo-1536766820879-059fec98ec0a?q=80&w=1887&auto=format&fit=crop"
                        alt="Editorial"
                        fill
                        className="object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-in-out"
                    />
                    <div className="absolute inset-0 bg-black/10" />
                </div>
                {/* BLACK CARD */}
                <div className="flex flex-col justify-center p-8 md:p-24 space-y-8 bg-background text-foreground relative">
                    <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest absolute top-8 left-8">001 — THE MONOCHROME EDIT</span>

                    <h2 className="font-heading font-bold text-5xl md:text-7xl uppercase leading-[0.9] tracking-tighter text-foreground">
                        Silent<br />Noise
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                        A collection defined by strict palettes and fluid silhouettes. We stripped away the unnecessary to reveal the essential structure of modern menswear.
                    </p>

                    <Link href="/collections/monochrome" className="inline-flex items-center gap-2 text-sm font-bold tracking-widest uppercase hover:underline underline-offset-4 text-foreground">
                        View Lookbook <span>→</span>
                    </Link>
                </div>
            </div>
        </section>
    )
}
