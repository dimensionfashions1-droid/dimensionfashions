import { ProductList } from "@/components/product/ProductList"
import { HeroCarousel } from "@/components/hero/HeroCarousel"
import { CategorySection } from "@/components/home/CategorySection"
import { IntroSection } from "@/components/home/IntroSection"
import { EditorialSection } from "@/components/home/EditorialSection"
import { MarqueeSection } from "@/components/home/MarqueeSection"
import { FeaturedDrop } from "@/components/home/FeaturedDrop"

export default function Home() {
    // Mock Data - CLOTHES ONLY
    const features = [
        { id: "1", title: "Oversized Structured Tee", price: 2499, category: "Tops", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1964&auto=format&fit=crop" },
        { id: "2", title: "Wide Leg Pleated Trousers", price: 3999, category: "Bottoms", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1887&auto=format&fit=crop" },
        { id: "3", title: "Utility Vest Black", price: 4599, category: "Outerwear", image: "https://images.unsplash.com/photo-1559582930-bb01987cf4dd?q=80&w=1762&auto=format&fit=crop" },
        { id: "4", title: "Boxy Fit Shirt", price: 2999, category: "Tops", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1888&auto=format&fit=crop" },
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
