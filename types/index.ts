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
}
