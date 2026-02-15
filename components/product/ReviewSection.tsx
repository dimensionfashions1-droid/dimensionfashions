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
        content: "Dimensions never disappoints. This is my third purchase and the quality is consistent. comfortable and stylish.",
        helpful: 24
    }
]

export function ReviewSection() {
    return (
        <div className="py-16">
            <h2 className="font-heading font-bold text-3xl uppercase tracking-tight mb-8 text-white">Customer Reviews</h2>

            <div className="grid md:grid-cols-12 gap-12">
                {/* Summary */}
                <div className="md:col-span-4 space-y-8">
                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl text-center space-y-4">
                        <div className="text-6xl font-black font-heading text-white">4.8</div>
                        <div className="flex justify-center text-yellow-500">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className="w-5 h-5 fill-current" />
                            ))}
                        </div>
                        <p className="text-neutral-400 font-medium">Based on 128 Reviews</p>
                    </div>

                    <div className="space-y-3">
                        {[5, 4, 3, 2, 1].map((rating) => (
                            <div key={rating} className="flex items-center gap-4">
                                <span className="text-sm font-bold w-3 text-white">{rating}</span>
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <Progress value={rating === 5 ? 75 : rating === 4 ? 20 : 5} className="h-2 bg-neutral-800" />
                                <span className="text-sm text-neutral-400 w-8 text-right">
                                    {rating === 5 ? '75%' : rating === 4 ? '20%' : '5%'}
                                </span>
                            </div>
                        ))}
                    </div>

                    <Button className="w-full rounded-full h-12 uppercase font-bold tracking-widest bg-white text-black border border-white hover:bg-neutral-200 transition-colors">
                        Write a Review
                    </Button>
                </div>

                {/* Reviews List */}
                <div className="md:col-span-8 space-y-8">
                    {MOCK_REVIEWS.map((review) => (
                        <div key={review.id} className="space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-white">{review.author}</h4>
                                        <span className="text-xs text-green-500 bg-green-950/30 border border-green-900 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Verified Buyer</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-neutral-500">
                                        <div className="flex text-yellow-500">
                                            {Array.from({ length: review.rating }).map((_, i) => (
                                                <Star key={i} className="w-3 h-3 fill-current" />
                                            ))}
                                        </div>
                                        <span>•</span>
                                        <span>{review.date}</span>
                                    </div>
                                </div>
                            </div>

                            <h5 className="font-bold text-lg text-neutral-200">{review.title}</h5>
                            <p className="text-neutral-400 leading-relaxed text-sm">{review.content}</p>

                            <div className="flex items-center gap-4">
                                <button className="flex items-center gap-2 text-sm text-neutral-500 hover:text-white transition-colors">
                                    <ThumbsUp className="w-4 h-4" />
                                    <span>Helpful ({review.helpful})</span>
                                </button>
                            </div>
                            <Separator className="bg-neutral-800" />
                        </div>
                    ))}

                    <Button variant="link" className="text-white font-bold uppercase tracking-widest pl-0 hover:text-neutral-300">
                        Load More Reviews
                    </Button>
                </div>
            </div>
        </div>
    )
}
