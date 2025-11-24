import { Header } from "@/components/header"
import { HeroCarousel } from "@/components/hero-carousel"
import { CategoryCarousel } from "@/components/category-carousel"
import { FeaturedProducts } from "@/components/featured-products"
import { Features } from "@/components/features"
import { Testimonials } from "@/components/testimonials"
import { PromoSection } from "@/components/promo-section"
import { Footer } from "@/components/footer"
import type { Category, Product } from "@/lib/types"

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch("/api/categories", {
      next: { revalidate: 3600 },
    })
    if (!res.ok) throw new Error("Failed to fetch categories")
    return res.json()
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch("/api/products", {
      next: { revalidate: 3600 },
    })
    if (!res.ok) throw new Error("Failed to fetch products")
    return res.json()
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export default async function Home() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()])

  return (
    <main className="w-full">
      <Header />
      <HeroCarousel />

      {/* Categories Section */}
      <section className="py-16 bg-white border-t border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="mb-8 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">Collections</h2>
            <p className="text-muted-foreground font-sans">Explore our diverse range of saree collections</p>
          </div>
          <CategoryCarousel categories={categories} />
        </div>
      </section>

      {/* Featured Products */}
      <FeaturedProducts products={products} />

      {/* Features Section */}
      <Features />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Promotional Section */}
      <PromoSection />

      {/* Footer */}
      <Footer />
    </main>
  )
}
