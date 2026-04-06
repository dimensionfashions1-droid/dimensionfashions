-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attribute_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attribute_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;

-- 1. Users can only read & update their own data
CREATE POLICY "Users can view own profile" 
  ON public.users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.users FOR UPDATE 
  USING (auth.uid() = id);

-- 2. Public Read Access (Products, Categories, Attributes, Reviews, Settings)
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read subcategories" ON public.subcategories FOR SELECT USING (true);
CREATE POLICY "Public read attribute_definitions" ON public.attribute_definitions FOR SELECT USING (true);
CREATE POLICY "Public read attribute_options" ON public.attribute_options FOR SELECT USING (true);
CREATE POLICY "Public read product_attributes" ON public.product_attributes FOR SELECT USING (true);
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public read reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);

-- 3. Public Read Access (Conditional)
CREATE POLICY "Public read active coupons" ON public.coupons FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active banners" ON public.banners FOR SELECT USING (is_active = true);

-- 4. Public Insert Access (Forms, Cart, Orders)
-- Anyone can leave a review
CREATE POLICY "Public insert reviews" ON public.reviews FOR INSERT WITH CHECK (true);
-- Anyone can subscribe to newsletter
CREATE POLICY "Public insert newsletter" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
-- Anyone can contact us
CREATE POLICY "Public insert contact" ON public.contact_submissions FOR INSERT WITH CHECK (true);
-- Anyone can place an order
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
-- Anyone can insert order items
CREATE POLICY "Public insert order_items" ON public.order_items FOR INSERT WITH CHECK (true);

-- 5. User-Scoped Access (Wishlist, Cart, Orders for logged-in users)
CREATE POLICY "Users view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users view own order items" ON public.order_items FOR SELECT USING (
  order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid())
);

CREATE POLICY "Users manage own wishlist" ON public.wishlist FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own cart" ON public.cart FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own addresses" ON public.user_addresses FOR ALL USING (auth.uid() = user_id);

-- Note: Guest carts, wishlists, and guest order retrieval will be handled securely 
-- via Next.js Route Handlers using the Supabase Service Role Key where appropriate.
-- Admin CRUD access is implicitly granted via the Service Role Key.
