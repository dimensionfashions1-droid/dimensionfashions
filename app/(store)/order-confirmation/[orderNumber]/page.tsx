"use client"

import * as React from "react"
import Link from "next/link"
import { CheckCircle2, Package, ArrowRight, ShoppingBag, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { generateInvoicePDF } from "@/lib/utils/invoice-generator"
import { useParams } from "next/navigation"

export default function OrderConfirmationPage() {
    const params = useParams()
    const orderNumber = params.orderNumber as string
    const [order, setOrder] = React.useState<any>(null)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`/api/orders/confirmation/${orderNumber}`)
                const result = await res.json()
                if (result.data) {
                    setOrder(result.data)
                }
            } catch (error) {
                console.error("Error fetching order:", error)
            } finally {
                setLoading(false)
            }
        }
        if (orderNumber) fetchOrder()
    }, [orderNumber])

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-primary/40 animate-pulse">Confirming your elegance...</p>
            </div>
        )
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-2xl font-heading text-primary mb-4">Order Not Found</h1>
                <p className="text-sm text-primary/60 mb-8">We couldn't retrieve the details for this order number.</p>
                <Link href="/">
                    <Button className="rounded-full bg-primary text-white px-8">Continue Shopping</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-[1280px] mx-auto px-4 py-16 md:py-24">
                <div className="max-w-3xl mx-auto text-center space-y-8 mb-16">
                    <div className="flex justify-center">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-2">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl font-heading text-primary tracking-tight">Thank you for <br />your purchase</h1>
                        <p className="text-zinc-500 font-sans text-sm md:text-base max-w-md mx-auto leading-relaxed">
                            Your order <span className="font-bold text-primary">#{order.order_number}</span> has been confirmed.
                            We've sent a confirmation email to <span className="text-primary font-medium">{order.email}</span>.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Button
                            variant="outline"
                            className="rounded-full h-12 px-8 border-primary/10 text-primary hover:bg-primary hover:text-white transition-all uppercase text-[10px] font-bold tracking-[0.2em] w-full sm:w-auto"
                            onClick={() => generateInvoicePDF({
                                orderNumber: order.order_number,
                                date: new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
                                customerName: `${order.first_name} ${order.last_name}`,
                                email: order.email,
                                phone: order.phone,
                                address: order.address,
                                city: order.city,
                                state: order.state,
                                pincode: order.pincode,
                                items: order.items,
                                subtotal: order.total_amount - (order.shipping_cost || 0), // Estimate if subtotal not returned exactly
                                shipping: order.shipping_cost || 0,
                                discount: 0, // Placeholder
                                total: order.total_amount
                            })}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download Invoice
                        </Button>
                        <Link href="/profile/" className="w-full sm:w-auto">
                            <Button className="rounded-full h-12 px-8 bg-primary text-white hover:bg-black transition-all uppercase text-[10px] font-bold tracking-[0.2em] w-full">
                                View My Orders
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-zinc-100 pt-16">
                    {/* Order Details */}
                    <div className="lg:col-span-7 space-y-8">
                        <h2 className="text-xl font-heading text-primary">Order Summary</h2>
                        <div className="space-y-6">
                            {order.items.map((item: any, idx: number) => (
                                <div key={idx} className="flex gap-6 items-center">
                                    <div className="relative w-20 h-24 bg-zinc-50 rounded-lg overflow-hidden flex-shrink-0">
                                        {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-heading text-lg text-primary">{item.title}</h3>
                                        <p className="text-[10px] font-sans font-bold text-primary/40 uppercase tracking-widest mt-1">Quantity: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-sans font-bold text-primary tracking-widest">₹{(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Delivery & Payment Info */}
                    <div className="lg:col-span-5 bg-zinc-50 rounded-3xl p-8 md:p-10 space-y-10">
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-primary/30 border-b border-primary/5 pb-2">Delivery Details</h3>
                            <div className="space-y-1">
                                <p className="font-sans text-sm font-bold text-primary">{order.first_name} {order.last_name}</p>
                                <p className="font-sans text-[12px] text-primary/60 leading-relaxed uppercase tracking-wider">
                                    {order.address}, {order.city}, {order.state} - {order.pincode}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-primary/30 border-b border-primary/5 pb-2">Order Information</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-[9px] font-sans font-bold text-primary/40 uppercase tracking-widest mb-1">Status</p>
                                    <p className="text-xs font-sans font-bold text-primary uppercase tracking-widest">{order.order_status}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-sans font-bold text-primary/40 uppercase tracking-widest mb-1">Order Date</p>
                                    <p className="text-xs font-sans font-bold text-primary uppercase tracking-widest">{new Date(order.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-primary/5 space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-primary/60 font-sans font-medium">Subtotal</span>
                                <span className="text-primary font-bold">₹{(order.total_amount - (order.shipping_cost || 0)).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-primary/60 font-sans font-medium">Shipping</span>
                                <span className="text-primary font-bold">₹{(order.shipping_cost || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-primary/10">
                                <span className="text-primary font-heading text-lg">Total</span>
                                <span className="text-primary font-heading text-2xl tracking-tighter">₹{order.total_amount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
