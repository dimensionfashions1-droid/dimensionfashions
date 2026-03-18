
import { HeroCarousel } from "@/components/hero/HeroCarousel"
import { AzaCategoryCircles } from "@/components/home/AzaCategoryCircles"
import { AzaTrendingTabs } from "@/components/home/AzaTrendingTabs"
import { AzaVisualGrid } from "@/components/home/AzaVisualGrid"
import { AzaDesignerSpotlight } from "@/components/home/AzaDesignerSpotlight"
import { AzaTrustMarkers } from "@/components/home/AzaTrustMarkers"
import { MarqueeSection } from "@/components/home/MarqueeSection"

export default function Home() {
    const products = [
        { id: "1", title: "Midnight Bloom Kanjivaram", price: 18499, category: "Kanjivaram", image: "https://images.pexels.com/photos/10189110/pexels-photo-10189110.jpeg?auto=compress&cs=tinysrgb&w=1200" },
        { id: "2", title: "Zari Weave Banarasi Silk", price: 22999, category: "Banarasi", image: "https://images.pexels.com/photos/10189025/pexels-photo-10189025.jpeg?auto=compress&cs=tinysrgb&w=1200" },
        { id: "3", title: "Pastel Grace Silk Saree", price: 9599, category: "Soft Silk", image: "https://images.pexels.com/photos/10189112/pexels-photo-10189112.jpeg?auto=compress&cs=tinysrgb&w=1200" },
        { id: "4", title: "Handblock Linen Heritage", price: 5299, category: "Linen", image: "https://images.pexels.com/photos/10189113/pexels-photo-10189113.jpeg?auto=compress&cs=tinysrgb&w=1200" },
        { id: "5", title: "Emerald Silk Drapery", price: 14299, category: "Soft Silk", image: "https://images.pexels.com/photos/14545235/pexels-photo-14545235.jpeg?auto=compress&cs=tinysrgb&w=1200" },
        { id: "6", title: "Crimson Banarasi", price: 21000, category: "Banarasi", image: "https://images.pexels.com/photos/10189028/pexels-photo-10189028.jpeg?auto=compress&cs=tinysrgb&w=1200" },
        { id: "7", title: "Golden Ochre Silk", price: 18500, category: "Kanjivaram", image: "https://images.pexels.com/photos/14545235/pexels-photo-14545235.jpeg?auto=compress&cs=tinysrgb&w=1200" },
        { id: "8", title: "Sage Green Banarasi", price: 19500, category: "Banarasi", image: "https://images.pexels.com/photos/10189025/pexels-photo-10189025.jpeg?auto=compress&cs=tinysrgb&w=1200" },
    ]

    return (
        <main className="bg-white">
            <HeroCarousel />
            <AzaCategoryCircles />
            <AzaTrendingTabs products={products} />
            <MarqueeSection />
            <AzaVisualGrid />
            <AzaDesignerSpotlight />
            <AzaTrustMarkers />
        </main>
    )
}
