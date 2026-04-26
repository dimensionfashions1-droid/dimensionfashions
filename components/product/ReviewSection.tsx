"use client"

import { Star, ThumbsUp } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

const MOCK_REVIEWS = [
    {
        id: 1,
        author: "Alex K.",
        rating: 5,
        date: "2 weeks ago",
        title: "Exceptional Quality",
        content: "The fabric weight is perfect for transitional weather. Fits exactly as described. The oversized look is exactly what I was going for.",
        helpful: 12
    },
    {
        id: 2,
        author: "Jordan M.",
        rating: 4,
        date: "1 month ago",
        title: "Great fit, fast shipping",
        content: "Really happy with the purchase. Shipping was surprisingly fast. The only reason for 4 stars is that the color is slightly darker than the photos.",
        helpful: 8
    },
    {
        id: 3,
        author: "Casey R.",
        rating: 5,
        date: "2 months ago",
        title: "Worth every penny",
        content: "Dimension never disappoints. This is my third purchase and the quality is consistent. comfortable and stylish.",
        helpful: 24
    }
]

export function ReviewSection() {
    return (
        <div className="py-16">
            <h2 className="font-heading font-normal text-3xl md:text-4xl uppercase tracking-[0.1em] mb-12 text-primary">Customer <span>Reviews</span></h2>

            <div className="grid md:grid-cols-12 gap-12">
                {/* Summary */}
                <div className="md:col-span-4 space-y-8">
                    <div className="bg-primary/5 border border-primary/5 p-10 rounded-2xl text-center space-y-4">
                        <div className="text-7xl font-black font-heading text-primary leading-none">4.8</div>
                        <div className="flex justify-center text-accent">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className="w-5 h-5 fill-current" />
                            ))}
                        </div>
                        <p className="text-primary/60 font-medium uppercase tracking-widest text-[10px] font-sans">Based on 128 Reviews</p>
                    </div>

                    <div className="space-y-3">
                        {[5, 4, 3, 2, 1].map((rating) => (
                            <div key={rating} className="flex items-center gap-4">
                                <span className="text-sm font-bold w-3 text-primary">{rating}</span>
                                <Star className="w-4 h-4 text-accent fill-current" />
                                <Progress value={rating === 5 ? 75 : rating === 4 ? 20 : 5} className="h-1.5 bg-primary/10" />
                                <span className="text-[10px] text-primary/40 font-bold w-8 text-right font-sans">
                                    {rating === 5 ? '75%' : rating === 4 ? '20%' : '5%'}
                                </span>
                            </div>
                        ))}
                    </div>

                    <Button className="w-full rounded-full h-14 uppercase font-sans font-bold tracking-[0.25em] text-[10px] bg-primary text-secondary hover:bg-black transition-all duration-500 mt-4">
                        Write a Review
                    </Button>
                </div>

                {/* Reviews List */}
                <div className="md:col-span-8 space-y-8">
                    {MOCK_REVIEWS.map((review) => (
                        <div key={review.id} className="space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h4 className="font-bold text-primary font-sans text-sm uppercase tracking-wider">{review.author}</h4>
                                        <span className="text-[8px] text-accent bg-accent/5 border border-accent/10 px-3 py-1 rounded-full font-bold uppercase tracking-[0.2em] font-sans">Verified Buyer</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] text-primary/40 font-sans font-bold uppercase tracking-widest">
                                        <div className="flex text-accent">
                                            {Array.from({ length: review.rating }).map((_, i) => (
                                                <Star key={i} className="w-3 h-3 fill-current" />
                                            ))}
                                        </div>
                                        <span>•</span>
                                        <span>{review.date}</span>
                                    </div>
                                </div>
                            </div>

                            <h5 className="font-bold text-base text-primary font-sans uppercase tracking-[0.05em]">{review.title}</h5>
                            <p className="text-primary/70 leading-relaxed text-[13px] font-sans">{review.content}</p>

                            <div className="flex items-center gap-4">
                                <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary/40 hover:text-primary transition-colors font-sans group">
                                    <ThumbsUp className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                    <span>Helpful ({review.helpful})</span>
                                </button>
                            </div>
                            <Separator className="bg-primary/5" />
                        </div>
                    ))}

                    <Button variant="link" className="text-primary font-bold uppercase tracking-[0.2em] text-[10px] font-sans pl-0 hover:text-accent transition-colors">
                        Load More Reviews
                    </Button>
                </div>
            </div>
        </div>
    )
}
