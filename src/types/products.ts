export interface Product {
  id: string
  name: string
  description?: string
  price: number
  unit: string
  category: string
  image?: string
  origin?: string
  nutritionalInfo?: {
    calories: string
    protein: string
    carbs: string
    fat: string
    fiber: string
  }
}
