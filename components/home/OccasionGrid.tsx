import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const OCCASIONS = [
    {
        title: "The Bridal Edit",
        subtitle: "Auspicious Silks",
        image: "https://images.pexels.com/photos/14545235/pexels-photo-14545235.jpeg?auto=compress&cs=tinysrgb&w=1200",
        href: "/collections/bridal",
        description: "Heirloom Kanjivarams dipped in liquid gold, crafted for the eternal bride."
    },
    {
        title: "Evening Soirée",
        subtitle: "Contemporary Drapes",
        image: "https://images.pexels.com/photos/10189028/pexels-photo-10189028.jpeg?auto=compress&cs=tinysrgb&w=1200",
        href: "/collections/evening",
        description: "Modern interpretations of traditional weaves, designed for the spotlight."
    }
]

export function OccasionGrid() {
    return (
        <section className="py-24 md:py-40 bg-background">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {OCCASIONS.map((occasion) => (
                        <Link 
                            key={occasion.title} 
                            href={occasion.href}
                            className="group relative overflow-hidden"
                        >
                            <div className="relative aspect-[16/10] overflow-hidden grayscale-[0.2] transition-all duration-[1500ms] group-hover:grayscale-0">
                                <Image
                                    src={occasion.image}
                                    alt={occasion.title}
                                    fill
                                    className="object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-700" />
                            </div>
                            
                            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 text-secondary">
                                <div className="space-y-4 translate-y-8 group-hover:translate-y-0 transition-transform duration-700">
                                    <div className="space-y-2">
                                        <span className="text-[10px] md:text-xs font-sans uppercase tracking-[0.4em] font-bold block opacity-70">
                                            {occasion.subtitle}
                                        </span>
                                        <h3 className="font-heading text-4xl md:text-6xl font-normal leading-none tracking-tight">
                                            {occasion.title}
                                        </h3>
                                    </div>
                                    <p className="font-sans text-sm md:text-base text-secondary/70 max-w-sm opacity-0 group-hover:opacity-100 transition-opacity duration-1000 delay-100">
                                        {occasion.description}
                                    </p>
                                    <div className="flex items-center gap-4 text-[10px] md:text-xs font-sans font-bold uppercase tracking-[0.3em] pt-4 border-t border-secondary/20 w-fit">
                                        Explore Collection
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
