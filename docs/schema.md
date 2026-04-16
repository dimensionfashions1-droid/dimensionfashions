# Database Schema: Dimensions

Complete PostgreSQL schema for the Dimensions e-commerce platform (Supabase).

## 🛠️ Extensions & Enums

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE order_status AS ENUM ('processing', 'shipped', 'delivered', 'cancelled', 'returned');
CREATE TYPE payment_method AS ENUM ('upi', 'card', 'cod');
CREATE TYPE attribute_type AS ENUM ('select', 'multi_select', 'text', 'color');
```

---

## 📦 Tables

---

### 1. Users (Customer Profiles)

> Extends Supabase `auth.users`. Created automatically via trigger on signup.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PK, REFERENCES auth.users(id) ON DELETE CASCADE` | |
| `is_admin` | `boolean` | `DEFAULT false` | Restrict update via RLS |
| `first_name` | `text` | | |
| `last_name` | `text` | | |
| `phone` | `text` | | |
| `created_at` | `timestamptz` | `DEFAULT now()` | |
| `updated_at` | `timestamptz` | `DEFAULT now()` | |

---

### 2. User Addresses

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PK, DEFAULT uuid_generate_v4()` | |
| `user_id` | `uuid` | `REFERENCES users(id) ON DELETE CASCADE` | |
| `title` | `text` | | e.g. 'Home', 'Office' |
| `first_name` | `text` | `NOT NULL` | |
| `last_name` | `text` | `NOT NULL` | |
| `address` | `text` | `NOT NULL` | |
| `city` | `text` | `NOT NULL` | |
| `state` | `text` | `NOT NULL` | |
| `pincode` | `text` | `NOT NULL` | |
| `phone` | `text` | `NOT NULL` | |
| `is_default` | `boolean` | `DEFAULT false` | |
| `created_at` | `timestamptz` | `DEFAULT now()` | |
| `updated_at` | `timestamptz` | `DEFAULT now()` | |

---

### 2. Categories

> Source: `Navbar.tsx`, `CategoryCircles.tsx`, `FiltersSidebar.tsx`

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PK, DEFAULT uuid_generate_v4()` | |
| `name` | `text` | `NOT NULL` | e.g., 'Sarees', 'Footwear' |
| `slug` | `text` | `NOT NULL, UNIQUE` | URL-safe name |
| `image_url` | `text` | | Category circle image |
| `created_at` | `timestamptz` | `DEFAULT now()` | |

---

### 2. Subcategories

> Source: `Navbar.tsx` mega menu (Silk Sarees, Kanjivaram, Bridal Lehengas, Chappals, Heels...)

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PK, DEFAULT uuid_generate_v4()` | |
| `category_id` | `uuid` | `REFERENCES categories(id) ON DELETE CASCADE` | |
| `name` | `text` | `NOT NULL` | e.g., 'Kanjivaram', 'Kolhapuri' |
| `slug` | `text` | `NOT NULL, UNIQUE` | |
| `created_at` | `timestamptz` | `DEFAULT now()` | |

---

### 3. Attribute Definitions

> Defines **what** attributes exist globally. Admin creates these once.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PK, DEFAULT uuid_generate_v4()` | |
| `name` | `text` | `NOT NULL, UNIQUE` | e.g., 'Color', 'Size', 'Fabric', 'Sole Type', 'Heel Height' |
| `slug` | `text` | `NOT NULL, UNIQUE` | e.g., 'color', 'size', 'fabric' |
| `type` | `attribute_type` | `NOT NULL` | Determines UI control |
| `is_filterable` | `boolean` | `DEFAULT false` | Show in FiltersSidebar |
| `is_variant` | `boolean` | `DEFAULT true` | If true, buyer must select before adding to cart |
| `display_order` | `int` | `DEFAULT 0` | Sort order on product page |
| `created_at` | `timestamptz` | `DEFAULT now()` | |

**Example rows:**

| name | slug | type | is_filterable | is_variant |
|------|------|------|-----|------|
| Color | color | `color` | ✅ | ✅ |
| Size | size | `select` | ✅ | ✅ |
| Fabric | fabric | `text` | ✅ | ❌ |
| Craft | craft | `text` | ❌ | ❌ |
| Care | care | `text` | ❌ | ❌ |
| Sole Type | sole-type | `select` | ✅ | ❌ |
| Heel Height | heel-height | `text` | ✅ | ❌ |

---

### 4. Attribute Options

> Predefined values for `select` / `multi_select` / `color` type attributes.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PK, DEFAULT uuid_generate_v4()` | |
| `attribute_id` | `uuid` | `REFERENCES attribute_definitions(id) ON DELETE CASCADE` | |
| `value` | `text` | `NOT NULL` | e.g., 'Red', 'XL', 'Pure Silk' |
| `display_value` | `text` | | Optional display label |
| `hex_code` | `text` | | For `color` type: '#6B1D2A' |
| `display_order` | `int` | `DEFAULT 0` | |

**Examples:**

| Attribute | value | hex_code |
|-----------|-------|----------|
| Color | Maroon | #6B1D2A |
| Color | Gold | #B8860B |
| Size | S | — |
| Size | M | — |
| Size | Standard | — |
| Size | UK 6 | — |
| Fabric | Pure Silk | — |
| Sole Type | Rubber | — |

---

### 5. Product Attributes

> Links products to their actual attribute values. **This replaces the old `colors`, `sizes`, `fabric`, `craft`, `care` columns.**

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PK, DEFAULT uuid_generate_v4()` | |
| `product_id` | `uuid` | `REFERENCES products(id) ON DELETE CASCADE` | |
| `attribute_id` | `uuid` | `REFERENCES attribute_definitions(id)` | |
| `option_id` | `uuid` | `REFERENCES attribute_options(id)` | For select/color types |
| `text_value` | `text` | | For text type (e.g., care instructions) |

**Example for a Saree:**

| Product | Attribute | Option/Text |
|---------|-----------|-------------|
| Midnight Kanjivaram | Color | Maroon (option) |
| Midnight Kanjivaram | Color | Gold (option) |
| Midnight Kanjivaram | Size | Standard (option) |
| Midnight Kanjivaram | Fabric | Pure Silk (text) |
| Midnight Kanjivaram | Craft | Kanjivaram Zari Work (text) |
| Midnight Kanjivaram | Care | Dry clean only (text) |

**Example for a Chappal:**

| Product | Attribute | Option/Text |
|---------|-----------|-------------|
| Kolhapuri Chappal | Color | Tan (option) |
| Kolhapuri Chappal | Size | UK 6 (option) |
| Kolhapuri Chappal | Size | UK 7 (option) |
| Kolhapuri Chappal | Sole Type | Rubber (option) |
| Kolhapuri Chappal | Care | Wipe with damp cloth (text) |

---

### 6. Products (Simplified)

> Core product data only. All variable attributes live in `product_attributes`.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PK, DEFAULT uuid_generate_v4()` | |
| `title` | `text` | `NOT NULL` | Product name |
| `slug` | `text` | `NOT NULL, UNIQUE` | SEO URL |
| `description` | `text` | | Full description |
| `price` | `numeric` | `NOT NULL` | Selling price (₹) |
| `original_price` | `numeric` | | MRP before discount |
| `discount` | `numeric` | `DEFAULT 0` | Discount % |
| `category_id` | `uuid` | `REFERENCES categories(id)` | |
| `subcategory_id` | `uuid` | `REFERENCES subcategories(id)` | |
| `images` | `text[]` | `NOT NULL` | Image URLs |
| `rating` | `numeric` | `DEFAULT 0` | Avg star rating |
| `reviews_count` | `int` | `DEFAULT 0` | Total reviews |
| `stock_count` | `int` | `DEFAULT 0` | Physical stock |
| `is_in_stock` | `boolean` | `GENERATED ALWAYS AS (stock_count > 0)` | |
| `is_featured` | `boolean` | `DEFAULT false` | Homepage feature |
| `is_best_seller` | `boolean` | `DEFAULT false` | Best Sellers section |
| `created_at` | `timestamptz` | `DEFAULT now()` | Latest Arrivals sort |

---

### 7. Reviews

> Source: `ReviewSection.tsx`

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PK, DEFAULT uuid_generate_v4()` | |
| `product_id` | `uuid` | `REFERENCES products(id) ON DELETE CASCADE` | |
| `author_name` | `text` | `NOT NULL` | |
| `author_email` | `text` | | For verification |
| `rating` | `int` | `NOT NULL, CHECK (1-5)` | |
| `title` | `text` | | |
| `content` | `text` | | |
| `helpful_count` | `int` | `DEFAULT 0` | |
| `is_verified` | `boolean` | `DEFAULT false` | |
| `created_at` | `timestamptz` | `DEFAULT now()` | |

---

### 9. Orders

> Source: `CheckoutForm.tsx`

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PK, DEFAULT uuid_generate_v4()` | |
| `user_id` | `uuid` | `REFERENCES users(id)` | Optional (null for guests) |
| `order_number` | `text` | `UNIQUE, NOT NULL` | e.g., DIM-20260401-001 |
| `email` | `text` | `NOT NULL` | |
| `phone` | `text` | `NOT NULL` | |
| `first_name` | `text` | `NOT NULL` | |
| `last_name` | `text` | `NOT NULL` | |
| `address` | `text` | `NOT NULL` | |
| `city` | `text` | `NOT NULL` | |
| `state` | `text` | `NOT NULL` | |
| `pincode` | `text` | `NOT NULL` | |
| `subtotal` | `numeric` | `NOT NULL` | |
| `shipping_cost` | `numeric` | `DEFAULT 0` | |
| `discount_amount` | `numeric` | `DEFAULT 0` | |
| `total_amount` | `numeric` | `NOT NULL` | |
| `coupon_code` | `text` | | |
| `payment_method` | `payment_method` | `DEFAULT 'upi'` | |
| `payment_status` | `payment_status` | `DEFAULT 'pending'` | |
| `order_status` | `order_status` | `DEFAULT 'processing'` | |
| `tracking_number` | `text` | | |
| `courier_name` | `text` | | |
| `razorpay_order_id` | `text` | `UNIQUE` | |
| `razorpay_payment_id` | `text` | | |
| `razorpay_signature` | `text` | | |
| `notes` | `text` | | |
| `cancellation_requested` | `boolean` | `DEFAULT false` | |
| `cancellation_reason` | `text` | | |
| `created_at` | `timestamptz` | `DEFAULT now()` | |

---

### 9. Order Items

> Source: `CartItem.tsx` — stores selected attribute values as JSONB snapshot

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PK, DEFAULT uuid_generate_v4()` | |
| `order_id` | `uuid` | `REFERENCES orders(id) ON DELETE CASCADE` | |
| `product_id` | `uuid` | `REFERENCES products(id)` | |
| `title` | `text` | `NOT NULL` | Snapshot |
| `image` | `text` | | Snapshot |
| `quantity` | `int` | `NOT NULL` | |
| `price_at_purchase` | `numeric` | `NOT NULL` | |
| `selected_attributes` | `jsonb` | | e.g., `{"color":"Maroon","size":"Standard"}` |

---

### 10. Coupons

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PK, DEFAULT uuid_generate_v4()` | |
| `code` | `text` | `NOT NULL, UNIQUE` | |
| `discount_type` | `text` | `NOT NULL` | 'percentage' or 'flat' |
| `discount_value` | `numeric` | `NOT NULL` | |
| `min_order_amount` | `numeric` | `DEFAULT 0` | |
| `max_uses` | `int` | | |
| `used_count` | `int` | `DEFAULT 0` | |
| `is_active` | `boolean` | `DEFAULT true` | |
| `expires_at` | `timestamptz` | | |
| `created_at` | `timestamptz` | `DEFAULT now()` | |

---

### 11. Newsletter Subscribers

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PK, DEFAULT uuid_generate_v4()` | |
| `email` | `text` | `NOT NULL, UNIQUE` | |
| `is_active` | `boolean` | `DEFAULT true` | |
| `created_at` | `timestamptz` | `DEFAULT now()` | |

---

### 12. Banners

> Source: `HeroCarousel.tsx` (hero slides), `OfferBanner.tsx` (promo banners) — all hardcoded, should be admin-managed

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PK, DEFAULT uuid_generate_v4()` | |
| `title` | `text` | `NOT NULL` | e.g., 'Ethnic Elegance' |
| `subtitle` | `text` | | e.g., 'Graceful festive charm' |
| `image_url` | `text` | `NOT NULL` | Banner image |
| `link_url` | `text` | | CTA destination |
| `placement` | `text` | `NOT NULL` | 'hero', 'promo', 'sale' |
| `display_order` | `int` | `DEFAULT 0` | Sort order |
| `is_active` | `boolean` | `DEFAULT true` | |
| `starts_at` | `timestamptz` | | Schedule start |
| `ends_at` | `timestamptz` | | Schedule end |
| `created_at` | `timestamptz` | `DEFAULT now()` | |

---

### 13. Site Settings

> Source: `Navbar.tsx` ("Free Shipping on orders above ₹2999"), `CartSummary.tsx` (shipping cost), `ProductInfo.tsx` ("Free Shipping on orders over ₹999")

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PK, DEFAULT uuid_generate_v4()` | |
| `key` | `text` | `NOT NULL, UNIQUE` | Setting identifier |
| `value` | `text` | `NOT NULL` | Setting value |
| `description` | `text` | | Admin-facing label |
| `updated_at` | `timestamptz` | `DEFAULT now()` | |

**Default rows:**

| key | value | description |
|-----|-------|-------------|
| `free_shipping_threshold` | `2999` | Minimum order for free shipping (₹) |
| `flat_shipping_rate` | `99` | Flat shipping charge (₹) |
| `cod_extra_charge` | `49` | Extra charge for COD orders (₹) |
| `return_days` | `7` | Return window in days |
| `store_email` | `hello@dimensions.in` | Contact email |
| `store_phone` | `+91 98765 43210` | Contact phone |
| `instagram_url` | `https://instagram.com/dimensions` | Social link |
| `facebook_url` | `https://facebook.com/dimensions` | Social link |

---

### 14. Contact Submissions

> Source: `Navbar.tsx` "Contact Us" link, mobile menu "Contact Us"

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PK, DEFAULT uuid_generate_v4()` | |
| `name` | `text` | `NOT NULL` | |
| `email` | `text` | `NOT NULL` | |
| `phone` | `text` | | |
| `subject` | `text` | | |
| `message` | `text` | `NOT NULL` | |
| `is_read` | `boolean` | `DEFAULT false` | Admin marks as read |
| `created_at` | `timestamptz` | `DEFAULT now()` | |

---

### 15. Wishlist

> Database persistence for logged-in users, optional guest fallback.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PK, DEFAULT uuid_generate_v4()` | |
| `user_id` | `uuid` | `REFERENCES users(id)` | Populated for logged-in users |
| `guest_id` | `uuid` | | Populated for guests |
| `product_id` | `uuid` | `REFERENCES products(id)` | |
| `created_at` | `timestamptz` | `DEFAULT now()` | |
| `CONSTRAINT` | `chk_owner` | `CHECK (user_id IS NOT NULL OR guest_id IS NOT NULL)` | Must have an owner |

---

### 16. Cart

> Database persistence for logged-in users, optional guest fallback.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PK, DEFAULT uuid_generate_v4()` | |
| `user_id` | `uuid` | `REFERENCES users(id)` | Populated for logged-in users |
| `guest_id` | `uuid` | | Populated for guests |
| `product_id` | `uuid` | `REFERENCES products(id)` | |
| `quantity` | `int` | `DEFAULT 1` | |
| `selected_attributes` | `jsonb` | | e.g., `{"color":"Tan","size":"UK 7"}` |
| `updated_at` | `timestamptz` | `DEFAULT now()` | |
| `CONSTRAINT` | `chk_owner` | `CHECK (user_id IS NOT NULL OR guest_id IS NOT NULL)` | Must have an owner |

---

## 🛡️ RLS Policies

| Table | Public | Admin |
| :--- | :--- | :--- |
| Users | Scoped to own `id` | Full CRUD |
| User Addresses | Scoped to own `user_id` | Full CRUD |
| Categories | `SELECT` | Full CRUD |
| Subcategories | `SELECT` | Full CRUD |
| Attribute Definitions | `SELECT` | Full CRUD |
| Attribute Options | `SELECT` | Full CRUD |
| Product Attributes | `SELECT` | Full CRUD |
| Products | `SELECT` | Full CRUD |
| Reviews | `SELECT`, `INSERT` | Full CRUD |
| Orders | `INSERT`, Scoped `SELECT` | Full CRUD |
| Order Items | `INSERT`, Scoped `SELECT` | Full CRUD |
| Coupons | `SELECT` (active only) | Full CRUD |
| Newsletter | `INSERT` | `SELECT`, `DELETE` |
| Banners | `SELECT` (active only) | Full CRUD |
| Site Settings | `SELECT` | Full CRUD |
| Contact Submissions | `INSERT` | Full CRUD |
| Wishlist | Scoped to `user_id` or `guest_id` | `SELECT` |
| Cart | Scoped to `user_id` or `guest_id` | `SELECT` |
