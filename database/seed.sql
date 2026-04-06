-- Seed Categories
INSERT INTO public.categories (id, name, slug, image_url) VALUES 
('c1111111-1111-1111-1111-111111111111', 'Sarees', 'sarees', 'https://images.unsplash.com/photo-1583391733975-6664ea615c0a?auto=format&fit=crop&q=80&w=400'),
('c2222222-2222-2222-2222-222222222222', 'Lehengas', 'lehengas', 'https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?auto=format&fit=crop&q=80&w=400'),
('c3333333-3333-3333-3333-333333333333', 'Kurta Sets', 'kurta-sets', 'https://images.unsplash.com/photo-1595777457583-95e059f581eb?auto=format&fit=crop&q=80&w=400'),
('c4444444-4444-4444-4444-444444444444', 'Dresses', 'dresses', 'https://images.unsplash.com/photo-1555529771-331e84ae5b86?auto=format&fit=crop&q=80&w=400'),
('c5555555-5555-5555-5555-555555555555', 'Gowns', 'gowns', 'https://images.unsplash.com/photo-1580828369619-b414fccc41da?auto=format&fit=crop&q=80&w=400'),
('c6666666-6666-6666-6666-666666666666', 'Tops', 'tops', 'https://images.unsplash.com/photo-1594917172018-9366eecf46f4?auto=format&fit=crop&q=80&w=400'),
('c7777777-7777-7777-7777-777777777777', 'Co-ords', 'coords', 'https://images.unsplash.com/photo-1617265882583-b5419d280b2a?auto=format&fit=crop&q=80&w=400'),
('c8888888-8888-8888-8888-888888888888', 'Loungewear', 'loungewear', 'https://images.unsplash.com/photo-1610030469983-98e500b71826?auto=format&fit=crop&q=80&w=400')
ON CONFLICT (slug) DO NOTHING;

-- Seed Attribute Definitions
INSERT INTO public.attribute_definitions (id, name, slug, type, is_filterable, is_variant, display_order) VALUES
('a1111111-1111-1111-1111-111111111111', 'Color', 'color', 'color', true, true, 1),
('a2222222-2222-2222-2222-222222222222', 'Size', 'size', 'select', true, true, 2),
('a3333333-3333-3333-3333-333333333333', 'Fabric', 'fabric', 'text', true, false, 3),
('a4444444-4444-4444-4444-444444444444', 'Craft', 'craft', 'text', false, false, 4),
('a5555555-5555-5555-5555-555555555555', 'Care', 'care', 'text', false, false, 5)
ON CONFLICT (name) DO NOTHING;

-- Seed Attribute Options for Color
INSERT INTO public.attribute_options (attribute_id, value, display_value, hex_code) VALUES
('a1111111-1111-1111-1111-111111111111', 'Maroon', 'Maroon', '#6B1D2A'),
('a1111111-1111-1111-1111-111111111111', 'Navy', 'Navy Blue', '#1B2A4A'),
('a1111111-1111-1111-1111-111111111111', 'Emerald', 'Emerald Green', '#1B4332'),
('a1111111-1111-1111-1111-111111111111', 'Gold', 'Gold', '#B8860B'),
('a1111111-1111-1111-1111-111111111111', 'Black', 'Onyx Black', '#000000'),
('a1111111-1111-1111-1111-111111111111', 'Ivory', 'Ivory', '#FFFFF0')
ON CONFLICT DO NOTHING;

-- Seed Attribute Options for Size
INSERT INTO public.attribute_options (attribute_id, value, display_order) VALUES
('a2222222-2222-2222-2222-222222222222', 'XS', 1),
('a2222222-2222-2222-2222-222222222222', 'S', 2),
('a2222222-2222-2222-2222-222222222222', 'M', 3),
('a2222222-2222-2222-2222-222222222222', 'L', 4),
('a2222222-2222-2222-2222-222222222222', 'XL', 5),
('a2222222-2222-2222-2222-222222222222', 'Standard', 6)
ON CONFLICT DO NOTHING;

-- Seed Site Settings
INSERT INTO public.site_settings (key, value, description) VALUES
('free_shipping_threshold', '2999', 'Amount above which shipping is free'),
('flat_shipping_rate', '99', 'Standard shipping cost'),
('cod_extra_charge', '49', 'Extra fee for COD'),
('return_days', '7', 'Number of days to return products'),
('store_email', 'hello@dimensions.in', 'Contact email shown in footer'),
('store_phone', '+91 98765 43210', 'Contact phone shown in footer'),
('instagram_url', 'https://instagram.com/dimensions', 'Instagram URL'),
('facebook_url', 'https://facebook.com/dimensions', 'Facebook URL')
ON CONFLICT (key) DO NOTHING;
