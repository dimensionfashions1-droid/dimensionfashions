"use client"

import { useState, useEffect } from "react"

export default function PrivacyPolicyPage() {
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
              Privacy Policy
            </h1>
            <p className="text-zinc-500 font-sans tracking-widest uppercase text-xs font-bold">
              Last Updated: May 2026
            </p>
          </header>

          <div className="prose prose-zinc prose-lg max-w-none space-y-12">
            <p className="text-zinc-600 leading-relaxed">
              At Dimensions, we value your privacy and are committed to protecting your personal information.
            </p>

            <section className="space-y-4">
              <h2 className="text-2xl font-heading text-primary">Information We Collect</h2>
              <div className="space-y-2">
                <p className="text-zinc-600">We may collect the following information when you use our website:</p>
                <ul className="list-disc pl-6 text-zinc-600 space-y-2">
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Shipping and billing address</li>
                  <li>Order and payment details</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-heading text-primary">How We Use Your Information</h2>
              <div className="space-y-2">
                <p className="text-zinc-600">Your information is used to:</p>
                <ul className="list-disc pl-6 text-zinc-600 space-y-2">
                  <li>Process and deliver orders</li>
                  <li>Provide customer support</li>
                  <li>Send order updates and notifications</li>
                  <li>Improve our website and services</li>
                  <li>Prevent fraudulent transactions</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-heading text-primary">Payment Security</h2>
              <ul className="list-disc pl-6 text-zinc-600 space-y-2">
                <li>Payments are processed securely through trusted third-party payment gateways.</li>
                <li>We do not store your debit/credit card information.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-heading text-primary">Sharing of Information</h2>
              <div className="space-y-2">
                <p className="text-zinc-600">We do not sell or rent your personal information.</p>
                <p className="text-zinc-600 mt-2">Your information may only be shared with:</p>
                <ul className="list-disc pl-6 text-zinc-600 space-y-2">
                  <li>Courier or delivery providers</li>
                  <li>Payment service providers</li>
                  <li>Legal authorities when required by law</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-heading text-primary">Cookies</h2>
              <div className="space-y-2">
                <p className="text-zinc-600">Our website may use cookies to:</p>
                <ul className="list-disc pl-6 text-zinc-600 space-y-2">
                  <li>Improve browsing experience</li>
                  <li>Store cart or login sessions</li>
                  <li>Analyze website traffic</li>
                </ul>
                <p className="text-zinc-600 mt-2">You may disable cookies through your browser settings.</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-heading text-primary">Data Security</h2>
              <p className="text-zinc-600 leading-relaxed">
                We implement reasonable security measures to protect your personal information from unauthorized access or misuse.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-heading text-primary">Your Rights</h2>
              <div className="space-y-2">
                <p className="text-zinc-600">You may request:</p>
                <ul className="list-disc pl-6 text-zinc-600 space-y-2">
                  <li>Access to your personal data</li>
                  <li>Correction of incorrect information</li>
                  <li>Deletion of your account or data</li>
                </ul>
                <p className="text-zinc-600 mt-2">by contacting us via email.</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-heading text-primary">Third-Party Links</h2>
              <p className="text-zinc-600 leading-relaxed">
                Our website may contain links to third-party websites. We are not responsible for their privacy practices or content.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-heading text-primary">Changes to This Policy</h2>
              <p className="text-zinc-600 leading-relaxed">
                We may update this Privacy Policy periodically. Updated versions will be posted on this page.
              </p>
            </section>

            <section className="space-y-4 pt-12 border-t border-zinc-100">
              <h2 className="text-2xl font-heading text-primary">Contact Us</h2>
              <p className="text-zinc-600 leading-relaxed">
                If you have questions regarding this Privacy Policy, contact us at:
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
