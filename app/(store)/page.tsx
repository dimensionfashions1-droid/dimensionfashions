import { ProductList } from "@/components/product/ProductList"
import { HeroCarousel } from "@/components/hero/HeroCarousel"
import { CategorySection } from "@/components/home/CategorySection"
import { IntroSection } from "@/components/home/IntroSection"
import { EditorialSection } from "@/components/home/EditorialSection"
import { MarqueeSection } from "@/components/home/MarqueeSection"
import { FeaturedDrop } from "@/components/home/FeaturedDrop"

export default function Home() {
    const features = [
        { id: "1", title: "Handwoven Kanjivaram Silk", price: 14499, category: "Kanjivaram", image: "https://images.unsplash.com/photo-1610189014168-96f7c8f49514?q=80&w=1500&auto=format&fit=crop" },
        { id: "2", title: "Pure Banarasi Georgette", price: 11999, category: "Banarasi", image: "https://images.unsplash.com/photo-1583391265517-35bbdad01209?q=80&w=1500&auto=format&fit=crop" },
        { id: "3", title: "Soft Silk Pastel Saree", price: 8599, category: "Soft Silk", image: "https://images.unsplash.com/photo-1617344933996-51d8b1e428e1?q=80&w=1500&auto=format&fit=crop" },
        { id: "4", title: "Linen Handblock Print", price: 4299, category: "Linen", image: "https://images.unsplash.com/photo-1605518216954-d8916d16cc0a?q=80&w=1500&auto=format&fit=crop" },
    ]

    return (
        <>
            <HeroCarousel />
            <IntroSection />
            <ProductList title="Latest Drops" products={features} className="bg-background text-foreground py-20" />
            <MarqueeSection />

            <EditorialSection />
            <FeaturedDrop />

            <CategorySection />

        </>
    )
}
