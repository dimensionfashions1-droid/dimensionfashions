export interface Product {
    id: string
    title: string
    price: number
    category: string
    image: string
    colors?: string[]
    discount?: number
    rating?: number
    reviews?: number
    inStock?: boolean
    description?: string
    sizes?: string[]
    fabric?: string
    featured?: boolean
    slug?: string
    originalPrice?: number
}

export interface Category {
    id: string
    name: string
    description: string
    image: string
    slug: string
}

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
