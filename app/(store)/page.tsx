
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

export default async function Home() {
    let initialCategories: { name: string, slug: string }[] = [];
    let initialProducts: any[] = [];

    try {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL ||
            (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

        const res = await fetch(`${appUrl}/api/home/products`, { next: { revalidate: 3600 } });

        if (res.ok) {
            const json = await res.json();
            if (json.data) {
                initialCategories = json.data.categories || [];
                initialProducts = json.data.products || [];
            }
        }
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
