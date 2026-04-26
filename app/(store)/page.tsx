
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
import { getHomeProducts } from "@/lib/supabase/home"

export default async function Home() {
    let initialCategories: { name: string, slug: string }[] = [];
    let initialProducts: any[] = [];

    try {
        const data = await getHomeProducts();
        initialCategories = data.categories;
        initialProducts = data.products;
    } catch (error) {
        console.error("Failed to fetch data for home page:", error);
    }

    return (
        <main className="bg-white">
            <HeroCarousel />
            <CategoryCircles />
            <TrendingTabs initialCategories={initialCategories} initialProducts={initialProducts} />
            <MarqueeSection />
            <EditorialGrid />
            <FeaturedDrop />
            <IntroSection />
            <OfferBanner />
            <TrustMarkers />
        </main>
    )
}
