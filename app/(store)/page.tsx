
import { HeroCarousel } from "@/components/hero/HeroCarousel"
import { CategoryCircles } from "@/components/home/CategoryCircles"
import { TrendingTabs } from "@/components/home/TrendingTabs"
import { EditorialGrid } from "@/components/home/EditorialGrid"
import { TrustMarkers } from "@/components/home/TrustMarkers"
import { MarqueeSection } from "@/components/home/MarqueeSection"
import { FeaturedDrop } from "@/components/home/FeaturedDrop"
import { IntroSection } from "@/components/home/IntroSection"
import { OfferBanner } from "@/components/home/OfferBanner"
import { CtaSection } from "@/components/home/CtaSection"

export default function Home() {
    const products = [
        {
            id: "1",
            title: "Midnight Bloom Kanjivaram",
            price: 18499,
            category: "Sarees",
            image: "https://www.sourcesplash.com/i/random?q=kanjivaram-saree,indian-model&w=1200&h=1600"
        },
        {
            id: "2",
            title: "Zari Weave Lehenga",
            price: 24999,
            category: "Lehengas",
            image: "https://www.sourcesplash.com/i/random?q=lehenga,indian-wedding,bridal&w=1200&h=1600"
        },
        {
            id: "3",
            title: "Pastel Kurta Set",
            price: 4999,
            category: "Kurta Sets",
            image: "https://www.sourcesplash.com/i/random?q=kurti,set,indian-fashion&w=1200&h=1600"
        },
        {
            id: "4",
            title: "Floral Summer Dress",
            price: 2999,
            category: "Dresses",
            image: "https://www.sourcesplash.com/i/random?q=women-dress,floral,fashion&w=1200&h=1600"
        },
        {
            id: "5",
            title: "Chic Co-ord Set",
            price: 3999,
            category: "Co-ords",
            image: "https://www.sourcesplash.com/i/random?q=co-ord,set,women-fashion&w=1200&h=1600"
        },
        {
            id: "6",
            title: "Evening Glam Gown",
            price: 8999,
            category: "Gowns",
            image: "https://www.sourcesplash.com/i/random?q=evening-gown,party,model&w=1200&h=1600"
        },
        {
            id: "7",
            title: "Minimal Cotton Top",
            price: 1499,
            category: "Tops",
            image: "https://www.sourcesplash.com/i/random?q=women-top,minimal,fashion&w=1200&h=1600"
        },
        {
            id: "8",
            title: "Soft Lounge Set",
            price: 1999,
            category: "Loungewear",
            image: "https://www.sourcesplash.com/i/random?q=loungewear,women,homewear&w=1200&h=1600"
        }
    ];

    return (
        <main className="bg-white">
            <HeroCarousel />
            <CategoryCircles />
            <TrendingTabs products={products} />
            <MarqueeSection />
            <EditorialGrid />
            <FeaturedDrop />
            <IntroSection />
            <OfferBanner />
            <CtaSection />
            <TrustMarkers />
        </main>
    )
}
