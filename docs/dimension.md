# Project Analysis: Dimension

Dimension is a low-budget, scalable eCommerce platform designed specifically for a Women's Wear business operating within India. The project prioritizes speed of development, cost-efficiency (leveraging free tiers), and a clean, maintainable full-stack architecture.

## 🏗️ Architecture

The application follows a modern full-stack architecture using Next.js on Vercel.

```
Browser
  ↓
Next.js (Server + Client Components)
  ↓
Next.js Route Handlers (API)
  ↓
Supabase (PostgreSQL + Auth + Storage)
```

- **Frontend:** Next.js App Router with React 19.
- **Backend:** Next.js Route Handlers acting as a serverless backend.
- **Database:** Supabase (PostgreSQL) for relational data.
- **Authentication:** Supabase Auth for both admin and customer roles.
- **Storage:** Supabase Storage for product images and banners.
- **Payments:** Razorpay for India-specific payment methods (UPI, Cards, Netbanking).

## 🛠️ Tech Stack

- **Framework:** Next.js 16+ (App Router)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI (Radix UI)
- **State Management:** Zustand (for Cart/Wishlist)
- **Data Fetching:** SWR
- **Forms:** React Hook Form + Zod
- **Database/Backend-as-a-Service:** Supabase
- **Payments:** Razorpay SDK

## 📦 Core Features

### 1. Product Management
- **Generic Attribute System:** Allows flexible product types (Sarees, Footwear, etc.) without schema changes using a decoupled attribute-option model.
- **Variable Products (Variants):** Support for unique combinations of attributes (e.g., Maroon-XL) with specific:
    - **Price & Original Price overrides**
    - **Inventory tracking (Stock Count)**
    - **SKU management**
    - **Variant-specific image galleries**
- **Categorization:** Hierarchical organization via Categories and Subcategories.
- **Search & Filters:** Full-text search and dynamic filtering based on product attributes.

### 2. Shopping Experience
- **Home Page:** Features hero carousels, category circles, featured drops, and trending sections.
- **Product Gallery:** High-quality image displays with zoom and selection features.
- **Cart & Wishlist:** Persistent storage with guest support and automatic merging upon login.
- **Checkout:** Streamlined flow with address management and Razorpay integration.

### 3. User Management
- **Customer Profiles:** Order history, address book, and profile settings.
- **Authentication:** OTP or password-based login for customers; password-based for admins.

### 4. Admin Dashboard
- **Analytics:** Real-time stats on revenue, orders, and stock.
- **CRUD Operations:** Management of products, categories, attributes, and banners.
- **Order Fulfillment:** Tracking order status and updating courier information.
- **Site Settings:** Configuration for shipping thresholds, rates, and social links.

## 🗄️ Data Model (Key Tables)

- **`products`**: Core product details.
- **`attribute_definitions` & `attribute_options`**: Dynamic system for product variants.
- **`product_attributes`**: Bridge table linking products to specific attribute values.
- **`categories` & `subcategories`**: Navigation hierarchy.
- **`orders` & `order_items`**: Transaction records with snapshots of product data.
- **`users` & `user_addresses`**: Customer data extending Supabase Auth.
- **`banners`**: Management of marketing visuals.
- **`site_settings`**: Key-value pairs for global configuration.

## 🛣️ API Structure (`/app/api`)

- **`/products`**: Catalog access and management.
- **`/categories` & `/subcategories`**: Navigation data.
- **`/attributes`**: Dynamic filtering options.
- **`/payments`**: Razorpay order creation and verification.
- **`/admin`**: Protected routes for dashboard statistics and management.
- **`/users`**: Profile and order history management.
- **`/reviews`**, **`/contact`**, **`/newsletter`**: Interactive features.

## 🧠 Development Principles

- **MVP First:** Focus on core functionality over premature optimization.
- **Server-Side Security:** Razorpay verification and admin actions must happen server-side.
- **Responsive Design:** Optimized for mobile-first users in the Indian market.
- **Type Safety:** Rigorous use of TypeScript to prevent runtime errors.
- **Maintainability:** Consistent folder structure and modular component design.

## 🚀 Deployment & Operations

- **Hosting:** Vercel (Free Tier)
- **CI/CD:** Automatic deployments via GitHub integration.
- **Monitoring:** Vercel Analytics.
