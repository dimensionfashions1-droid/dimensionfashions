"use client"

import * as React from "react"
import { ProductCard } from "../product/ProductCard"
import { Product } from "@/types"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { PackageX, Loader2 } from "lucide-react"

// Fallback tabs if API fails
const FALLBACK_TABS = [
    { name: "Dresses", slug: "dresses" },
    { name: "Tops", slug: "tops" },
    { name: "Shoes", slug: "shoes" },
]

export interface CategoryData {
    name: string;
    slug: string;
}

interface TrendingTabsProps {
    initialCategories: CategoryData[];
    initialProducts: Product[];
}

export function TrendingTabs({ initialCategories, initialProducts }: TrendingTabsProps) {
    const tabs = initialCategories && initialCategories.length > 0 ? initialCategories : FALLBACK_TABS;
    const defaultTab = tabs[0]?.slug;

    const [activeTab, setActiveTab] = React.useState<string>(defaultTab);
    const [productsMap, setProductsMap] = React.useState<Record<string, Product[]>>({
        ...(defaultTab ? { [defaultTab]: initialProducts || [] } : {})
    });
    const [isLoading, setIsLoading] = React.useState(false);

    const handleTabChange = async (slug: string) => {
        setActiveTab(slug);
        
        // Only fetch if we haven't loaded products for this tab yet
        if (!productsMap[slug]) {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/home/products?category=${slug}`);
                if (res.ok) {
                    const json = await res.json();
                    if (json.data && json.data.products !== undefined) {
                        setProductsMap(prev => ({
                            ...prev,
                            [slug]: json.data.products
                        }));
                    }
                }
            } catch (err) {
                console.error("Error fetching products for category:", err);
            } finally {
                setIsLoading(false);
            }
        }
    }

    return (
        <section className="py-8 md:py-15 bg-white ">
            < div className="max-w-[1280px] mx-auto px-4" >
                <Tabs defaultValue={defaultTab} value={activeTab} onValueChange={handleTabChange} className="w-full">
                    {/* Section Header */}
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-6">
                        <div className="flex flex-col text-left space-y-3">
                            <span className="text-[10px] text-accent uppercase tracking-[0.4em] font-sans font-bold">
                                Curated For You
                            </span>
                            <h2 className="font-heading font-normal text-3xl md:text-4xl text-primary tracking-tight">
                                The <span>Edit</span>
                            </h2>
                        </div>

                        {/* Tabs — pill style, right-aligned on desktop */}
                        <TabsList className="bg-transparent h-auto p-0 gap-1.5 flex-wrap justify-start sm:justify-end">
                            {tabs.map((tab) => (
                                <TabsTrigger
                                    key={tab.slug}
                                    value={tab.slug}
                                    suppressHydrationWarning
                                    className="rounded-full px-4 py-2 text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40 border border-transparent transition-all duration-300 hover:text-primary/70 hover:border-primary/10 data-[state=active]:bg-accent data-[state=active]:text-white data-[state=active]:border-primary hover:bg-accent/50 data-[state=active]:shadow-none"
                                >
                                    {tab.name}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    {tabs.map((tab) => {
                        const tabProducts = productsMap[tab.slug];
                        
                        return (
                            <TabsContent key={tab.slug} value={tab.slug} className="mt-0 outline-none min-h-[400px]">
                                {isLoading && activeTab === tab.slug && !tabProducts ? (
                                    <div className="flex flex-col items-center justify-center py-20 px-4 h-[400px]">
                                        <Loader2 className="w-10 h-10 text-primary/20 animate-spin" />
                                    </div>
                                ) : tabProducts && tabProducts.length > 0 ? (
                                    <Carousel
                                        opts={{
                                            align: "start",
                                        }}
                                        className="w-full"
                                    >
                                        <CarouselContent className="-ml-4 md:-ml-6">
                                            {tabProducts.map((product) => (
                                                <CarouselItem key={product.id} className="pl-4 md:pl-6 basis-full sm:basis-1/2 lg:basis-1/4">
                                                    <ProductCard product={product} />
                                                </CarouselItem>
                                            ))}
                                        </CarouselContent>
                                        <div className="hidden lg:block">
                                            <CarouselPrevious className="h-10 w-10 rounded-full border-gray-200 -left-5 bg-white/80 backdrop-blur-sm text-primary shadow-sm hover:shadow-lg hover:bg-white hover:border-accent/30 transition-all" />
                                            <CarouselNext className="h-10 w-10 rounded-full border-gray-200 -right-5 bg-white/80 backdrop-blur-sm text-primary shadow-sm hover:shadow-lg hover:bg-white hover:border-accent/30 transition-all" />
                                        </div>
                                    </Carousel>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                                        <PackageX className="w-12 h-12 text-gray-300 mb-4" />
                                        <h3 className="text-lg font-heading text-primary mb-2">Coming Soon</h3>
                                        <p className="text-sm font-sans text-gray-500 max-w-[250px]">
                                            We are curating beautiful pieces for our {tab.name} collection. Check back later.
                                        </p>
                                    </div>
                                )}
                            </TabsContent>
                        )
                    })}
                </Tabs>
            </div >
        </section >
    )
}

