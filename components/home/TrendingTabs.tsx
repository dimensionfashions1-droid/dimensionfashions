"use client"

import * as React from "react"
import { ProductCard, Product } from "../product/ProductCard"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const TABS = ["Banarasi", "Kanjivaram", "Linen", "Chiffon", "Organza"]

interface TrendingTabsProps {
    products: Product[]
}

export function TrendingTabs({ products }: TrendingTabsProps) {
    return (
        <section className="py-8 md:py-15 bg-white ">
            < div className="max-w-[1280px] mx-auto px-4" >
                <Tabs defaultValue={TABS[0]} className="w-full">
                    {/* Section Header — matches CategoryCircles style */}
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-6">
                        <div className="flex flex-col text-left space-y-3">
                            <span className="text-[10px] text-accent uppercase tracking-[0.4em] font-sans font-bold">
                                Curated For You
                            </span>
                            <h2 className="font-heading font-normal text-3xl md:text-4xl text-primary tracking-tight">
                                The <span className="italic">Silk</span> Edit
                            </h2>
                        </div>

                        {/* Tabs — pill style, right-aligned on desktop */}
                        <TabsList className="bg-transparent h-auto p-0 gap-1.5 flex-wrap justify-start sm:justify-end">
                            {TABS.map((tab) => (
                                <TabsTrigger
                                    key={tab}
                                    value={tab}
                                    suppressHydrationWarning
                                    className="rounded-full px-4 py-2 text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40 border border-transparent transition-all duration-300 hover:text-primary/70 hover:border-primary/10 data-[state=active]:bg-accent data-[state=active]:text-white data-[state=active]:border-primary hover:bg-accent/50 data-[state=active]:shadow-none"
                                >
                                    {tab}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    {TABS.map((tab) => (
                        <TabsContent key={tab} value={tab} className="mt-0 outline-none">
                            <Carousel
                                opts={{
                                    align: "start",
                                }}
                                className="w-full"
                            >
                                <CarouselContent className="-ml-4 md:-ml-6">
                                    {products.map((product) => (
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
                        </TabsContent>
                    ))}
                </Tabs>
            </div >
        </section >
    )
}
