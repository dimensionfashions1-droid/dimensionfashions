-- 1. Extensions & Enums
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE order_status AS ENUM ('processing', 'shipped', 'delivered', 'cancelled', 'returned');
CREATE TYPE payment_method AS ENUM ('upi', 'card', 'cod');
CREATE TYPE attribute_type AS ENUM ('select', 'multi_select', 'text', 'color');

-- 2. Users (Extends auth.users)
CREATE TABLE public.users (
  id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_admin boolean DEFAULT false,
  first_name text,
  last_name text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (id)
);

-- Trigger to auto-create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, first_name, last_name)
  VALUES (new.id, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Categories
CREATE TABLE public.categories (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- 4. Subcategories
CREATE TABLE public.subcategories (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id uuid REFERENCES public.categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- 5. Attribute Definitions
CREATE TABLE public.attribute_definitions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  type attribute_type NOT NULL,
  is_filterable boolean DEFAULT false,
  is_variant boolean DEFAULT true,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 6. Attribute Options
CREATE TABLE public.attribute_options (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  attribute_id uuid REFERENCES public.attribute_definitions(id) ON DELETE CASCADE,
  value text NOT NULL,
  display_value text,
  hex_code text,
  display_order int DEFAULT 0
);

-- 7. Products
CREATE TABLE public.products (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  price numeric NOT NULL,
  original_price numeric,
  discount numeric DEFAULT 0,
  category_id uuid REFERENCES public.categories(id),
  subcategory_id uuid REFERENCES public.subcategories(id),
  images text[] NOT NULL,
  rating numeric DEFAULT 0,
  reviews_count int DEFAULT 0,
  stock_count int DEFAULT 0,
  is_in_stock boolean GENERATED ALWAYS AS (stock_count > 0) STORED,
  is_featured boolean DEFAULT false,
  is_best_seller boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 8. Product Attributes
CREATE TABLE public.product_attributes (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  attribute_id uuid REFERENCES public.attribute_definitions(id),
  option_id uuid REFERENCES public.attribute_options(id),
  text_value text
);

-- 9. Reviews
CREATE TABLE public.reviews (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  author_email text,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  content text,
  helpful_count int DEFAULT 0,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 10. Orders
CREATE TABLE public.orders (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id),
  order_number text NOT NULL UNIQUE,
  email text NOT NULL,
  phone text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  pincode text NOT NULL,
  subtotal numeric NOT NULL,
  shipping_cost numeric DEFAULT 0,
  discount_amount numeric DEFAULT 0,
  total_amount numeric NOT NULL,
  coupon_code text,
  payment_method payment_method DEFAULT 'upi',
  payment_status payment_status DEFAULT 'pending',
  order_status order_status DEFAULT 'processing',
  tracking_number text,
  courier_name text,
  razorpay_order_id text UNIQUE,
  razorpay_payment_id text,
  razorpay_signature text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- 11. Order Items
CREATE TABLE public.order_items (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id),
  title text NOT NULL,
  image text,
  quantity int NOT NULL,
  price_at_purchase numeric NOT NULL,
  selected_attributes jsonb
);

-- 12. Coupons
CREATE TABLE public.coupons (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  code text NOT NULL UNIQUE,
  discount_type text NOT NULL,
  discount_value numeric NOT NULL,
  min_order_amount numeric DEFAULT 0,
  max_uses int,
  used_count int DEFAULT 0,
  is_active boolean DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- 13. Banners
CREATE TABLE public.banners (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  subtitle text,
  image_url text NOT NULL,
  link_url text,
  placement text NOT NULL,
  display_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- 14. Site Settings
CREATE TABLE public.site_settings (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value text NOT NULL,
  description text,
  updated_at timestamptz DEFAULT now()
);

-- 15. Newsletter Subscribers
CREATE TABLE public.newsletter_subscribers (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- 16. Contact Submissions
CREATE TABLE public.contact_submissions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 17. Wishlist
CREATE TABLE public.wishlist (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id),
  guest_id uuid,
  product_id uuid REFERENCES public.products(id),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT chk_owner CHECK (user_id IS NOT NULL OR guest_id IS NOT NULL)
);

-- 18. Cart
CREATE TABLE public.cart (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id),
  guest_id uuid,
  product_id uuid REFERENCES public.products(id),
  quantity int DEFAULT 1,
  selected_attributes jsonb,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT chk_owner CHECK (user_id IS NOT NULL OR guest_id IS NOT NULL)
);

-- 19. User Addresses
CREATE TABLE public.user_addresses (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  title text,
  first_name text NOT NULL,
  last_name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  pincode text NOT NULL,
  phone text NOT NULL,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Generate updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_cart_updated_at BEFORE UPDATE ON public.cart FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_user_addresses_updated_at BEFORE UPDATE ON public.user_addresses FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
