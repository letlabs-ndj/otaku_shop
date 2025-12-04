export interface Product {
  id: number
  name: string
  price: number
  image: string
  category: string
}

export interface ProductsData {
  products: Product[]
  categories: string[]
}

export interface AdminUser {
  username: string
  password: string
}
