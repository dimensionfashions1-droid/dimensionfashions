"use client"

import * as React from "react"
import { ProductCard, Product } from "../product/ProductCard"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

const TABS = ["Banarasi", "Kanjivaram", "Linen", "Chiffon", "Organza"]

interface AzaTrendingTabsProps {
    products: Product[]
}

export function AzaTrendingTabs({ products }: AzaTrendingTabsProps) {

    return (
        <section className="py-24 bg-primary/[0.02]">
            <div className="max-w-[1280px] mx-auto px-4">
                <Tabs defaultValue={TABS[0]} className="w-full">
                    <div className="flex flex-col items-center mb-16 gap-6 text-center">
                        <h2 className="font-heading text-4xl md:text-5xl text-primary tracking-tight">
                            The <span className="italic">Silk</span> Edit
                        </h2>
                        
                        <TabsList className="bg-transparent border-b border-gray-100 w-full md:w-fit rounded-none h-auto p-0 gap-8 md:gap-16 flex-wrap">
                            {TABS.map((tab) => (
                                <TabsTrigger
                                    key={tab}
                                    value={tab}
                                    suppressHydrationWarning
                                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary text-gray-400 hover:text-primary/60 rounded-none border-b-2 border-transparent data-[state=active]:border-accent px-0 pb-4 h-auto text-[11px] font-sans font-extrabold uppercase tracking-[0.3em] transition-all"
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
                                            <div className="rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500">
                                                <ProductCard product={product} />
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <div className="hidden lg:block">
                                    <CarouselPrevious className="h-10 w-10 rounded-full border-gray-100 -left-5 bg-white text-primary shadow-md hover:shadow-lg transition-shadow" />
                                    <CarouselNext className="h-10 w-10 rounded-full border-gray-100 -right-5 bg-white text-primary shadow-md hover:shadow-lg transition-shadow" />
                                </div>
                            </Carousel>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </section>
    )
}
