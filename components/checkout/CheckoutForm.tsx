"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CreditCard, Truck, Wallet } from "lucide-react"

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

// Form Schema
const checkoutSchema = z.object({
    email: z.string().email("Invalid email address"),
    firstName: z.string().min(2, "First name is too short"),
    lastName: z.string().min(2, "Last name is too short"),
    address: z.string().min(5, "Address is too short"),
    city: z.string().min(2, "City is too short"),
    state: z.string().min(2, "State is too short"),
    pincode: z.string().min(6, "Invalid Pincode").max(6, "Invalid Pincode"),
    phone: z.string().min(10, "Invalid phone number"),
    paymentMethod: z.enum(["upi", "card", "cod"]),
})

type CheckoutFormValues = z.infer<typeof checkoutSchema>

export function CheckoutForm() {
    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            email: "",
            firstName: "",
            lastName: "",
            address: "",
            city: "",
            state: "",
            pincode: "",
            phone: "",
            paymentMethod: "upi",
        },
    })

    function onSubmit(data: CheckoutFormValues) {
        // Handle payment processing here
        console.log(data)
        alert("Proceeding to payment... (Mock)")
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                {/* Contact Information */}
                <div className="space-y-4">
                    <h3 className="font-heading font-bold text-lg text-white">Contact Information</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="you@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="+91 98765 43210" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <Separator className="bg-neutral-800" />

                {/* Shipping Address */}
                <div className="space-y-4">
                    <h3 className="font-heading font-bold text-lg text-white">Shipping Address</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John" {...field} />
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
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="123 Street Name, Area" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Mumbai" {...field} />
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
                                    <FormLabel>Pincode</FormLabel>
                                    <FormControl>
                                        <Input placeholder="400001" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                    <Input placeholder="Maharashtra" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Separator className="bg-neutral-800" />

                {/* Payment Method */}
                <div className="space-y-4">
                    <h3 className="font-heading font-bold text-lg text-white">Payment Method</h3>
                    <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="grid grid-cols-1 gap-4"
                                    >
                                        <FormItem>
                                            <FormControl>
                                                <RadioGroupItem value="upi" id="upi" className="peer sr-only" />
                                            </FormControl>
                                            <Label
                                                htmlFor="upi"
                                                className="flex flex-col items-center justify-between rounded-xl border-2 border-neutral-800 bg-neutral-900 p-4 hover:bg-neutral-800 hover:text-white peer-data-[state=checked]:border-white peer-data-[state=checked]:text-white [&:has([data-state=checked])]:border-white"
                                            >
                                                <div className="flex w-full items-center gap-4">
                                                    <Wallet className="h-6 w-6" />
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-base">UPI / Netbanking</span>
                                                        <span className="text-xs text-neutral-400">Google Pay, PhonePe, Paytm</span>
                                                    </div>
                                                </div>
                                            </Label>
                                        </FormItem>
                                        <FormItem>
                                            <FormControl>
                                                <RadioGroupItem value="card" id="card" className="peer sr-only" />
                                            </FormControl>
                                            <Label
                                                htmlFor="card"
                                                className="flex flex-col items-center justify-between rounded-xl border-2 border-neutral-800 bg-neutral-900 p-4 hover:bg-neutral-800 hover:text-white peer-data-[state=checked]:border-white peer-data-[state=checked]:text-white [&:has([data-state=checked])]:border-white"
                                            >
                                                <div className="flex w-full items-center gap-4">
                                                    <CreditCard className="h-6 w-6" />
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-base">Card Payment</span>
                                                        <span className="text-xs text-neutral-400">Visa, Mastercard, RuPay</span>
                                                    </div>
                                                </div>
                                            </Label>
                                        </FormItem>
                                        <FormItem>
                                            <FormControl>
                                                <RadioGroupItem value="cod" id="cod" className="peer sr-only" />
                                            </FormControl>
                                            <Label
                                                htmlFor="cod"
                                                className="flex flex-col items-center justify-between rounded-xl border-2 border-neutral-800 bg-neutral-900 p-4 hover:bg-neutral-800 hover:text-white peer-data-[state=checked]:border-white peer-data-[state=checked]:text-white [&:has([data-state=checked])]:border-white"
                                            >
                                                <div className="flex w-full items-center gap-4">
                                                    <Truck className="h-6 w-6" />
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-base">Cash on Delivery</span>
                                                        <span className="text-xs text-neutral-400">Pay when you receive the order</span>
                                                    </div>
                                                </div>
                                            </Label>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" className="w-full h-14 bg-white text-black hover:bg-neutral-200 font-bold uppercase tracking-widest text-sm rounded-full shadow-lg shadow-white/10">
                    Place Order
                </Button>
            </form>
        </Form>
    )
}
