"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CreditCard, Truck, Wallet, Loader2, Plus, MapPin, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/hooks/use-cart"
import { UserAddress, CartItem } from "@/types"
import { cn } from "@/lib/utils"

// Form Schema for New Address
const addressSchema = z.object({
    title: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional(),
    phone: z.string().optional(),
})

type AddressFormValues = z.infer<typeof addressSchema>

interface CheckoutFormProps {
    cartItems: CartItem[]
    subtotal: number
    shippingCost: number
    totalAmount: number
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function CheckoutForm({ cartItems, subtotal, shippingCost, totalAmount }: CheckoutFormProps) {
    const { toast } = useToast()
    const router = useRouter()
    const cart = useCart()
    const [addresses, setAddresses] = useState<UserAddress[]>([])
    const [selectedAddressId, setSelectedAddressId] = useState<string | "new">("new")
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(true)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const form = useForm<AddressFormValues>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            title: "",
            firstName: "",
            lastName: "",
            address: "",
            city: "",
            state: "",
            pincode: "",
            phone: "",
        },
    })

    // 1. Fetch saved addresses & check auth
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const res = await fetch('/api/users/addresses')
                if (res.ok) {
                    const { data } = await res.json()
                    setAddresses(data || [])
                    setIsAuthenticated(true)
                    if (data && data.length > 0) {
                        const defaultAddr = data.find((a: any) => a.is_default) || data[0]
                        setSelectedAddressId(defaultAddr.id)
                    }
                } else if (res.status === 401) {
                    setIsAuthenticated(false)
                    setSelectedAddressId("new")
                }
            } catch (err) {
                console.error("Failed to fetch addresses")
            } finally {
                setIsLoadingAddresses(false)
            }
        }
        fetchAddresses()
    }, [])

    // 2. Load Razorpay Script
    useEffect(() => {
        const script = document.createElement("script")
        script.src = "https://checkout.razorpay.com/v1/checkout.js"
        script.async = true
        document.body.appendChild(script)
        return () => {
            document.body.removeChild(script)
        }
    }, [])

    async function onSubmit(data: AddressFormValues) {
        if (isProcessing) return
        setIsProcessing(true)

        try {
            // A. Prepare Address Data
            let finalAddress: any
            if (selectedAddressId === "new") {
                // Manual Validation for New Address
                if (!data.firstName || !data.lastName || !data.address || !data.city || !data.state || !data.pincode || !data.phone) {
                    toast({
                        variant: "destructive",
                        title: "Incomplete Address",
                        description: "Please fill in all the required fields for the delivery address."
                    })
                    setIsProcessing(false)
                    return
                }

                // If guest, email is required
                if (!isAuthenticated && !data.email) {
                    toast({
                        variant: "destructive",
                        title: "Email Required",
                        description: "Please provide an email address for order updates."
                    })
                    setIsProcessing(false)
                    return
                }

                // If authenticated, SAVE the new address to DB first
                if (isAuthenticated) {
                    const saveAddrRes = await fetch('/api/users/addresses', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            title: data.title || "Home",
                            first_name: data.firstName,
                            last_name: data.lastName,
                            address: data.address,
                            city: data.city,
                            state: data.state,
                            pincode: data.pincode,
                            phone: data.phone,
                            is_default: addresses.length === 0
                        })
                    })
                    
                    if (saveAddrRes.ok) {
                        const { data: savedAddr } = await saveAddrRes.json()
                        finalAddress = savedAddr
                    } else {
                        const errorData = await saveAddrRes.json()
                        throw new Error(errorData.error || "Failed to save address")
                    }
                } else {
                    // Guest user - just use the form data directly
                    finalAddress = {
                        title: data.title || "Home",
                        first_name: data.firstName,
                        last_name: data.lastName,
                        email: data.email,
                        address: data.address,
                        city: data.city,
                        state: data.state,
                        pincode: data.pincode,
                        phone: data.phone
                    }
                }
            } else {
                const saved = addresses.find(a => a.id === selectedAddressId)
                if (!saved) throw new Error("Selected address not found")
                finalAddress = saved
            }

            // B. Create Order on Server
            const orderRes = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cartItems,
                    address: finalAddress,
                    subtotal,
                    shippingCost,
                    totalAmount
                })
            })

            const orderData = await orderRes.json()

            if (!orderRes.ok) {
                if (orderData.outOfStock) {
                    toast({
                        variant: "destructive",
                        title: "Stock Alert",
                        description: orderData.error
                    })
                    router.push('/cart')
                    return
                }
                throw new Error(orderData.error || "Failed to initiate order")
            }

            // C. Open Razorpay Checkout
            if (!window.Razorpay) {
                throw new Error("Razorpay SDK not loaded. Please check your connection.")
            }

            const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
            if (!razorpayKey) {
                throw new Error("Razorpay Public Key is missing. Please check your environment variables.")
            }

            const options = {
                key: razorpayKey,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "DIMENSION",
                description: "Luxury Ethnic Wear",
                order_id: orderData.orderId,
                handler: async function (response: any) {
                    // D. Verify Payment on Server
                    const verifyRes = await fetch('/api/payments/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            dbOrderId: orderData.dbOrderId
                        })
                    })

                    if (verifyRes.ok) {
                        cart.clearCart() // Clear client cart
                        toast({
                            title: "Order Placed Successfully",
                            description: "Your elegance is on its way."
                        })
                        router.push(isAuthenticated ? `/profile/orders` : `/`)
                    } else {
                        toast({
                            variant: "destructive",
                            title: "Payment Verification Failed",
                            description: "Please contact support if amount was deducted."
                        })
                    }
                },
                prefill: {
                    name: `${finalAddress.first_name} ${finalAddress.last_name}`,
                    contact: finalAddress.phone
                },
                theme: {
                    color: "#111111"
                },
                modal: {
                    ondismiss: function() {
                        setIsProcessing(false)
                    }
                }
            }

            const rzp = new window.Razorpay(options)
            rzp.open()

        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Checkout Error",
                description: error.message
            })
            setIsProcessing(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">

                {/* Shipping Address Selection */}
                <div className="space-y-6">
                    <h2 className="font-heading font-medium text-xl text-primary uppercase tracking-[0.1em] border-b border-primary/5 pb-4">Shipping Address</h2>
                    
                    {isLoadingAddresses ? (
                        <div className="flex items-center gap-2 text-primary/40 py-4">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Loading saved addresses...</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {addresses.map((addr) => (
                                <div
                                    key={addr.id}
                                    onClick={() => setSelectedAddressId(addr.id)}
                                    className={cn(
                                        "relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-start gap-4",
                                        selectedAddressId === addr.id 
                                            ? "border-accent bg-accent/5 ring-1 ring-accent" 
                                            : "border-primary/10 hover:border-primary/30"
                                    )}
                                >
                                    <div className={cn(
                                        "mt-1 h-4 w-4 rounded-full border flex items-center justify-center shrink-0",
                                        selectedAddressId === addr.id ? "border-accent bg-accent" : "border-primary/20"
                                    )}>
                                        {selectedAddressId === addr.id && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[9px] font-sans font-extrabold uppercase tracking-widest text-primary/40">{addr.title}</span>
                                            {addr.is_default && <span className="text-[7px] font-sans font-extrabold uppercase tracking-[0.2em] bg-accent text-white px-1.5 py-0.5 rounded-sm">Default</span>}
                                        </div>
                                        <p className="font-heading text-base text-primary">{addr.first_name} {addr.last_name}</p>
                                        <p className="text-[11px] font-medium text-primary/60 mt-2 leading-relaxed uppercase tracking-wider font-sans">
                                            {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                                        </p>
                                        <p className="text-[11px] font-bold text-primary/40 mt-1 font-sans">PHONE: {addr.phone}</p>
                                    </div>
                                    {selectedAddressId === addr.id && <CheckCircle2 className="w-5 h-5 text-accent absolute top-5 right-5" />}
                                </div>
                            ))}

                            <div
                                onClick={() => setSelectedAddressId("new")}
                                className={cn(
                                    "p-5 rounded-2xl border border-dashed transition-all duration-300 cursor-pointer flex items-center gap-4",
                                    selectedAddressId === "new" 
                                        ? "border-accent bg-accent/5 ring-1 ring-accent" 
                                        : "border-primary/20 hover:border-primary/40"
                                )}
                            >
                                <div className={cn(
                                    "h-10 w-10 rounded-full border border-dashed flex items-center justify-center text-primary/40",
                                    selectedAddressId === "new" ? "border-accent text-accent" : "border-primary/20"
                                )}>
                                    <Plus className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-primary/60">Add a new delivery address</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* New Address Form */}
                {selectedAddressId === "new" && (
                    <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] uppercase tracking-widest font-bold opacity-60">Address Title (e.g. Home, Office)</FormLabel>
                                    <FormControl>
                                        <Input className="rounded-xl border-primary/10 h-12" placeholder="Home" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] uppercase tracking-widest font-bold opacity-60">First Name</FormLabel>
                                        <FormControl>
                                            <Input className="rounded-xl border-primary/10 h-12" placeholder="Isabella" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] uppercase tracking-widest font-bold opacity-60">Last Name</FormLabel>
                                        <FormControl>
                                            <Input className="rounded-xl border-primary/10 h-12" placeholder="Sharma" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {!isAuthenticated && (
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] uppercase tracking-widest font-bold opacity-60">Email Address (for order updates)</FormLabel>
                                        <FormControl>
                                            <Input className="rounded-xl border-primary/10 h-12" placeholder="isabella@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] uppercase tracking-widest font-bold opacity-60">Full Street Address</FormLabel>
                                    <FormControl>
                                        <Input className="rounded-xl border-primary/10 h-12" placeholder="123 Luxury Lane, Apt 4B" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] uppercase tracking-widest font-bold opacity-60">City</FormLabel>
                                        <FormControl>
                                            <Input className="rounded-xl border-primary/10 h-12" placeholder="Mumbai" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="pincode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] uppercase tracking-widest font-bold opacity-60">Pincode</FormLabel>
                                        <FormControl>
                                            <Input className="rounded-xl border-primary/10 h-12" placeholder="400001" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="state"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] uppercase tracking-widest font-bold opacity-60">State</FormLabel>
                                        <FormControl>
                                            <Input className="rounded-xl border-primary/10 h-12" placeholder="Maharashtra" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] uppercase tracking-widest font-bold opacity-60">Phone Number</FormLabel>
                                    <FormControl>
                                        <Input className="rounded-xl border-primary/10 h-12" placeholder="+91 98765 43210" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                )}

                <Separator className="bg-primary/5" />

                <div className="bg-gray-50/50 p-8 rounded-3xl border border-primary/5 space-y-4">
                    <div className="flex items-center gap-4 text-primary">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="text-xs font-sans font-bold uppercase tracking-[0.2em]">Secure Razorpay Payment</span>
                    </div>
                    <p className="text-[10px] text-primary/40 font-medium tracking-wide leading-relaxed">
                        By clicking "Complete Order", you will be redirected to the secure Razorpay gateway to complete your purchase using UPI, Cards, or Netbanking.
                    </p>
                </div>

                <Button 
                    type="submit" 
                    disabled={isProcessing}
                    className="w-full h-16 bg-primary text-secondary hover:bg-black font-sans font-bold uppercase tracking-[0.4em] text-[11px] rounded-full transition-all duration-500 shadow-2xl shadow-black/10"
                >
                    {isProcessing ? (
                        <div className="flex items-center gap-3">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Processing...</span>
                        </div>
                    ) : (
                        `Complete Order — ₹${totalAmount.toLocaleString("en-IN")}`
                    )}
                </Button>
            </form>
        </Form>
    )
}
