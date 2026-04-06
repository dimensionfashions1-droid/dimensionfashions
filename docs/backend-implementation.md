# Backend Implementation Guide: Dimensions

Complete phased backend implementation plan for the Dimensions Women's Wear e-commerce platform.

> [!NOTE]
> Product attributes (color, size, fabric, sole type, etc.) use a **generic attribute system** so the store can sell any product type (sarees, chappals, shoes, bags) without schema changes. See [schema.md](file:///d:/dimensions/docs/schema.md) for full definitions.

## 🏗️ Architecture

```
Browser → Next.js (Server + Client Components) → Route Handlers (API) → Supabase (Postgres + Storage)
```

---

## 📅 Phase 1: Supabase Infrastructure

### Task 1.1: Supabase Client Setup
- Create `lib/supabase/client.ts` — browser client (anon key)
- Create `lib/supabase/server.ts` — server-side client (service role)
- Add env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

### Task 1.2: Database Schema
- Execute SQL from `schema.md` in Supabase dashboard
- 16 Tables: `categories`, `subcategories`, `attribute_definitions`, `attribute_options`, `product_attributes`, `products`, `reviews`, `orders`, `order_items`, `coupons`, `newsletter_subscribers`, `banners`, `site_settings`, `contact_submissions`, `wishlist`, `cart`
- Enable RLS on all tables

### Task 1.3: Seed Attribute Definitions
- Create global attributes: Color, Size, Fabric, Craft, Care, Sole Type, Heel Height, Material
- Create attribute options: color swatches with hex codes, size values (S/M/L/XL, UK 6-11, Standard), fabric types

### Task 1.4: Seed Data
- Migrate existing mock data from frontend components into Supabase
- Categories from `Navbar.tsx` (8 categories + subcategories)
- Products from `ProductsPage` and `home/page.tsx`
- Link each product to its attributes via `product_attributes`

---

## 🔐 Phase 2: Authentication & Admin Security

### Task 2.1: Admin & Customer Auth
- Setup Supabase Auth 
- Admin: manual creation, `(admin)/login/page.tsx` (`signInWithPassword`)
- Customer: `(store)/login/page.tsx` (`signInWithOtp` or password)

### Task 2.2: Route Protection
- Create `middleware.ts` to protect all `/(admin)/*` routes
- Redirect unauthenticated admins to `/admin/login`
- Create `lib/supabase/auth.ts` helper for session checks

### Task 2.3: User Profile Trigger
- Create SQL trigger in Supabase to insert a row into the `users` table whenever a new customer signs up in `auth.users`

### Task 2.4: User Addresses API
- `GET/POST/PUT/DELETE /api/users/addresses` — Manage customer saved addresses

---

## 📦 Phase 3: Core API Layer

### Task 3.1: Products API
- `GET /api/products` — List with filters (category, subcategory, price range, attribute values, search)
- `GET /api/products/[slug]` — Single product with attributes + reviews
- `POST /api/products` — Create product + link attributes (Admin)
- `PUT /api/products/[slug]` — Update product + attributes (Admin)
- `DELETE /api/products/[slug]` — Delete (Admin)

### Task 3.2: Attributes API
- `GET /api/attributes` — All attribute definitions with options (for FiltersSidebar)
- `GET /api/attributes?filterable=true` — Only filterable attributes
- `POST/PUT/DELETE /api/attributes` — Admin CRUD for definitions + options

### Task 3.3: Categories API
- `GET /api/categories` — All categories with subcategories
- `POST/PUT/DELETE /api/categories` — Admin CRUD

### Task 3.4: Reviews API
- `GET /api/reviews?product_id=xxx` — Fetch reviews for a product
- `POST /api/reviews` — Submit a review (public)
- `POST /api/reviews/[id]/helpful` — Increment helpful count

### Task 3.5: Search API
- `GET /api/search?q=kanjivaram&category=sarees` — Full-text search on product title/description

### Task 3.6: Newsletter API
- `POST /api/newsletter` — Subscribe email (from Footer + CtaSection)

### Task 3.7: Banners API
- `GET /api/banners?placement=hero` — Fetch active banners for homepage carousel
- Admin: `GET/POST/PUT/DELETE /api/admin/banners` — Manage hero slides and promo banners

### Task 3.8: Site Settings API
- `GET /api/settings` — Public: fetch all settings (shipping threshold, social links, etc.)
- `PUT /api/admin/settings` — Admin: update key-value pairs

### Task 3.9: Contact API
- `POST /api/contact` — Store submission + optional email notification to admin

---

## 💳 Phase 4: Payment & Checkout

### Task 4.1: Razorpay Setup
- Create `lib/razorpay/client.ts` with SDK init
- Env vars: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`

### Task 4.2: Checkout Flow
- `POST /api/payments/create-order` — Calculate total server-side, create Razorpay order
- `POST /api/payments/verify` — HMAC-SHA256 signature verification
- On success: Create order + order_items in Supabase, decrement `stock_count`
- On COD: Create order directly with `payment_status: 'pending'`

### Task 4.3: Coupon System
- `POST /api/coupons/validate` — Validate coupon code, return discount
- Admin: `GET/POST/PUT/DELETE /api/admin/coupons` — Manage coupons

---

## 🖼️ Phase 5: Storage & Media

### Task 5.1: Image Upload
- Create Supabase Storage bucket: `product-media`
- Create `lib/supabase/storage.ts` — Upload/delete utilities
- `POST /api/upload` — Handle multipart image uploads (Admin)
- Generate public URLs for product images

---

## 📈 Phase 6: Admin Dashboard Backend

### Task 6.1: Dashboard Stats
- `GET /api/admin/stats` — Total revenue, orders count, out-of-stock count, new subscribers

### Task 6.2: Order Management
- `GET /api/admin/orders` — List with filters (status, date range)
- `PUT /api/admin/orders/[id]` — Update `order_status`, `tracking_number`, `courier_name`

### Task 6.3: Product Management
- Admin product listing, creation, editing UI pages
- `(admin)/products/page.tsx`, `(admin)/products/new/page.tsx`
- Dynamic attribute form: based on `attribute_definitions`, render correct inputs (color picker, size selector, text field)

### Task 6.4: Attribute Management
- `(admin)/attributes/page.tsx` — List/create/edit attribute definitions and their options
- Used to add new attribute types when expanding product catalog (e.g., adding 'Sole Type' when selling footwear)

### Task 6.5: Banner Management
- `(admin)/banners/page.tsx` — Create/edit/schedule hero and promo banners
- Upload banner images to Supabase Storage

### Task 6.6: Site Settings Panel
- `(admin)/settings/page.tsx` — Edit shipping rates, free shipping threshold, contact info, social links

### Task 6.7: Contact Inbox
- `(admin)/messages/page.tsx` — View and manage customer contact submissions

---

## 🛒 Phase 7: Cart & Wishlist Persistence

### Task 7.1: Guest Storage (Zustand)
- Maintain current Zustand + `persist` via local storage setup for guests
- Ensure `guest_id` is generated and saved as a cookie on first visit

### Task 7.2: Database Persistence for Logged-In Users
- API routes to fetch, add, and remove items from DB `cart` and `wishlist` tables using `user_id` when Supabase session exists
- Zustand stores update to sync with DB when user is logged in

### Task 7.3: Data Merging on Login
- When a customer logs in, check for their existing local storage cart/wishlist
- Merge these local items into their `user_id` mapped database records inside Supabase
- Clear local storage versions once successfully merged

---

## 🔍 Phase 8: Order Tracking (Public)

### Task 8.1: Track Order Page
- `(store)/track-order/page.tsx` — Enter order number + email to view status
- `GET /api/orders/track?order_number=xxx&email=xxx`

### Task 8.2: Contact Page
- `(store)/contact/page.tsx` — Contact form with name, email, phone, subject, message
- Submits to `POST /api/contact`

### Task 8.3: Static Pages
- `(store)/privacy/page.tsx`, `(store)/terms/page.tsx`, `(store)/shipping-policy/page.tsx`
- Referenced in Footer.tsx — can be static markdown or fetched from a CMS later

---

## ✅ Verification Checklist

- [ ] Supabase client connects with env variables
- [ ] Admin routes blocked for unauthenticated users
- [ ] Product CRUD works end-to-end with generic attributes
- [ ] Product images upload to Supabase Storage
- [ ] Navbar categories populated from database
- [ ] Hero carousel loads banners from database
- [ ] Shipping threshold read from site_settings table
- [ ] Search returns relevant products
- [ ] Reviews can be submitted and displayed
- [ ] Newsletter subscription stores email
- [ ] Coupon codes apply correct discounts
- [ ] Razorpay checkout modal opens with correct amount
- [ ] Payment verified server-side with HMAC
- [ ] Order created in DB after successful payment
- [ ] Order tracking returns correct status
- [ ] Contact form submissions stored in database
- [ ] Admin dashboard shows live stats
- [ ] Admin can manage banners, settings, and contact inbox
