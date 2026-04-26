# Technical Audit Report: Products API & Admin Panel

## 🔴 Critical Bugs

### 1. Destructive Product Variant Updates
- **Location:** `app/api/products/[slug]/route.ts` (PUT handler)
- **Root Cause:** The API deletes all existing entries in `product_variants` and `product_attributes` before re-inserting the new payload. This breaks historical data (like order items referencing those IDs) and is extremely inefficient.
- **Fix:** Implement a synchronization logic that matches existing records by ID or SKU, performs `update` for existing ones, `insert` for new ones, and `delete` only for those explicitly removed.

### 2. Broken Global Filtering (Inaccurate Results)
- **Location:** `app/api/products/route.ts` (GET handler)
- **Root Cause:** The API fetches a limited subset (`limit * 5`) and then applies color/size filters in memory. If matching products exist outside this small window, they are never found.
- **Fix:** Use PostgREST joins or filtered RPC/Functions to perform filtering at the database level.

### 3. Transaction-less Multi-Table Mutations
- **Location:** `app/api/products/route.ts` (POST) and `app/api/products/[slug]/route.ts` (PUT)
- **Root Cause:** Product, attributes, and variants are inserted across multiple sequential Supabase calls. If a variant insert fails, the product and attributes remain in a corrupted/incomplete state.
- **Fix:** Use a single `rpc` call or a database transaction to ensure atomicity.

## 🟠 Major Issues

### 1. Invalid Meta Aggregations
- **Location:** `app/api/products/route.ts` (GET handler)
- **Root Cause:** `meta.total`, `meta.minPrice`, and `meta.maxPrice` are calculated from the *filtered subset* rather than the entire catalog, providing misleading information to the frontend.
- **Fix:** Perform separate aggregation queries (e.g., `select(count)`) or use database functions to get global stats.

### 2. Broken Admin UI (Product List)
- **Location:** `app/admin/(dashboard)/products/page.tsx`
- **Root Cause:** The table attempts to display `product.stock_count`, but the `/api/products` endpoint does not include this field in its response.
- **Fix:** Update the API `cleanData` mapping to include `stock_count` or fetch it via a joined view.

### 3. Fragile Variant Re-mapping during Edit
- **Location:** `app/admin/(dashboard)/products/[slug]/edit/page.tsx`
- **Root Cause:** The frontend maps variants from the API back to internal state by matching string values (`option_value.toLowerCase()`) instead of using persistent IDs.
- **Fix:** Update the API to return the actual `option_id` within the variant options object.

## 🟡 Minor Issues

### 1. Sequential Image Uploads
- **Location:** `app/admin/(dashboard)/products/new/page.tsx`
- **Root Cause:** Images are uploaded one-by-one in an `await` loop, causing unnecessary delay for the user.
- **Fix:** Wrap uploads in `Promise.all()`.

### 2. Hardcoded API Placeholders
- **Location:** `app/api/products/route.ts`
- **Root Cause:** If a product has no image, a hardcoded placeholder URL is returned.
- **Fix:** Use a local public placeholder or handle missing images gracefully in the UI.

## ⚠️ False Features
- **Color/Size Filters:** These appear to work globally but actually only filter the first 40-50 products found. A user filtering for "Red" might see "No products found" even if the 51st product is red.

## 🚀 Performance Improvements
- **Database-Level Joins:** Move filtering for colors and sizes to the DB using `.match()` on a flattened view or JSONB containment operators.
- **Bulk Inserts:** Replace loops in `PUT` and `POST` handlers with single `.insert([...rows])` calls.

## 🧠 Architectural Improvements
- **Service Layer Separation:** Move logic out of Route Handlers into a dedicated `lib/services/product.ts`.
- **Zod Validation:** Replace manual checks with a robust Zod schema shared between frontend and backend.
