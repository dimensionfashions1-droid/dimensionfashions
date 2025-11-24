export interface Product {
  id: number
  name: string
  category: string
  price: number
  originalPrice: number
  rating: number
  reviews: number
  image: string
  description: string
  colors: string[]
  fabric: string
  featured: boolean
}

export interface Category {
  id: number
  name: string
  description: string
  image: string
  slug: string
}

export interface CartItem extends Product {
  quantity: number
  selectedColor: string
}
