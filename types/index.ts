export interface Product {
    id: string
    title: string
    price: number
    category: string
    image: string
    images?: string[]
    colors?: string[]
    rating?: number
    reviews?: number
    inStock?: boolean
    description?: string
    status?: 'draft' | 'published'
    sizes?: string[]
    fabric?: string
    featured?: boolean
    slug?: string
    originalPrice?: number
    hasVariants?: boolean
}

// DB Table Interfaces

export interface CategoryRow {
    id: string
    name: string
    slug: string
    image_url?: string
    created_at: string
}

export interface SubcategoryRow {
    id: string
    category_id: string
    name: string
    slug: string
    image_url?: string
    created_at: string
}

export type AttributeType = 'select' | 'multi_select' | 'text' | 'color'

export interface AttributeDefinitionRow {
    id: string
    name: string
    slug: string
    type: AttributeType
    is_filterable: boolean
    is_variant: boolean
    display_order: number
    created_at: string
}

export interface AttributeOptionRow {
    id: string
    attribute_id: string
    value: string
    display_value?: string
    hex_code?: string
    display_order: number
}

export interface ProductRow {
    id: string
    title: string
    slug: string
    description?: string
    price: number
    original_price?: number
    category_id?: string
    subcategory_id?: string
    images: string[]
    status: 'draft' | 'published'
    rating: number
    reviews_count: number
    stock_count: number
    is_in_stock: boolean
    created_at: string
}

export interface ProductVariantRow {
    id: string
    product_id: string
    sku?: string
    price?: number
    original_price?: number
    stock_count: number
    images?: string[]
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface ProductVariantOptionRow {
    id: string
    variant_id: string
    attribute_id: string
    option_id: string
}

export interface ReviewRow {
    id: string
    product_id: string
    author_name: string
    author_email?: string
    rating: number
    title?: string
    content?: string
    helpful_count: number
    is_verified: boolean
    created_at: string
}

export interface BannerRow {
    id: string
    title: string
    subtitle?: string
    image_url: string
    link_url?: string
    display_order: number
    is_active: boolean
    starts_at?: string
    ends_at?: string
    created_at: string
}

export interface ContactSubmissionRow {
    id: string
    name: string
    email: string
    phone?: string
    subject?: string
    message: string
    is_read: boolean
    created_at: string
}

export interface NewsletterSubscriberRow {
    id: string
    email: string
    is_active: boolean
    created_at: string
}

// Frontend Render Interfaces

export interface CartItem {
    id: string
    productId: string
    title: string
    price: number
    image: string
    quantity: number
    variant?: string
    size?: string
    color?: string
    selectedColor?: string
}

export interface OrderItem {
    id: string
    order_id: string
    product_id: string
    title: string
    quantity: number
    price: number
    image?: string
    size?: string
    color?: string
}

export interface Order {
    id: string
    order_number: string
    total_amount: number
    order_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
    created_at: string
    user_id: string
    cancellation_requested: boolean
    cancellation_reason?: string
    items?: OrderItem[]
}

export interface UserAddress {
    id: string
    user_id: string
    title: string
    first_name: string
    last_name: string
    address: string
    city: string
    state: string
    pincode: string
    phone: string
    is_default: boolean
    created_at?: string
}

export interface UserProfile {
    id: string
    email: string
    first_name?: string
    last_name?: string
    phone?: string
    avatar_url?: string
    created_at?: string
}

export interface AuthUser {
    id: string
    email?: string
    user_metadata?: {
        first_name?: string
        last_name?: string
    }
}
