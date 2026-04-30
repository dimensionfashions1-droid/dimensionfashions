"use client"

import { useState } from "react"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react"

export default function ContactPage() {
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })

            if (!res.ok) throw new Error("Failed to submit")

            toast({
                title: "Message Sent",
                description: "We've received your message and will get back to you soon.",
            })
            setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong. Please try again later.",
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-white pt-10 pb-20">
            <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                {/* Header Section Consistent with Checkout */}
                <div className="mb-12 border-b border-primary/10 pb-8">
                    <Breadcrumb className="mb-6">
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/" className="uppercase text-[10px] tracking-[0.2em] text-primary/60 hover:text-primary transition-colors font-sans font-bold">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="text-accent/40" />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="uppercase text-[10px] tracking-[0.2em] font-bold text-primary font-sans">Contact Us</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <h1 className="font-heading font-normal text-2xl md:text-4xl text-primary uppercase tracking-[0.05em]">Get in <span>Touch</span></h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                    {/* Left Section: Contact Form Consistent with CheckoutForm */}
                    <div className="lg:col-span-2">
                        <div className="bg-white border border-accent/20 rounded-[2.5rem] p-6 md:p-10 shadow-lg shadow-accent/5">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40 ml-4 italic">Full Name</label>
                                        <Input
                                            required
                                            placeholder="Your Name"
                                            className="h-12 rounded-full border-primary/10 px-6 focus:border-accent transition-all bg-primary/[0.01]"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40 ml-4 italic">Email Address</label>
                                        <Input
                                            required
                                            type="email"
                                            placeholder="email@example.com"
                                            className="h-12 rounded-full border-primary/10 px-6 focus:border-accent transition-all bg-primary/[0.01]"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40 ml-4 italic">Phone Number</label>
                                        <Input
                                            placeholder="+91 00000 00000"
                                            className="h-12 rounded-full border-primary/10 px-6 focus:border-accent transition-all bg-primary/[0.01]"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40 ml-4 italic">Subject</label>
                                        <Input
                                            required
                                            placeholder="How can we help?"
                                            className="h-12 rounded-full border-primary/10 px-6 focus:border-accent transition-all bg-primary/[0.01]"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40 ml-4 italic">Message</label>
                                    <Textarea
                                        required
                                        placeholder="Write your message here..."
                                        className="min-h-[160px] rounded-[2rem] border-primary/10 p-6 focus:border-accent transition-all bg-primary/[0.01] resize-none"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    />
                                </div>

                                <Button
                                    disabled={isSubmitting}
                                    className="w-full h-14 bg-primary hover:bg-black text-white rounded-full uppercase tracking-[0.3em] font-bold text-[10px] shadow-xl transition-all duration-500 group"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            Send Message
                                            <Send className="w-3.5 h-3.5 ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Right Section: Contact Details Consistent with OrderSummary */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-primary/5 border border-primary/5 rounded-[2.5rem] p-8 space-y-10">
                            <h3 className="font-heading text-2xl text-primary border-b border-primary/10 pb-4">Our <span>Studio</span></h3>
                            
                            <div className="space-y-8">
                                <div className="flex gap-5 items-start">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                                        <Mail className="w-4 h-4 text-accent" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-sans font-bold text-[9px] uppercase tracking-[0.2em] text-primary/40 italic">Email Enquiries</h4>
                                        <p className="font-sans font-bold text-sm text-primary break-all">contact@dimensionfashions.com</p>
                                    </div>
                                </div>

                                <div className="flex gap-5 items-start">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                                        <Phone className="w-4 h-4 text-accent" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-sans font-bold text-[9px] uppercase tracking-[0.2em] text-primary/40 italic">Customer Support</h4>
                                        <p className="font-sans font-bold text-sm text-primary">+91 9025783560</p>
                                    </div>
                                </div>

                                <div className="flex gap-5 items-start">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                                        <MapPin className="w-4 h-4 text-accent" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-sans font-bold text-[9px] uppercase tracking-[0.2em] text-primary/40 italic">Address</h4>
                                        <p className="font-sans font-bold text-sm text-primary leading-relaxed">
                                            N.M Sungam, Valparai main road, Pollachi, Tamil Nadu, 642007, India
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-primary/10">
                                <h4 className="font-heading text-lg text-primary mb-4 italic">Hours</h4>
                                <div className="space-y-2 text-[11px] font-sans text-primary/60 font-bold uppercase tracking-widest">
                                    <p className="flex justify-between"><span>Mon - Fri</span> <span>10AM - 7PM</span></p>
                                    <p className="flex justify-between"><span>Sat</span> <span>10AM - 4PM</span></p>
                                    <p className="flex justify-between text-accent"><span>Sun</span> <span>Closed</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
