-- 20. Product Variants
-- Stores specific versions of a product (e.g., Red-XL, Blue-M)
CREATE TABLE public.product_variants (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sku text UNIQUE,
  price numeric, -- Override main product price
  original_price numeric, -- Override main product original_price
  stock_count int DEFAULT 0,
  images text[], -- Variant specific images (e.g., only shows Red images)
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
  
);

-- 21. Product Variant Options
-- Links a variant to its specific attribute combination
-- e.g., Variant ID 1 -> Color: Red, Size: XL
CREATE TABLE public.product_variant_options (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  variant_id uuid NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
  attribute_id uuid NOT NULL REFERENCES public.attribute_definitions(id),
  option_id uuid NOT NULL REFERENCES public.attribute_options(id),
  UNIQUE(variant_id, attribute_id) -- Ensures a variant doesn't have multiple options for the same attribute
);

-- Index for performance
CREATE INDEX idx_variants_product_id ON public.product_variants(product_id);
CREATE INDEX idx_variant_options_variant_id ON public.product_variant_options(variant_id);

-- Trigger for updated_at
CREATE TRIGGER update_product_variants_updated_at 
BEFORE UPDATE ON public.product_variants 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
