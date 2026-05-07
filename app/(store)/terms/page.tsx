"use client"

import { useState, useEffect } from "react"

export default function TermsPage() {
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
              Terms & Conditions
            </h1>
            <p className="text-zinc-500 font-sans tracking-widest uppercase text-xs font-bold">
              Last Updated: May 2026
            </p>
          </header>

          <div className="prose prose-zinc prose-lg max-w-none space-y-12">
            <p className="text-zinc-600 leading-relaxed">
              Welcome to Dimensions. By accessing and using our website, you agree to comply with the following Terms & Conditions. Please read them carefully before placing an order.
            </p>

            <section className="space-y-4">
              <h2 className="text-2xl font-heading text-primary">General</h2>
              <ul className="list-disc pl-6 text-zinc-600 space-y-2">
                <li>Dimensions reserves the right to update or modify these terms at any time without prior notice.</li>
                <li>By using this website, you agree to these terms and all applicable laws and regulations.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-heading text-primary">Products & Pricing</h2>
              <ul className="list-disc pl-6 text-zinc-600 space-y-2">
                <li>We strive to ensure all product details, images, and prices are accurate.</li>
                <li>Slight color variations may occur due to lighting, photography, or screen settings.</li>
                <li>Prices are subject to change without notice.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-heading text-primary">Orders & Payments</h2>
              <ul className="list-disc pl-6 text-zinc-600 space-y-2">
                <li>We currently accept prepaid payments only through secure payment gateways.</li>
                <li>Orders will be processed only after successful payment confirmation.</li>
                <li>We reserve the right to cancel or refuse any order at our discretion.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-heading text-primary">Shipping & Delivery</h2>
              <ul className="list-disc pl-6 text-zinc-600 space-y-2">
                <li>Orders are shipped using third-party courier services.</li>
                <li>Estimated delivery timelines may vary depending on location and courier availability.</li>
                <li>Delays caused by courier services or unforeseen circumstances are beyond our control.</li>
              </ul>
              <p className="text-sm text-zinc-500 italic mt-4">
                Please refer to our Shipping, Return & Refund Policy for more information.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-heading text-primary">Returns & Refunds</h2>
              <ul className="list-disc pl-6 text-zinc-600 space-y-2">
                <li>Returns are accepted only under the conditions mentioned in our Shipping, Return & Refund Policy.</li>
                <li>Refunds will be processed after inspection and approval of returned items.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-heading text-primary">User Responsibilities</h2>
              <div className="space-y-2">
                <p className="text-zinc-600">By using our website, you agree:</p>
                <ul className="list-disc pl-6 text-zinc-600 space-y-2">
                  <li>To provide accurate information during checkout</li>
                  <li>Not to misuse or attempt unauthorized access to the website</li>
                  <li>Not to engage in fraudulent or illegal activities</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-heading text-primary">Intellectual Property</h2>
              <div className="space-y-2">
                <p className="text-zinc-600">All website content including:</p>
                <ul className="list-disc pl-6 text-zinc-600 space-y-2">
                  <li>Images</li>
                  <li>Logos</li>
                  <li>Product descriptions</li>
                  <li>Designs</li>
                  <li>Graphics</li>
                </ul>
                <p className="text-zinc-600 mt-2">are the property of Dimensions and may not be copied or used without permission.</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-heading text-primary">Limitation of Liability</h2>
              <ul className="list-disc pl-6 text-zinc-600 space-y-2">
                <li>Dimensions shall not be held liable for:</li>
                <li>Indirect or incidental damages</li>
                <li>Delivery delays caused by third-party services</li>
                <li>Temporary website downtime or technical issues</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-heading text-primary">Governing Law</h2>
              <p className="text-zinc-600 leading-relaxed">
                These Terms & Conditions shall be governed by the laws of India.
              </p>
            </section>

            <section className="space-y-4 pt-12 border-t border-zinc-100">
              <h2 className="text-2xl font-heading text-primary">Contact Us</h2>
              <p className="text-zinc-600 leading-relaxed">
                For any questions regarding these Terms & Conditions, contact us at:
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
