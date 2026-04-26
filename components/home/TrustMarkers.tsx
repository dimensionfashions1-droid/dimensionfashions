import { Truck, ShieldCheck, CreditCard, RotateCcw } from "lucide-react"

const MARKERS = [
    {
        icon: <Truck className="w-6 h-6" />,
        title: "Quick Delivery",
        desc: "Fast and reliable delivery all over India"
    },
    {
        icon: <ShieldCheck className="w-6 h-6" />,
        title: "100% Authentic",
        desc: "Directly from top designers"
    },
    {
        icon: <RotateCcw className="w-6 h-6" />,
        title: "Easy Returns",
        desc: "Hassle-free 7-day returns"
    },
    {
        icon: <CreditCard className="w-6 h-6" />,
        title: "Secure Payments",
        desc: "UPI, Cards, Netbanking"
    }
]

export function TrustMarkers() {
    return (
        <section className="py-16 bg-white border-t border-gray-100">
            <div className="max-w-[1280px] mx-auto px-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                    {MARKERS.map((marker) => (
                        <div key={marker.title} className="flex flex-col items-center text-center space-y-4 group">
                            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-primary/40 group-hover:bg-accent/10 group-hover:text-accent transition-all duration-500">
                                {marker.icon}
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-sans font-bold uppercase tracking-widest text-[10px] text-primary">
                                    {marker.title}
                                </h4>
                                <p className="font-sans text-[10px] text-gray-400 uppercase tracking-tight">
                                    {marker.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
