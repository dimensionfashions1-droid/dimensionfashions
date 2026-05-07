"use client"

import { useState, useEffect } from "react"

export default function ShippingPolicyPage() {
  const [settings, setSettings] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings')
        const result = await res.json()
        if (result.data) {
          setSettings(result.data)
        }
      } catch (error) {
        console.error("Error fetching settings:", error)
      }
    }
    fetchSettings()
  }, [])

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-6 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          <header className="mb-16">
            <h1 className="text-3xl md:text-5xl font-heading text-primary mb-4 pb-4 reveal-text">
              Shipping, Return & Refund Policy
            </h1>
            <p className="text-zinc-500 font-sans tracking-widest uppercase text-xs font-bold">
              Last Updated: May 2026
            </p>
          </header>

          <div className="prose prose-zinc prose-lg max-w-none space-y-12">
            <p className="text-zinc-600 leading-relaxed">
              At Dimensions, we aim to provide a smooth and reliable shopping experience. Please read our policy carefully before placing an order.
            </p>

            <div className="border-t border-zinc-100 pt-12">
              <h2 className="text-4xl font-heading text-primary mb-8 underline decoration-accent/30 underline-offset-8">Shipping Policy</h2>

              <section className="space-y-4">
                <h3 className="text-2xl font-heading text-primary">Order Processing</h3>
                <ul className="list-disc pl-6 text-zinc-600 space-y-2">
                  <li>Orders are processed within 1–2 business days after successful payment.</li>
                  <li>Orders are not processed on Sundays or public holidays.</li>
                </ul>
              </section>

              <section className="space-y-4 mt-8">
                <h3 className="text-2xl font-heading text-primary">Shipping Charges</h3>
                <ul className="list-disc pl-6 text-zinc-600 space-y-2">
                  {settings.free_shipping_threshold && <li>Free shipping is available on orders above ₹{settings.free_shipping_threshold}.</li>}
                  {settings.flat_shipping_rate && <li>A flat shipping fee of ₹{settings.flat_shipping_rate} may apply on all orders </li>}
                </ul>
              </section>

              <section className="space-y-4 mt-8">
                <h3 className="text-2xl font-heading text-primary">Delivery Timeline</h3>
                <ul className="list-disc pl-6 text-zinc-600 space-y-2">
                  <li>Estimated delivery time is 3–7 business days depending on your location.</li>
                  <li>Delivery timelines may vary due to courier availability or unforeseen circumstances.</li>
                </ul>
              </section>

              <section className="space-y-4 mt-8">
                <h3 className="text-2xl font-heading text-primary">Shipping Method</h3>
                <ul className="list-disc pl-6 text-zinc-600 space-y-2">
                  <li>Orders are shipped manually using trusted third-party courier services.</li>
                  <li>Tracking information may not always be automatically available.</li>
                </ul>
                <p className="text-zinc-600 mt-2">If tracking details are available, they will be shared via email or WhatsApp.</p>
              </section>

              <section className="space-y-4 mt-8">
                <h3 className="text-2xl font-heading text-primary">Incorrect Address</h3>
                <p className="text-zinc-600 leading-relaxed">
                  Customers are responsible for providing accurate shipping details. Dimensions is not responsible for delivery issues caused by incorrect address or phone number provided during checkout.
                </p>
              </section>
            </div>

            <div className="border-t border-zinc-100 pt-12">
              <h2 className="text-4xl font-heading text-primary mb-8 underline decoration-accent/30 underline-offset-8">Return Policy</h2>

              <section className="space-y-4">
                <h3 className="text-2xl font-heading text-primary">Return Eligibility</h3>
                <p className="text-zinc-600">Returns are accepted within 7 days from the date of delivery.</p>
                <div className="space-y-2 mt-2">
                  <p className="text-zinc-600">To qualify for a return:</p>
                  <ul className="list-disc pl-6 text-zinc-600 space-y-2">
                    <li>The item must be unused and unwashed</li>
                    <li>Original tags and packaging must be intact</li>
                    <li>The product must be in resellable condition</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-4 mt-8">
                <h3 className="text-2xl font-heading text-primary">Non-Returnable Items</h3>
                <ul className="list-disc pl-6 text-zinc-600 space-y-2">
                  <li>Sale or discounted products</li>
                  <li>Used or damaged items</li>
                  <li>Products returned without original packaging or tags</li>
                </ul>
              </section>

              <section className="space-y-4 mt-8">
                <h3 className="text-2xl font-heading text-primary">Return Process</h3>
                <div className="space-y-2">
                  <p className="text-zinc-600">To request a return, contact us with:</p>
                  <ul className="list-disc pl-6 text-zinc-600 space-y-2">
                    <li>Order ID</li>
                    <li>Reason for return</li>
                    <li>Product images if applicable</li>
                  </ul>
                  <p className="text-zinc-600 mt-2">Once approved, return instructions will be shared.</p>
                </div>
              </section>

              <section className="space-y-4 mt-8">
                <h3 className="text-2xl font-heading text-primary">Return Shipping</h3>
                <ul className="list-disc pl-6 text-zinc-600 space-y-2">
                  <li>Customers are responsible for self-shipping returned products.</li>
                  <li>Return shipping charges are non-refundable.</li>
                </ul>
                <div className="mt-4 p-4 bg-zinc-50 border-l-4 border-accent">
                  <p className="text-zinc-600 text-sm font-medium">If the return is due to Wrong product received or Damaged product received, we may reimburse the shipping cost after verification.</p>
                </div>
              </section>
            </div>

            <div className="border-t border-zinc-100 pt-12">
              <h2 className="text-4xl font-heading text-primary mb-8 underline decoration-accent/30 underline-offset-8">Refund Policy</h2>

              <section className="space-y-4">
                <h3 className="text-2xl font-heading text-primary">Refund Approval</h3>
                <p className="text-zinc-600 leading-relaxed">
                  Refunds are processed only after the returned product is received and inspected.
                </p>
              </section>

              <section className="space-y-4 mt-8">
                <h3 className="text-2xl font-heading text-primary">Refund Timeline</h3>
                <p className="text-zinc-600 leading-relaxed">
                  Approved refunds will be credited to the original payment method within 5–7 business days. Actual bank processing time may vary.
                </p>
              </section>

              <section className="space-y-4 mt-8">
                <h3 className="text-2xl font-heading text-primary">Damaged or Incorrect Products</h3>
                <div className="space-y-2">
                  <p className="text-zinc-600">If you receive a damaged or incorrect item:</p>
                  <ul className="list-disc pl-6 text-zinc-600 space-y-2">
                    <li>Report it within 48 hours of delivery</li>
                    <li>Share clear product images or an unboxing video</li>
                  </ul>
                  <p className="text-zinc-600 mt-4">We may provide: Replacement, Full refund, or Store credit depending on the situation.</p>
                </div>
              </section>
            </div>

            <div className="border-t border-zinc-100 pt-12">
              <h2 className="text-4xl font-heading text-primary mb-8 underline decoration-accent/30 underline-offset-8">Cancellation Policy</h2>
              <ul className="list-disc pl-6 text-zinc-600 space-y-2">
                <li>Orders can only be cancelled before dispatch.</li>
                <li>Once shipped, orders cannot be cancelled.</li>
              </ul>
            </div>

            <section className="space-y-4 pt-12 border-t border-zinc-100">
              <h2 className="text-2xl font-heading text-primary">Contact Us</h2>
              <p className="text-zinc-600 leading-relaxed">
                For shipping, return, or refund related queries, contact us at:
              </p>
              <p className="text-primary font-bold">
                Email: {settings.store_email || "support@dimensions.in"}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
